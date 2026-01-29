# Restaurant CRM System - Complete Development Guide

## Project Overview
A full-stack restaurant management system built with Next.js, Supabase/PostgreSQL, and React. Features include table management, menu management, order processing, split payment handling, and QR code generation for customers.

## Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (via Supabase or local PostgreSQL)
- **Authentication**: Supabase Auth or custom JWT
- **Payment Gateway**: Geidea (with test credentials)
- **QR Code**: qrcode.react library
- **UI Components**: shadcn/ui

---

## Phase 1: Project Setup & Environment Configuration

### 1.1 Initialize Project
```bash
# Create Next.js project with TypeScript
npx create-next-app@latest restaurant-crm --typescript --tailwind --app

cd restaurant-crm

# Install dependencies
npm install

# Required packages
npm install @supabase/supabase-js @supabase/ssr
npm install qrcode.react
npm install recharts
npm install sonner
npm install zustand
npm install bcrypt
npm install js-cookie
```

### 1.2 Environment Variables Setup
Create \`.env.local\`:
```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Gateway (Geidea - Test)
GEIDEA_PUBLIC_KEY=a087f4ca
GEIDEA_API_PASSWORD=00435b2d
GEIDEA_API_ENDPOINT=https://api.ksamerchant.abc.net/

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### 1.3 Project Structure
```
restaurant-crm/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx           # Login page
│   ├── merchant/
│   │   ├── page.tsx               # Merchant dashboard
│   │   ├── menu/
│   │   │   ├── page.tsx           # Menu management
│   │   │   └── [menuId]/
│   │   │       └── page.tsx
│   │   ├── tables/
│   │   │   └── [tableId]/
│   │   │       ├── page.tsx
│   │   │       └── qr/
│   │   │           └── page.tsx
│   │   └── orders/
│   │       └── page.tsx           # Order management
│   ├── customer/
│   │   ├── menu/
│   │   │   └── page.tsx           # Customer menu view
│   │   ├── pay/
│   │   │   └── [qrCode]/
│   │   │       └── page.tsx       # Payment page
│   │   └── scan/
│   │       └── page.tsx           # QR scanner
│   └── api/
│       ├── auth/
│       │   ├── login.ts
│       │   └── logout.ts
│       ├── menu/
│       │   ├── [qrCode]/route.ts
│       │   └── route.ts
│       ├── merchant/
│       │   ├── restaurant/route.ts
│       │   ├── tables/route.ts
│       │   └── orders/route.ts
│       └── payments/
│           ├── create-link/route.ts
│           ├── complete/route.ts
│           ├── check/route.ts
│           └── webhook/route.ts
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── simple-payment.tsx
│   ├── split-payment-selector.tsx
│   ├── payment-transaction-table.tsx
│   ├── qr-code-display.tsx
│   └── menu-items.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   ├── proxy.ts               # Middleware
│   │   └── queries.ts             # Database queries
│   ├── auth.ts                    # Auth utilities
│   ├── utils.ts
│   └── geidea/
│       ├── gateway.ts             # Payment gateway integration
│       └── types.ts
├── middleware.ts                  # Next.js middleware (renamed from proxy.ts in v16)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Phase 2: Database Setup with PostgreSQL

### 2.1 Local PostgreSQL Setup (Windows/Mac/Linux)

**Using Docker** (Recommended):
```bash
# Start PostgreSQL container
docker run --name restaurant-db \\
  -e POSTGRES_USER=admin \\
  -e POSTGRES_PASSWORD=password123 \\
  -e POSTGRES_DB=restaurant_crm \\
  -p 5432:5432 \\
  -d postgres:15

# Verify connection
psql -h localhost -U admin -d restaurant_crm
```

### 2.2 Database Schema

Create file \`scripts/init-database.sql\`:

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'merchant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants Table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  currency VARCHAR(10) DEFAULT 'SAR',
  tax_rate DECIMAL(5,2) DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables Table
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number INT NOT NULL,
  capacity INT DEFAULT 4,
  qr_code VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Categories Table
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  num_people INT DEFAULT 1,
  tip_percent INT DEFAULT 0,
  gateway_transaction_id VARCHAR(255),
  gateway_response JSONB,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Splits Table
CREATE TABLE payment_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  split_number INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  gateway_transaction_id VARCHAR(255),
  approval_code VARCHAR(50),
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_restaurants_user ON restaurants(user_id);
CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payment_splits_payment ON payment_splits(payment_id);
```

Run the schema:
```bash
psql -h localhost -U admin -d restaurant_crm -f scripts/init-database.sql
```

---

## Phase 3: Backend Development

### 3.1 Database Queries Library

Create \`lib/supabase/queries.ts\`:

```typescript
import { createClient } from './server';

