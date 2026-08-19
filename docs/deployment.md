# Deployment Guide

## Production Deployment Checklist

1. **Environment Variables**:
   Set production variables in hosting environment (Vercel, Render, Railway, or AWS):
   ```env
   NODE_ENV="production"
   PORT=5000
   DATABASE_URL="postgresql://user:password@host:5432/preptrack"
   JWT_SECRET="your-high-entropy-production-secret"
   GROK_API_KEY="your-xai-grok-api-key"
   GROK_API_URL="https://api.x.ai/v1/chat/completions"
   ```

2. **Database Migration**:
   In production with PostgreSQL:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

3. **Frontend Build**:
   ```bash
   npm run build
   ```

4. **Production Start**:
   ```bash
   npm start
   ```
