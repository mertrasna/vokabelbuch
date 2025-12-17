# Deployment Guide 🚀

This guide will help you deploy Vokabelbuch to production using Vercel and connect your domain.

## Prerequisites

- ✅ Code pushed to GitHub repository
- ✅ Domain: vokabelbuch.com (you own it!)
- ✅ Vercel account (free) - [vercel.com](https://vercel.com)
- ✅ PostgreSQL database (Neon recommended)

---

## Step 1: Set Up Production Database

### Option A: Neon (Recommended - Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Sign up / Log in
3. Click "Create Project"
4. Name: `vokabelbuch-prod`
5. Region: Choose closest to your users (e.g., US East, EU Central)
6. Copy the connection string
7. Keep this tab open - you'll need it later!

### Option B: Supabase (Alternative)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database setup
4. Go to Settings → Database
5. Copy connection string (use "Connection pooling" for better performance)

### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy connection string from "Connect" tab

---

## Step 2: Deploy to Vercel

### 2.1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Vokabelbuch MVP"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/vokabelbuch.git
git branch -M main
git push -u origin main
```

### 2.2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### 2.3: Add Environment Variables

Click "Environment Variables" and add:

```env
DATABASE_URL = postgresql://user:password@host.neon.tech/dbname?sslmode=require

NEXTAUTH_URL = https://vokabelbuch.com

NEXTAUTH_SECRET = [generate-new-secret]
```

**Important:** Generate a NEW secret for production:
```bash
openssl rand -base64 32
```

### 2.4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Your app will be live at: `https://vokabelbuch.vercel.app`

---

## Step 3: Run Database Migrations

After first deployment, you need to set up the database:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.production
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### Option B: Using Prisma Data Platform

1. Go to your database provider (Neon/Supabase)
2. Open SQL Editor
3. Copy migrations from `prisma/migrations/` folder
4. Run SQL manually

### Option C: Temporary Build Script

Add to `package.json`:
```json
"scripts": {
  "vercel-build": "prisma generate && prisma migrate deploy && next build"
}
```

Vercel will auto-run migrations on each deploy.

---

## Step 4: Connect Your Domain

### 4.1: Add Domain in Vercel

1. Go to your project in Vercel
2. Settings → Domains
3. Add `vokabelbuch.com`
4. Add `www.vokabelbuch.com` (optional)

### 4.2: Update DNS Records

Vercel will show you DNS records to add. Go to your domain registrar (GoDaddy, Namecheap, etc.):

**For apex domain (vokabelbuch.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

### 4.3: Wait for DNS Propagation

- Usually takes 5-30 minutes
- Can take up to 48 hours
- Check status: [whatsmydns.net](https://www.whatsmydns.net/)

### 4.4: Update Environment Variable

Once DNS is propagated:

1. Go to Vercel → Settings → Environment Variables
2. Update `NEXTAUTH_URL` to `https://vokabelbuch.com`
3. Redeploy the project

---

## Step 5: Verify Deployment

### Test Checklist

- [ ] Visit https://vokabelbuch.com
- [ ] Homepage loads correctly
- [ ] Register new account
- [ ] Verify email format works
- [ ] Login successfully
- [ ] Add a German word
- [ ] View word in dashboard
- [ ] Take a quiz
- [ ] Check quiz results saved
- [ ] Logout and login again
- [ ] Test on mobile device

---

## Step 6: Post-Deployment Setup

### 6.1: Set Up Monitoring

**Vercel Analytics (Built-in):**
1. Go to project → Analytics
2. Enable Web Analytics
3. Monitor page views, performance

**Error Tracking (Optional):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 6.2: Performance Optimization

Add to `next.config.ts`:
```typescript
const config: NextConfig = {
  images: {
    domains: ['yourdomain.com'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### 6.3: Security Headers

Add to `next.config.ts`:
```typescript
const config: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ]
  },
}
```

### 6.4: Database Backups

**Neon:**
- Automatic daily backups (retain 7 days)
- Manual backups in dashboard
- Point-in-time recovery available

**Supabase:**
- Automatic backups (Pro plan)
- Export via dashboard
- Use `pg_dump` for manual backups

**Manual Backup Script:**
```bash
# Add to package.json scripts:
"backup": "pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql"
```

---

## Step 7: Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Runs tests
# 4. Deploys to production
# 5. Updates https://vokabelbuch.com
```

### Preview Deployments

- Every branch gets preview URL
- Perfect for testing before production
- Share with team: `https://vokabelbuch-git-feature.vercel.app`

### Environment per Branch

```
main branch → https://vokabelbuch.com (production)
dev branch → https://vokabelbuch-git-dev.vercel.app (staging)
feature branches → Preview URLs
```

---

## Troubleshooting

### Build Fails on Vercel

**Error:** "Cannot find module '@prisma/client'"

**Solution:**
```json
// package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Fails

**Error:** "Can't reach database server"

**Solutions:**
1. Check DATABASE_URL is correct
2. Ensure SSL is enabled: `?sslmode=require`
3. Whitelist Vercel IPs (usually not needed)
4. Check database is not sleeping (free tier)

### NextAuth Errors

**Error:** "Invalid NEXTAUTH_URL"

**Solution:**
1. Ensure NEXTAUTH_URL matches your domain
2. Include https://
3. No trailing slash
4. Redeploy after changing

### Domain Not Working

**Solutions:**
1. Check DNS records in registrar
2. Wait longer (up to 48h)
3. Clear browser cache
4. Try incognito mode
5. Check DNS: `nslookup vokabelbuch.com`

---

## Scaling Considerations

### When to Upgrade

**Vercel Free Tier Limits:**
- 100 GB bandwidth/month
- 100 GB-hours serverless execution
- 1000 image optimizations
- Usually sufficient for 10,000+ users/month

**Database Free Tier (Neon):**
- 0.5 GB storage
- 10 GB data transfer
- 1 concurrent connection
- ~1000-5000 users

### Upgrade Path

**Growing (1000+ active users):**
- Neon Pro: $19/month (10GB storage)
- Vercel Pro: $20/month (if needed)
- Total: ~$40/month

**Scaling (10,000+ users):**
- Neon Scale: $50/month (50GB storage)
- Vercel Pro: $20/month
- CDN for images: $10/month
- Total: ~$80/month

**Enterprise (100,000+ users):**
- Consider dedicated hosting
- AWS RDS or similar
- Load balancing
- Redis caching
- Multiple regions

---

## Monitoring & Maintenance

### Weekly Tasks
- Check error logs in Vercel dashboard
- Monitor user growth
- Review database size
- Check uptime status

### Monthly Tasks
- Review analytics
- Update dependencies: `npm update`
- Database optimization
- Backup verification
- Security updates

### Quarterly Tasks
- Major dependency updates
- Feature review
- User feedback analysis
- Performance optimization
- Cost review

---

## Success! 🎉

Your app is now live at **https://vokabelbuch.com**

Share it with:
- German language learners
- Language learning communities
- Social media
- Product Hunt (after polish)
- Reddit: r/German, r/languagelearning

---

## Next Steps

1. ✅ Add Google Analytics
2. ✅ Set up error monitoring (Sentry)
3. ✅ Create social media accounts
4. ✅ Gather user feedback
5. ✅ Plan Phase 2 features (see mvp_plan.md)
6. ✅ Consider blog for SEO
7. ✅ Build email list

---

**Congratulations on launching Vokabelbuch! 🚀**

For questions or issues, check:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)

