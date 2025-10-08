# Production Readiness Guide

## Overview

This guide provides comprehensive information for deploying and maintaining the CortexCloud SaaS application in production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Third-Party Integrations](#third-party-integrations)
5. [Security Considerations](#security-considerations)
6. [Performance Optimization](#performance-optimization)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Deployment Strategies](#deployment-strategies)
9. [Maintenance Procedures](#maintenance-procedures)
10. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests pass (unit, integration, e2e)
- [ ] Code coverage > 80%
- [ ] No linting errors
- [ ] No security vulnerabilities
- [ ] Performance benchmarks met
- [ ] Accessibility compliance (WCAG 2.1 AA)

### Environment Setup
- [ ] Production environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] CDN configured
- [ ] Backup systems in place

### Security
- [ ] API keys rotated
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled

## Environment Configuration

### Required Environment Variables

```env
# Application
NODE_ENV=production
VITE_APP_URL=https://your-domain.com
VITE_API_URL=https://api.your-domain.com

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google APIs
VITE_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service
VITE_EMAIL_SERVICE_URL=https://api.emailservice.com
VITE_EMAIL_API_KEY=your-email-api-key

# Payment Processing
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info
```

### Environment-Specific Configurations

#### Development
```env
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_DEV_TOOLS=true
```

#### Staging
```env
NODE_ENV=staging
LOG_LEVEL=info
ENABLE_DEV_TOOLS=false
```

#### Production
```env
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_DEV_TOOLS=false
```

## Database Setup

### Supabase Configuration

1. **Create Production Project**
   ```sql
   -- Run in Supabase SQL Editor
   \i supabase-setup.sql
   ```

2. **Configure Row Level Security (RLS)**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
   ```

3. **Create Policies**
   ```sql
   -- User can only access their own data
   CREATE POLICY "Users can view own data" ON users
     FOR SELECT USING (auth.uid() = id);
   
   CREATE POLICY "Users can update own data" ON users
     FOR UPDATE USING (auth.uid() = id);
   ```

### Database Migrations

```bash
# Run migrations
supabase db push

# Verify migration status
supabase migration list
```

### Backup Strategy

```bash
# Daily backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Automated backup with cron
0 2 * * * /path/to/backup-script.sh
```

## Third-Party Integrations

### Google APIs Setup

1. **Google Cloud Console**
   - Create project
   - Enable Calendar API
   - Create OAuth 2.0 credentials
   - Configure authorized domains

2. **OAuth Consent Screen**
   - Configure app information
   - Add scopes: `https://www.googleapis.com/auth/calendar`
   - Add test users (for development)

### Stripe Integration

1. **Webhook Configuration**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. **Webhook Events**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### Email Service

1. **SMTP Configuration**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

2. **Email Templates**
   - Welcome email
   - Password reset
   - Booking confirmation
   - Payment receipt

## Security Considerations

### Authentication & Authorization

1. **JWT Configuration**
   ```typescript
   const jwtConfig = {
     expiresIn: '24h',
     issuer: 'cortexcloud',
     audience: 'cortexcloud-users'
   };
   ```

2. **Password Policy**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

### API Security

1. **Rate Limiting**
   ```typescript
   const rateLimit = {
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   };
   ```

2. **CORS Configuration**
   ```typescript
   const corsOptions = {
     origin: ['https://your-domain.com'],
     credentials: true,
     optionsSuccessStatus: 200
   };
   ```

### Data Protection

1. **Encryption**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Encrypt database connections

2. **GDPR Compliance**
   - Data minimization
   - Right to be forgotten
   - Data portability
   - Consent management

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   ```typescript
   const LazyComponent = lazy(() => import('./Component'));
   ```

2. **Image Optimization**
   ```typescript
   // Use WebP format
   // Implement lazy loading
   // Use responsive images
   ```

3. **Caching Strategy**
   ```typescript
   // Service Worker for offline support
   // Browser caching headers
   // CDN caching
   ```

### Backend Optimization

1. **Database Optimization**
   ```sql
   -- Add indexes
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_bookings_date ON bookings(booking_date);
   ```

2. **API Optimization**
   ```typescript
   // Implement pagination
   // Use database queries efficiently
   // Cache frequently accessed data
   ```

### CDN Configuration

```nginx
# Nginx configuration
location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /api/ {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Monitoring and Logging

### Application Monitoring

1. **Error Tracking**
   ```typescript
   import * as Sentry from '@sentry/react';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV
   });
   ```

2. **Performance Monitoring**
   ```typescript
   // Web Vitals
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   getCLS(console.log);
   getFID(console.log);
   getFCP(console.log);
   getLCP(console.log);
   getTTFB(console.log);
   ```

### Logging Strategy

1. **Structured Logging**
   ```typescript
   logger.info('User action', {
     userId: user.id,
     action: 'login',
     timestamp: new Date().toISOString()
   });
   ```

2. **Log Levels**
   - DEBUG: Development debugging
   - INFO: General information
   - WARN: Warning conditions
   - ERROR: Error conditions
   - FATAL: Critical errors

### Health Checks

```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime()
  });
});
```

## Deployment Strategies

### Blue-Green Deployment

1. **Setup**
   ```bash
   # Deploy to green environment
   docker-compose -f docker-compose.green.yml up -d
   
   # Test green environment
   curl https://green.your-domain.com/health
   
   # Switch traffic to green
   # Switch back to blue if issues
   ```

2. **Rollback Procedure**
   ```bash
   # Quick rollback
   kubectl rollout undo deployment/app
   
   # Database rollback
   psql $DATABASE_URL < rollback.sql
   ```

### Canary Deployment

```yaml
# Kubernetes canary deployment
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: app
  ports:
  - port: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-canary
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app
      version: canary
  template:
    metadata:
      labels:
        app: app
        version: canary