// Get restaurant with all related data
export async function getRestaurantWithData(restaurantId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('restaurants')
    .select(\`
      *,
      tables:tables(*),
      menu_categories:menu_categories(
        *,
        menu_items(*)
      ),
      orders(*)
    \`)
    .eq('id', restaurantId)
    .single();

  if (error) throw error;
  return data;
}

// Get active order for table
export async function getTableOrder(tableId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(\`
      *,
      items:order_items(
        *,
        menu_item:menu_items(*)
      )
    \`)
    .eq('table_id', tableId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

// Create new order
export async function createOrder(restaurantId: string, tableId: string) {
  const supabase = await createClient();
  
  const orderNumber = \`ORD-\${Date.now()}\`;
  
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      restaurant_id: restaurantId,
      table_id: tableId,
      order_number: orderNumber
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 3.2 API Routes

Create \`app/api/merchant/restaurant/route.ts\`:

```typescript
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

Create \`app/api/payments/create-link/route.ts\`:

```typescript
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  const { orderId, amount, numPeople, tipPercent } = await request.json();

  try {
    // Generate unique transaction ID
    const transactionId = \`TXN-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;

    // Check for existing pending payment
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    let paymentId;
    
    if (existingPayment && existingPayment.length > 0) {
      paymentId = existingPayment[0].id;
    } else {
      // Create new payment
      const { data: newPayment, error } = await supabase
        .from('payments')
        .insert([{
          order_id: orderId,
          amount,
          num_people: numPeople,
          tip_percent: tipPercent,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      paymentId = newPayment.id;
    }

    // Generate payment link (redirect to Geidea or your gateway)
    const paymentLink = \`/customer/pay/\${orderId}?paymentId=\${paymentId}\`;

    return Response.json({ paymentLink, paymentId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Phase 4: Frontend Development

### 4.1 Core Pages

Create \`app/merchant/page.tsx\`:

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { RestaurantDashboard } from '@/components/merchant/dashboard';

export default async function MerchantPage() {
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select(\`
      *,
      tables:tables(*),
      orders:orders(*)
    \`)
    .limit(1)
    .single();

  return <RestaurantDashboard restaurant={restaurant} />;
}
```

### 4.2 UI Components

Create \`components/ui/button.tsx\` (use shadcn/ui):

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add input
npx shadcn@latest add select
```

---

## Phase 5: Payment Gateway Integration

### 5.1 Geidea Integration

Create \`lib/geidea/gateway.ts\`:

```typescript
interface PaymentRequest {
  amount: number;
  currency: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface PaymentResponse {
  transactionId: string;
  status: string;
  approvalCode: string;
  message: string;
}

export async function processPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  const publicKey = process.env.GEIDEA_PUBLIC_KEY;
  const apiPassword = process.env.GEIDEA_API_PASSWORD;
  const apiEndpoint = process.env.GEIDEA_API_ENDPOINT;

  // Prepare payment payload
  const payload = {
    publicKey,
    amount: Math.round(request.amount * 100), // Convert to cents
    currency: request.currency,
    cardNumber: request.cardNumber.replace(/\\s/g, ''),
    expiryDate: request.expiryDate,
    cvv: request.cvv,
    cardholderName: request.cardholderName,
    merchantReferenceId: \`TXN-\${Date.now()}\`
  };

  try {
    const response = await fetch(\`\${apiEndpoint}/v1/payments\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiPassword}\`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return {
      transactionId: data.transactionId || '',
      status: response.ok ? 'success' : 'failed',
      approvalCode: data.approvalCode || '',
      message: data.message || 'Payment processed'
    };
  } catch (error) {
    throw new Error(\`Payment gateway error: \${error.message}\`);
  }
}

// Test card numbers for development
export const TEST_CARDS = {
  APPROVED: {
    number: '4111111111111111',
    expiry: '12/25',
    cvv: '123'
  },
  DECLINED: {
    number: '5555555555554444',
    expiry: '12/25',
    cvv: '123'
  },
  ERROR: {
    number: '378282246310005',
    expiry: '12/25',
    cvv: '123'
  }
};
```

---

## Phase 6: Security Best Practices

### 6.1 Environment Variables
- Never commit \`.env.local\` to version control
- Use \`.env.example\` for documentation
- Rotate sensitive keys regularly

### 6.2 Data Encryption

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);

export function encryptData(data: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(data, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptData(encryptedData: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(parts[1], 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}
```

### 6.3 Input Validation

```typescript
export function validateEmail(email: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

export function validateCardNumber(cardNumber: string): boolean {
  return /^\\d{13,19}$/.test(cardNumber.replace(/\\s/g, ''));
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>\"']/g, '');
}
```

---

## Phase 7: Local Development & Testing

### 7.1 Start Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

### 7.2 Test Payment Gateway
```bash
# Use test card: 4111111111111111
# Expiry: 12/25, CVV: 123
# Should result in approved transaction
```

### 7.3 Database Testing

```bash
# Connect to local PostgreSQL
psql -h localhost -U admin -d restaurant_crm

# Test queries
SELECT * FROM restaurants;
SELECT * FROM tables WHERE status = 'occupied';
SELECT * FROM payments WHERE status = 'completed';
```

---

## Phase 8: Deployment (Local to Cloud)

### 8.1 Environment Setup for Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all env vars
```

### 8.2 Deploy
```bash
vercel deploy --prod
```

---

## Best Practices Summary

✅ **Project Organization**
- Separate concerns (components, lib, api)
- Use TypeScript for type safety
- Organize files by feature

✅ **Security**
- Never expose API keys in frontend code
- Use environment variables for secrets
- Encrypt sensitive data
- Validate all inputs
- Use HTTPS in production
- Implement rate limiting on APIs

✅ **Performance**
- Use server components by default
- Implement proper caching strategies
- Optimize database queries with indexes
- Lazy load components

✅ **Database**
- Use transactions for critical operations
- Create indexes on frequently queried columns
- Regular backups
- Use connection pooling

✅ **Error Handling**
- Comprehensive try-catch blocks
- User-friendly error messages
- Logging for debugging
- Graceful degradation

---

## Troubleshooting

**PostgreSQL Connection Issues**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # Mac
docker ps | grep postgres  # Docker
```

**Supabase Auth Issues**
- Verify JWT_SECRET is set
- Check user exists in users table
- Verify email/password hash matches

**Payment Gateway Failures**
- Check API credentials are correct
- Verify endpoint is accessible
- Use test cards for development
- Check request payload format

---

## Next Steps
1. Clone repository and set up locally
2. Configure PostgreSQL database
3. Set environment variables
4. Run \`npm install\`
5. Run \`npm run dev\`
6. Test with sample data
7. Deploy to Vercel when ready
