# Fiber Project Tracker - Deployment Guide

## Overview

This guide covers deploying the Fiber Project Tracker application to various environments.

---

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

---

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secure-secret-key-min-32-chars

# Email Configuration (Phase 6)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@yourdomain.com

# Database (Phase 9 - when implemented)
# DATABASE_URL=postgresql://user:password@localhost:5432/fiber_tracker
```

### Generating a Secure Secret

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd Fiber-Project-Tracker

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Visit:
- Customer Portal: http://localhost:3000
- Admin Portal: http://localhost:3000/admin

---

## Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Build Output

The build creates an optimized production bundle in the `.next` folder:
- Server-side rendered pages
- Static assets
- API routes

---

## Deployment Options

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t fiber-tracker .
docker run -p 3000:3000 fiber-tracker
```

### PM2 (Self-hosted)

```bash
# Install PM2
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "fiber-tracker" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## Health Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-02-05T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "environment": "production"
}
```

### Recommended Monitoring

1. **Uptime Monitoring**: Use services like UptimeRobot or Pingdom
2. **Error Tracking**: Configure Sentry (see Phase 8 documentation)
3. **Performance**: Monitor Core Web Vitals with Vercel Analytics

---

## Security Checklist

Before deploying to production:

- [ ] Set strong `NEXTAUTH_SECRET` (minimum 32 characters)
- [ ] Configure `NEXTAUTH_URL` to production domain
- [ ] Enable HTTPS (handled by hosting platform)
- [ ] Review security headers in `next.config.js`
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Remove or secure test credentials
- [ ] Configure rate limiting (if needed)
- [ ] Set up proper CORS configuration

---

## Performance Optimization

### Recommended Settings

```js
// next.config.js
module.exports = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Enable standalone output for Docker
  output: 'standalone',
};
```

### Caching Strategy

- Static assets: Cached indefinitely with hash-based filenames
- API responses: Configure appropriate Cache-Control headers
- Pages: ISR (Incremental Static Regeneration) where applicable

---

## Troubleshooting

### Common Issues

**Build fails with memory error**
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Authentication not working**
- Verify `NEXTAUTH_URL` matches your domain exactly
- Ensure `NEXTAUTH_SECRET` is set
- Check browser console for CSRF errors

**Styles not loading**
- Clear `.next` folder and rebuild
- Check for CSS purging issues in Tailwind config

### Logs

```bash
# PM2 logs
pm2 logs fiber-tracker

# Docker logs
docker logs <container-id>

# Vercel logs
vercel logs
```

---

## Rollback Procedure

### Vercel
1. Go to Deployments in Vercel dashboard
2. Find the previous working deployment
3. Click "Promote to Production"

### Docker
```bash
# Keep previous image tagged
docker tag fiber-tracker:latest fiber-tracker:backup
docker run -p 3000:3000 fiber-tracker:backup
```

### PM2
```bash
# If using git
git checkout <previous-commit>
npm run build
pm2 restart fiber-tracker
```

---

## Scaling

### Horizontal Scaling

The application is stateless and can be scaled horizontally:

1. **Load Balancer**: Use nginx, HAProxy, or cloud load balancer
2. **Multiple Instances**: Run multiple Node.js processes
3. **Session Storage**: JWT tokens are stateless (no shared session storage needed)

### Vertical Scaling

Minimum recommended specs:
- **Development**: 1 CPU, 1GB RAM
- **Production**: 2 CPU, 2GB RAM
- **High Traffic**: 4 CPU, 4GB RAM

---

## Database Migration (Phase 9)

When Phase 9 is implemented:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

---

*Last Updated: February 2026*