```

## Maintenance Procedures

### Regular Maintenance

1. **Daily Tasks**
   - Monitor error rates
   - Check system resources
   - Review security logs
   - Verify backups

2. **Weekly Tasks**
   - Update dependencies
   - Review performance metrics
   - Check disk space
   - Test disaster recovery

3. **Monthly Tasks**
   - Security audit
   - Performance optimization
   - Database maintenance
   - Update documentation

### Update Procedures

1. **Application Updates**
   ```bash
   # Pull latest code
   git pull origin main
   
   # Install dependencies
   npm ci
   
   # Run tests
   npm test
   
   # Build application
   npm run build
   
   # Deploy
   npm run deploy
   ```

2. **Database Updates**
   ```bash
   # Create migration
   supabase migration new update_schema
   
   # Apply migration
   supabase db push
   
   # Verify migration
   supabase migration list
   ```

### Backup and Recovery

1. **Database Backup**
   ```bash
   # Full backup
   pg_dump $DATABASE_URL > backup_full.sql
   
   # Incremental backup
   pg_dump --data-only $DATABASE_URL > backup_incremental.sql
   ```

2. **File Backup**
   ```bash
   # Backup uploads
   tar -czf uploads_backup.tar.gz /path/to/uploads
   
   # Backup configuration
   cp .env .env.backup
   ```

3. **Recovery Procedures**
   ```bash
   # Restore database
   psql $DATABASE_URL < backup_full.sql
   
   # Restore files
   tar -xzf uploads_backup.tar.gz
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check connection
   psql $DATABASE_URL -c "SELECT 1"
   
   # Check connection pool
   SELECT * FROM pg_stat_activity;
   ```

2. **Memory Issues**
   ```bash
   # Check memory usage
   free -h
   
   # Check process memory
   ps aux --sort=-%mem | head
   ```

3. **Performance Issues**
   ```bash
   # Check slow queries
   SELECT query, mean_time, calls 
   FROM pg_stat_statements 
   ORDER BY mean_time DESC;
   ```

### Monitoring Alerts

1. **Error Rate Alert**
   ```yaml
   alert: HighErrorRate
   expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
   for: 5m
   labels:
     severity: critical
   annotations:
     summary: High error rate detected
   ```

2. **Response Time Alert**
   ```yaml
   alert: HighResponseTime
   expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
   for: 5m
   labels:
     severity: warning
   annotations:
     summary: High response time detected
   ```

### Emergency Procedures

1. **Service Outage**
   ```bash
   # Check service status
   systemctl status app
   
   # Restart service
   systemctl restart app
   
   # Check logs
   journalctl -u app -f
   ```

2. **Database Issues**
   ```bash
   # Check database status
   systemctl status postgresql
   
   # Check disk space
   df -h
   
   # Check database logs
   tail -f /var/log/postgresql/postgresql.log
   ```

## Support and Maintenance

### Contact Information

- **Technical Support**: support@cortexcloud.com
- **Emergency Contact**: emergency@cortexcloud.com
- **Documentation**: https://docs.cortexcloud.com

### Maintenance Windows

- **Regular Maintenance**: Sundays 2:00 AM - 4:00 AM UTC
- **Emergency Maintenance**: As needed with 1-hour notice
- **Planned Updates**: First Sunday of each month

### SLA Commitments

- **Uptime**: 99.9%
- **Response Time**: < 2 seconds (95th percentile)
- **Support Response**: < 4 hours for critical issues
- **Data Recovery**: < 24 hours for full recovery

---

## Conclusion

This guide provides a comprehensive framework for deploying and maintaining the CortexCloud application in production. Regular updates and reviews of this documentation are essential to ensure continued reliability and performance.

For questions or updates to this guide, please contact the development team.
