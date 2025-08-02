# Deployment Guide

## Environment Variables

To deploy this application successfully, you need to set up the following environment variables in your Netlify dashboard:

### Required Environment Variables

1. **VITE_SUPABASE_URL** - Your Supabase project URL
2. **VITE_SUPABASE_ANON_KEY** - Your Supabase anonymous key

### Optional Environment Variables

3. **VITE_ADMIN_SETUP_ENABLED** - Set to 'true' to enable admin setup (default: false)
4. **VITE_ADMIN_SETUP_KEY** - Secret key for admin setup process
5. **VITE_IMAGE_DOMAIN** - Your Supabase image domain for optimization

## Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set the build command to: `npm run build`
3. Set the publish directory to: `dist`
4. Add the environment variables listed above in the Netlify dashboard
5. Deploy!

## Build Configuration

The application has been configured to handle missing environment variables gracefully during build time. If Supabase environment variables are not available, the application will:

- Build successfully without database functionality
- Show appropriate error messages to users
- Allow the site to be deployed as a static site

## Troubleshooting

If you encounter build errors:

1. Check that all required environment variables are set in Netlify
2. Verify that your Supabase project is properly configured
3. Ensure your repository has all necessary dependencies in package.json
4. Check the build logs for specific error messages

## Local Development

To run the project locally:

1. Copy the environment variables to a `.env` file
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:3000 