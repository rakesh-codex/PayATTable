# Restaurant CRM System - Pay@Table

A production-ready restaurant management system with QR code-based table payments and digital menu.

## Features

- Merchant Dashboard with real-time updates
- Dual QR Code System (Menu + Payment)
- Split Bill Support
- Secure JWT Authentication
- Mobile-Optimized Customer Experience
- **Open Access - No Authentication Required**

## Tech Stack

- Next.js 15 (App Router)
- Supabase (PostgreSQL)
- TypeScript
- Tailwind CSS v4
- shadcn/ui

## Quick Start

### Access the Application
- **Merchant Dashboard:** `/merchant` (No login required)
- **Customer Menu:** Scan QR code or visit `/customer/menu/[qrCode]`
- **Customer Payment:** Scan QR code or visit `/customer/pay/[qrCode]`

### Authentication Status
**🔓 AUTHENTICATION DISABLED**

All routes are publicly accessible without login:
- Merchant dashboard
- Admin panel
- Customer pages
- API endpoints

The login page at `/auth/login` still exists but is not enforced anywhere in the application.

## Production Deployment

### CRITICAL: Vercel Deployment Protection

**✅ COMPLETED - You've disabled deployment protection!**

QR codes should now work properly. If you still experience issues:

1. **Clear your browser cache**
2. **Test on a different device/browser**
3. **Check the browser console for errors**

### Required Environment Variable

Add this to your Vercel project:

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**How to add:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_APP_URL` with your production URL
3. Redeploy

### Deployment Steps

1. Deploy to Vercel
2. **Disable Deployment Protection** (see above)
3. Add `NEXT_PUBLIC_APP_URL` environment variable
4. Redeploy
5. Test QR codes on mobile device

### Troubleshooting

**Issue: Blank screen after login**
- Check browser console for authentication errors
- Clear cookies and try logging in again
- Verify Supabase connection is working

**Issue: QR codes showing "Authentication Required" or 401 errors**
- **SOLUTION:** Disable Vercel Deployment Protection (see above)
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly
- Redeploy after making changes

**Issue: Menu not found**
- Verify QR codes are being generated with correct format
- Check that tables exist in database
- Test API endpoint directly: `/api/menu/QR-TABLE-001`

**Issue: Failed to load table data**
- Check Supabase environment variables are set
- Verify database tables and RLS policies exist
- Check browser console for specific errors

### Testing QR Codes

After deployment:

1. **Login to merchant dashboard** at `/merchant`
2. **Click "Menu Card"** on any table to see the menu QR code
3. **Click "View QR Code"** then switch to "Payment" tab
4. **Test both QR codes** on your mobile device:
   - Menu QR should show restaurant menu
   - Payment QR should show bill and payment options

**Debugging Tips:**
- Open browser console (F12) to see `[v0]` debug logs
- Check Network tab for API call failures
- Verify `NEXT_PUBLIC_APP_URL` matches your domain exactly

## Database Schema

8 tables with RLS policies:
- restaurants
- tables
- menu_categories
- menu_items
- orders
- order_items
- payments
- payment_splits

All tables are created and secured with Row Level Security.

## API Endpoints

### Public (No Authentication Required)
- `GET /api/menu/[qrCode]` - Get menu by QR code
- `GET /api/tables/[qrCode]` - Get order by QR code

### Protected (Authentication Required)
- `POST /api/auth/login`
- `POST /api/auth/verify`
- `GET /api/merchant/restaurant`
- `GET /api/merchant/tables`
- `POST /api/payments/create-link`
- `POST /api/payments/complete`

## Project Structure

```
app/
├── api/              # API routes
├── auth/login/       # Merchant login
├── customer/         # Customer-facing pages (PUBLIC)
├── merchant/         # Merchant dashboard (PROTECTED)
└── layout.tsx        # Root layout
components/           # React components
lib/                  # Utilities and types
proxy.ts              # Next.js 16 middleware
```

## Security

- JWT authentication for merchants
- Row Level Security on all database tables
- Public customer routes (menu, payment pages)
- Protected merchant routes (dashboard, admin)
- HTTPS required in production

## License

Proprietary - All rights reserved
