import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/types';
import { useToast } from './use-toast';
import { FlashDesign } from '@/lib/types';

// Define Message type
export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export const useSupabase = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleError = useCallback((error: Error) => {
    console.error('Supabase error:', error);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error.message,
    });
  }, [toast]);

  // Check if Supabase is available
  const isSupabaseAvailable = !!supabase;

  const createBooking = useCallback(async (booking: Database['public']['Tables']['bookings']['Insert']) => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available, booking creation skipped');
      return false;
    }

    try {
      console.log('Attempting to create booking with data:', booking);
      
      // Validate required fields before sending
      const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'is_custom'];
      for (const field of requiredFields) {
        if (booking[field as keyof typeof booking] === undefined) {
          console.error(`Missing required field: ${field}`);
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      const { error, data } = await supabase!
        .from('bookings')
        .insert(booking)
        .select('id')
        .single();
    
      if (error) {
        console.error('Booking error:', error);
        throw error;
      }
      
      console.log('Booking created successfully:', data);
      return true; // Return success boolean instead of the data
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }, [isSupabaseAvailable]);

  const uploadImage = useCallback(async (file: File, path: string) => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available, image upload skipped');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase!.storage
        .from('reference-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase!.storage
        .from('reference-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  }, [handleError, isSupabaseAvailable]);

  const getFeaturedWorks = useCallback(async () => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available, returning null for featured works');
      return null;
    }

    try {
      const { data, error } = await supabase!
        .from('portfolio')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  }, [handleError, isSupabaseAvailable]);

  const getPortfolioItems = useCallback(async (category?: string) => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available, returning null for portfolio items');
      return null;
    }

    try {
      let query = supabase!
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  }, [handleError, isSupabaseAvailable]);

  const getFlashDesigns = useCallback(async (): Promise<FlashDesign[] | null> => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available, returning null for flash designs');
      return null;
    }

    try {
      const { data, error } = await supabase!
        .from('flash_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  }, [handleError, isSupabaseAvailable]);

  const getFlashDesignById = useCallback(async (id: number): Promise<FlashDesign | null> => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available, returning null for flash design');
      return null;
    }

    try {
      const { data, error } = await supabase!
        .from('flash_designs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  }, [handleError, isSupabaseAvailable]);

  const createFlashDesignBooking = useCallback(async (bookingData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    flash_design_id: number;
    tattoo_size: string;
    tattoo_placement: string;
    preferred_date?: string | null;
    availability?: string[] | null;
    pronouns?: string | null;
    allergies?: string | null;
    instagram?: string | null;
    special_requests?: string | null;
  }) => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available, flash design booking creation skipped');
      return false;
    }

    try {
      const { error } = await supabase!
        .from('bookings')
        .insert({
          ...bookingData,
          is_custom: false,
          status: 'pending'
        });
  
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleError, isSupabaseAvailable]);

  // Fetch messages for a booking
  const fetchMessages = useCallback(async (bookingId: string) => {
    if (!bookingId || !isSupabaseAvailable) {
      console.warn('Supabase not available or no booking ID, skipping message fetch');
      return;
    }
    
    setIsFetchingMessages(true);
    try {
      const { data, error } = await supabase!
        .from('messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        handleError(error as Error);
        setMessages([]);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      handleError(error as Error);
      setMessages([]);
    } finally {
      setIsFetchingMessages(false);
    }
  }, [handleError, isSupabaseAvailable]);

  // Send a new message
  const sendMessage = useCallback(async (bookingId: string, message: string) => {
    if (!message?.trim() || !isSupabaseAvailable) {
      console.warn('Supabase not available or no message, skipping message send');
      return;
    }
    
    setIsSendingMessage(true);
    try {
      const { error } = await supabase!
        .from('messages')
        .insert({
          booking_id: bookingId,
          message: message.trim(),
          sender_id: (await supabase!.auth.getUser()).data.user?.id
        });

      if (error) {
        handleError(error as Error);
      }
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsSendingMessage(false);
    }
  }, [handleError, isSupabaseAvailable]);

  // Subscribe to new messages
  const subscribeToMessages = useCallback((bookingId: string, callback?: (payload: any) => void) => {
    if (!isSupabaseAvailable) {
      console.warn('Supabase not available, skipping message subscription');
      return null;
    }

    const channel = supabase!
      .channel(`public:messages:booking_id=eq.${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages((currentMessages) => [...currentMessages, payload.new as Message]);
          if (callback) callback(payload);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to messages for booking ${bookingId}`);
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          handleError(err || new Error(`Subscription error: ${status}`));
        }
      });

    return channel;
  }, [handleError, isSupabaseAvailable]);

  return {
    createBooking,
    uploadImage,
    getFeaturedWorks,
    getPortfolioItems,
    getFlashDesigns,
    getFlashDesignById,
    createFlashDesignBooking,
    messages,
    isFetchingMessages,
    isSendingMessage,
    fetchMessages,
    sendMessage,
    subscribeToMessages,
    isSupabaseAvailable,
  };
};
