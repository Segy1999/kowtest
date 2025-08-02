import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

export type Tables = {
  bookings: {
    Row: {
      id: string;
      created_at: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      instagram: string | null;
      preferred_date: string | null;
      special_requests: string | null;
      reference_photos: string[] | null;
      referral_source: string | null;
      other_referral: string | null;
      status: 'pending' | 'confirmed' | 'cancelled';
    };
    Insert: Omit<Tables['bookings']['Row'], 'id' | 'created_at'>;
    Update: Partial<Tables['bookings']['Insert']>;
  };
  portfolio: {
    Row: {
      id: string;
      created_at: string;
      title: string;
      description: string | null;
      image_url: string;
      category: string;
      tags: string[];
      featured: boolean;
    };
    Insert: Omit<Tables['portfolio']['Row'], 'id' | 'created_at'>;
    Update: Partial<Tables['portfolio']['Insert']>;
  };
};
