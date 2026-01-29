# Shawaya House Branding Update

This document outlines all the changes made to rebrand the restaurant from "The Golden Fork Restaurant" to "Shawaya House" with the new logo.

## Changes Made

### 1. Logo Implementation
- **Logo File**: `/public/images/shawaya-house-logo.jpg`
- **Logo Dimensions**: Responsively scaled (recommended 12-16rem height on desktop, 8-12rem on mobile)
- **Features**: 
  - Optimized for web display with efficient file size
  - Contains English, Arabic, and crown emblem
  - Warm color palette (orange, red, gold)

### 2. Database Update
- **Migration Script**: `scripts/03_update_restaurant_branding.sql`
- **Changes**: Updates the primary restaurant name from "The Golden Fork Restaurant" to "Shawaya House"
- **How to Apply**:
  ```bash
  # For Supabase
  psql $DATABASE_URL -f scripts/03_update_restaurant_branding.sql
  
  # Or run in Supabase SQL Editor
  UPDATE restaurants 
  SET name = 'Shawaya House', updated_at = NOW()
  WHERE id = (SELECT id FROM restaurants LIMIT 1);
  ```

### 3. Frontend Updates

#### Merchant Dashboard (`app/merchant/page.tsx`)
- Added logo display in the header
- Logo appears next to the restaurant name
- Responsive sizing with `h-16` on desktop

#### Customer Menu Page (`app/customer/menu/page.tsx`)
- Added logo to the sticky header
- Logo displays alongside restaurant name and menu title
- Responsive sizing with `h-12` on mobile, scales appropriately
- Removed debug console.log statements

### 4. Logo Styling Guidelines

**Desktop (md and above)**:
```tsx
<img
  src="/images/shawaya-house-logo.jpg"
  alt="Shawaya House Logo"
  className="h-16 w-auto object-contain"
/>
```

**Mobile (sm and below)**:
```tsx
<img
  src="/images/shawaya-house-logo.jpg"
  alt="Shawaya House Logo"
  className="h-12 w-auto object-contain"
/>
```

## Deployment Steps

1. **Update Database**:
   ```bash
   # Apply the branding migration
   psql your_database_url -f scripts/03_update_restaurant_branding.sql
   ```

2. **Verify Image**:
   - Logo is located at `/public/images/shawaya-house-logo.jpg`
   - Ensure the file is served correctly on production

3. **Test Pages**:
   - [ ] Merchant Dashboard - Verify logo displays in header
   - [ ] Customer Menu Page - Verify logo displays in sticky header
   - [ ] Mobile Responsiveness - Test on various screen sizes
   - [ ] Performance - Verify logo loads quickly

4. **Deploy**:
   ```bash
   git add .
   git commit -m "chore: rebrand to Shawaya House with new logo"
   git push origin main
   ```

## Logo Files

The logo is optimized and saved as:
- **Format**: JPEG
- **Location**: `/public/images/shawaya-house-logo.jpg`
- **Usage**: All pages display this centralized logo file

## Testing Checklist

- [ ] Logo displays correctly on merchant dashboard
- [ ] Logo displays correctly on customer menu page
- [ ] Logo displays correctly on payment page
- [ ] Logo is responsive on mobile devices
- [ ] Restaurant name shows as "Shawaya House" across all pages
- [ ] Database reflects the new restaurant name
- [ ] No console errors related to image loading

## Rollback Instructions

If you need to revert to the previous branding:

```sql
-- Revert restaurant name
UPDATE restaurants 
SET name = 'The Golden Fork Restaurant', 
    updated_at = NOW()
WHERE id = (SELECT id FROM restaurants LIMIT 1);
```

Then remove the logo from component headers and replace with the previous Store icon.
