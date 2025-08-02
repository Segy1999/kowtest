# KowTattys Database Schema

This directory contains the database schema and migrations for the KowTattys application.

## Tables

### Profiles
- Stores user profile information
- Links to Supabase auth.users table
- Includes role-based access control (admin/user)
- RLS policies ensure users can only update their own profiles
- Only admins can delete profiles

### Bookings
- Stores tattoo booking requests
- Includes contact info, preferred date, and special requests
- Supports reference photo uploads
- Status tracking (pending/confirmed/cancelled)
- RLS policies restrict viewing to admins only
- Anyone can create a booking

### Portfolio
- Stores tattoo portfolio items
- Includes images, descriptions, and categories
- Support for featured items
- Publicly viewable
- Only admins can modify

### Content
- Stores dynamic content for the website
- Key-value pairs with descriptions
- Publicly viewable
- Only admins can modify

## Row Level Security (RLS)

All tables have RLS enabled with the following general rules:
1. Public data (portfolio, content) is viewable by everyone
2. Private data (bookings) is only viewable by admins
3. Users can only update their own profiles
4. Only admins can modify most data

## Functions

### handle_updated_at()
- Automatically updates the updated_at timestamp when records are modified

### set_claim()
- Allows admins to set user claims in auth.users
- Used for role-based access control

## Setup Process

1. Create a new Supabase project
2. Apply the migrations:
   ```bash
   supabase db reset
   ```
3. Set up your environment variables in .env.local:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_ADMIN_SETUP_ENABLED=true
   VITE_ADMIN_SETUP_KEY=your_setup_key
   ```
4. Create the first admin user through the admin setup page
5. Disable admin setup by setting VITE_ADMIN_SETUP_ENABLED to false

## Type Safety

The schema is fully typed with TypeScript definitions in `src/lib/types.ts`. The Supabase client is configured to use these types for complete type safety across the application.
