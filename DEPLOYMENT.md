# 🚀 Deployment Guide for tradeo

This guide will help you deploy your tradeo application to Netlify with all the necessary configurations.

## Prerequisites

Before deploying, make sure you have:
- [ ] Supabase project set up
- [ ] Clerk application configured
- [ ] Perplexity AI API key
- [ ] GitHub repository ready

## Step 1: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Setup**
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `database-setup.sql`
   - Execute the script

3. **Verify Tables**
   - Check that `profiles` and `stock_analyses` tables are created
   - Verify RLS policies are enabled

## Step 2: Configure Clerk Authentication

1. **Create Clerk Application**
   - Go to [clerk.com](https://clerk.com)
   - Create a new application
   - Choose your preferred sign-in methods

2. **Configure Domains**
   - Add your production domain to allowed domains
   - Set up redirect URLs:
     - Sign-in URL: `/sign-in`
     - Sign-up URL: `/sign-up`
     - After sign-in URL: `/dashboard`
     - After sign-up URL: `/dashboard`

3. **Get API Keys**
   - Copy your publishable key
   - Copy your secret key

## Step 3: Get Perplexity AI API Key

1. **Sign Up for Perplexity AI**
   - Go to [perplexity.ai](https://www.perplexity.ai/settings/api)
   - Create an account and get your API key
   - Note the rate limits for your plan

## Step 4: Deploy to Netlify

### Option A: Connect GitHub Repository

1. **Fork the Repository**
   ```bash
   # Fork this repository to your GitHub account
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your forked repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

### Option B: Manual Deployment

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

## Step 5: Configure Environment Variables

In your Netlify dashboard, go to Site settings > Environment variables and add:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
CLERK_SECRET_KEY=sk_live_your_key_here

# Clerk URLs (update with your domain)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Perplexity AI
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# App Configuration (update with your domain)
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

## Step 6: Configure DNS (Optional)

If you have a custom domain:

1. **Add Custom Domain**
   - Go to Site settings > Domain management
   - Add your custom domain

2. **Update Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Update Clerk allowed domains

3. **Update Clerk Configuration**
   - Add your custom domain to Clerk dashboard
   - Update redirect URLs

## Step 7: Test Deployment

1. **Visit Your Site**
   - Navigate to your Netlify URL
   - Test sign-up/sign-in functionality

2. **Test Stock Analysis**
   - Try analyzing a stock (e.g., AAPL)
   - Verify data is saved to Supabase

3. **Check Dashboard**
   - Ensure analysis history displays correctly
   - Verify user data persistence

## Common Issues & Solutions

### Build Failures

**Issue**: `Module not found` errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Issue**: Environment variables not accessible
```bash
# Solution: Ensure variables are prefixed correctly
# Client-side: NEXT_PUBLIC_
# Server-side: No prefix needed
```

### Authentication Issues

**Issue**: Redirect loops
- Check Clerk redirect URLs match your deployment URL
- Verify middleware configuration

**Issue**: 401 errors
- Verify Clerk secret key is set
- Check API route protection

### Database Issues

**Issue**: RLS policy errors
- Verify RLS policies are enabled
- Check user authentication flow

**Issue**: Connection errors
- Verify Supabase URL and keys
- Check network policies

## Performance Optimization

1. **Enable Edge Functions**
   ```bash
   # In netlify.toml
   [build.environment]
   NEXT_PRIVATE_TARGET = "server"
   ```

2. **Configure Caching**
   - Static assets cached for 1 year
   - API responses cached appropriately

3. **Monitor Performance**
   - Use Netlify Analytics
   - Monitor Supabase usage
   - Track Perplexity AI usage

## Security Checklist

- [ ] Environment variables are properly set
- [ ] RLS policies are enabled on all tables
- [ ] CORS is configured correctly
- [ ] CSP headers are in place
- [ ] API keys are not exposed client-side

## Backup Strategy

1. **Database Backups**
   - Supabase provides automatic backups
   - Export critical data regularly

2. **Code Backups**
   - Keep GitHub repository updated
   - Tag releases for rollbacks

## Monitoring & Maintenance

1. **Set Up Monitoring**
   - Netlify function monitoring
   - Supabase dashboard monitoring
   - Error tracking (optional: Sentry)

2. **Regular Updates**
   - Update dependencies monthly
   - Monitor security advisories
   - Test functionality after updates

## Support

If you encounter issues:
1. Check the troubleshooting section in README.md
2. Verify all environment variables are correct
3. Check service status pages (Netlify, Supabase, Clerk)
4. Review deployment logs in Netlify dashboard

## Next Steps

After successful deployment:
- [ ] Set up custom domain
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerts
- [ ] Plan for scaling (if needed)
- [ ] Document any customizations

---

🎉 **Congratulations!** Your tradeo application should now be live and ready for users!