import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

interface AdminUserData {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface AdminSetupResult {
  success: boolean;
  user?: any;
  message?: string;
  error?: string;
  errorCode?: string;
}

const PASSWORD_MIN_LENGTH = 8;
const USERNAME_MIN_LENGTH = 3;
const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatePassword = (password: string): string | null => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

const validateAdminData = (userData: AdminUserData): string | null => {
  if (!VALID_EMAIL_REGEX.test(userData.email)) {
    return 'Invalid email format';
  }
  if (userData.username.length < USERNAME_MIN_LENGTH) {
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters`;
  }
  return validatePassword(userData.password);
};

export async function createAdminUser(userData: AdminUserData): Promise<AdminSetupResult> {
  const logger = {
    info: (message: string, data?: any) => console.log(`[Admin Setup] ${message}`, data || ''),
    error: (message: string, error: any) => console.error(`[Admin Setup Error] ${message}`, error)
  };

  try {
    if (!supabase) {
      throw new Error('Database connection is not available');
    }

    logger.info('Starting admin user creation...', { email: userData.email, username: userData.username });

    // Validate input data
    const validationError = validateAdminData(userData);
    if (validationError) {
      throw new Error(validationError);
    }

    // Fix: Properly format the OR condition in the existing user check
    const { data: existingUser, error: existingUserError } = await supabase
      .from('profiles')
      .select('id')
      .or(`email.eq.${userData.email},username.eq.${userData.username}`)
      .single();

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      throw existingUserError;
    }

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
          role: 'admin',
          firstName: userData.firstName,
          lastName: userData.lastName
        },
        emailRedirectTo: `${window.location.origin}/admin/login`,
      }
    });

    if (authError) {
      handleAuthError(authError, logger);
    }

    if (!authData?.user) {
      throw new Error('No user data returned from authentication');
    }

    logger.info('Auth user created', { userId: authData.user.id });

    // Add delay to ensure auth user is properly created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create profile with upsert instead of insert to handle race conditions
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        username: userData.username,
        email: userData.email,
        role: 'admin',
        first_name: userData.firstName,
        last_name: userData.lastName,
        updated_at: new Date().toISOString()
      } satisfies Partial<Profile>, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (profileError) {
      logger.error('Profile creation failed', profileError);
      await cleanupFailedSetup(authData.user.id);
      throw profileError;
    }

    // Set up admin claims and permissions
    const { error: roleError } = await supabase.rpc('set_claim', {
      uid: authData.user.id,
      claim: 'role',
      value: 'admin'
    });

    if (roleError) {
      logger.error('Role setup failed', roleError);
      await cleanupFailedSetup(authData.user.id);
      throw roleError;
    }

    logger.info('Admin setup completed successfully');

    return {
      success: true,
      user: authData.user,
      message: 'Admin user created successfully. Please check your email for confirmation.'
    };

  } catch (error: any) {
    logger.error('Admin creation failed', error);
    return {
      success: false,
      error: error.message,
      errorCode: error.code || 'UNKNOWN_ERROR'
    };
  }
}

async function cleanupFailedSetup(userId: string): Promise<void> {
  if (!supabase) return;
  
  try {
    await supabase.auth.admin.deleteUser(userId);
    await supabase.from('profiles').delete().match({ id: userId });
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

function handleAuthError(error: any, logger: any): never {
  if (error.message.includes('not authorized') || error.message.includes('email domain')) {
    logger.error('Email restriction error', error);
    throw new Error(
      'Email domain not authorized. Please contact your Supabase administrator to configure allowed email domains.'
    );
  }
  throw error;
}

export async function verifyAdminAccess(userId: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not available, admin access verification failed');
    return false;
  }

  try {
    const [profileResult, claimsResult] = await Promise.all([
      supabase.from('profiles').select('role').eq('id', userId).single(),
      supabase.rpc('get_claim', { uid: userId, claim: 'role' })
    ]);

    if (profileResult.error || claimsResult.error) {
      throw new Error('Failed to verify admin access');
    }

    return profileResult.data?.role === 'admin' && claimsResult.data === 'admin';
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return false;
  }
}

export const adminActionRateLimit = new Map<string, number>();