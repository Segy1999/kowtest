export interface Profile {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  created_at: string;
  updated_at: string;
  
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pronouns: string | null;
  
  is_custom: boolean;
  tattoo_idea: string | null;
  tattoo_size: string | null;
  tattoo_placement: string | null;
  reference_photos: string[] | null;
  availability: string[] | null;
  allergies: string | null;
  is_over_18: boolean;
  
  flash_design_id: number | null;
  
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  
  special_requests: string | null;
  admin_notes: string | null;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  featured: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: number;
  key: string;
  value: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface FlashDesign {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  category: string;
  available: boolean;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>;
      };
      portfolio: {
        Row: PortfolioItem;
        Insert: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>>;
      };
      content: {
        Row: ContentItem;
        Insert: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
