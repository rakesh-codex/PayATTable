# Comprehensive Full-Stack Web Application Development Prompt

## Executive Summary
This prompt provides complete step-by-step instructions for developing a production-ready restaurant CRM system with payment processing, menu management, and split payment functionality. It covers frontend (Next.js), backend (API routes), database (PostgreSQL), and security considerations for local development and deployment.

---

## Phase 1: Project Setup & Environment Configuration

### 1.1 Technology Stack Selection
- **Frontend**: Next.js 16 with React 19.2, TypeScript, Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API routes (Node.js runtime)
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth (optional - can be disabled)
- **Payment Gateway**: Geidea or Moyasar
- **Deployment**: Vercel for production, local development with `npm run dev`

### 1.2 Initial Project Setup
```bash
# Create Next.js project with App Router
npx create-next-app@latest restaurant-crm --typescript --tailwind --app

# Install essential dependencies
npm install @supabase/ssr @supabase/supabase-js
npm install recharts
npm install qrcode.react
npm install axios
npm install lodash-es

# Create environment file
cp .env.example .env.local
```

### 1.3 Environment Variables Configuration
```
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Gateway (Geidea Example)
GEIDEA_PUBLIC_KEY=your_public_key
GEIDEA_API_PASSWORD=your_api_password
GEIDEA_API_ENDPOINT=https://api.ksamerchant.abc.net/
```

---

## Phase 2: Database Schema Design with PostgreSQL

### 2.1 Database Structure Overview
The database consists of 7 core tables with proper relationships and constraints:

### 2.2 Complete SQL Schema
```sql
-- Restaurants table (core entity)
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  tax_percentage DECIMAL(5,2) DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables (physical restaurant tables)
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number INT NOT NULL,
  capacity INT DEFAULT 4,
  status VARCHAR(20) DEFAULT 'available', -- available, occupied, reserved
  qr_code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Categories
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders (customer orders at tables)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, cancelled
  total_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items (individual items in an order)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments (split payments tracking)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  gateway_transaction_id VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
  payment_method VARCHAR(50) DEFAULT 'card',
  num_people INT DEFAULT 1,
  tip_percent DECIMAL(5,2) DEFAULT 0,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Splits (track individual split payments)
CREATE TABLE payment_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  split_number INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
  trx_id VARCHAR(100),
  approval_code VARCHAR(50),
  balance_after DECIMAL(10,2),
  result VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_tables_restaurant_id ON tables(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payment_splits_payment_id ON payment_splits(payment_id);
```

### 2.3 Initial Data Seeding
Create seed data with sample restaurant, tables, and menu items for testing.

---

## Phase 3: Backend API Development

### 3.1 API Architecture Overview
- Use Next.js App Router API routes
- Implement RESTful endpoints for all entities
- Use Supabase server client for database queries
- Implement proper error handling and validation
- Support server-side rendering where appropriate

### 3.2 Core API Endpoints

#### 3.2.1 Restaurant Endpoints
```
GET    /api/merchant/restaurant     - Get restaurant details
PUT    /api/merchant/restaurant     - Update restaurant settings
```

#### 3.2.2 Table Management
```
GET    /api/merchant/tables         - List all tables with status
PUT    /api/merchant/tables/:id     - Update table status
POST   /api/merchant/tables         - Create new table
```

#### 3.2.3 Menu Management
```
GET    /api/menu/:qrCode            - Get menu by QR code
GET    /api/merchant/menu           - Get full menu for management
POST   /api/merchant/menu/items     - Add menu item
PUT    /api/merchant/menu/items/:id - Update menu item
```

#### 3.2.4 Order Management
```
GET    /api/merchant/orders         - List orders
POST   /api/merchant/orders         - Create order
PUT    /api/merchant/orders/:id     - Update order status
```

#### 3.2.5 Payment Processing
```
POST   /api/payments/create-link    - Initiate payment session
GET    /api/payments/check          - Check payment status
POST   /api/payments/complete       - Complete payment
POST   /api/payments/webhook        - Handle payment gateway webhook
```

### 3.3 Database Query Utilities
Create `lib/supabase/queries.ts` with reusable query functions:
- `getRestaurant(restaurantId)`
- `getTables(restaurantId)`
- `getMenu(restaurantId)`
- `getOrder(orderId)`
- `createPayment(orderData)`
- `getPaymentSplits(paymentId)`

### 3.4 Security Best Practices for APIs
- Validate all inputs using TypeScript types
- Sanitize user inputs to prevent SQL injection
- Use environment variables for sensitive data
- Implement rate limiting for payment endpoints
- Use HTTPS only in production
- Validate payment amounts server-side
- Never expose sensitive payment details in responses
- Implement proper error messages (avoid leaking system details)

---

## Phase 4: Frontend Development

### 4.1 Project Structure
```
app/
  ├── layout.tsx                          # Root layout
  ├── page.tsx                            # Home page
  ├── merchant/
  │   ├── page.tsx                        # Merchant dashboard
  │   ├── layout.tsx                      # Merchant layout
  │   ├── menu/
  │   │   └── page.tsx                    # Menu management
  │   └── tables/
  │       └── [tableId]/
  │           ├── qr/
  │           │   └── page.tsx            # QR code display
  │           └── orders/
  │               └── page.tsx            # Table orders
  └── customer/
      ├── menu/
      │   └── page.tsx                    # Customer menu view
      └── pay/
          └── [qrCode]/
              └── page.tsx                # Payment page

components/
  ├── ui/                                 # shadcn components
  ├── merchant/
  │   ├── dashboard.tsx                   # Dashboard overview
  │   ├── table-card.tsx                  # Table status card
  │   └── restaurant-info.tsx             # Restaurant details
  ├── customer/
  │   ├── menu-display.tsx                # Menu rendering
  │   └── order-summary.tsx               # Order total display
  ├── payment/
  │   ├── simple-payment.tsx              # Payment form
  │   ├── split-payment-selector.tsx      # Split options
  │   └── payment-transaction-table.tsx   # Transaction history
  └── common/
      ├── qr-code-display.tsx             # QR code with download
      └── navigation.tsx                  # Nav menu

lib/
  ├── supabase/
  │   ├── server.ts                       # Supabase server client
  │   ├── client.ts                       # Supabase client (if needed)
  │   └── queries.ts                      # Reusable database queries
  ├── utils/
  │   ├── payment-utils.ts                # Payment calculations
  │   └── format-utils.ts                 # Formatting helpers
  └── types/
      └── index.ts                        # TypeScript interfaces
```

### 4.2 Key Components

#### Dashboard Component (Merchant)
- Display restaurant information
- Show all tables with status indicators
- Links to menu management
- Links to QR code pages
- Order summary

#### Menu Component (Customer)
- Display menu categories
- Show menu items with prices
- Allow item selection
- Display order total with tax
- Payment button

#### Payment Component
- Split payment selector (1, 2, 3+ people)
- Tip percentage selection
- Real-time amount calculation
- Payment form integration
- Transaction history display
- Success/failure feedback

#### QR Code Component
- Generate QR codes for each table
- Display menu and payment URLs
- Download/share functionality
- Scan instructions

### 4.3 Styling Guidelines
- Use Tailwind CSS utility classes
- Maintain 3-5 color palette
- Use semantic color system (primary, secondary, success, danger)
- Responsive design: mobile-first approach
- Consistent spacing using Tailwind's scale
- Accessible typography and contrast ratios

### 4.4 State Management
- Use React hooks (useState, useEffect)
- Use SWR for data fetching
- Context API for global state (if needed)
- Server components for data fetching
- Client components for interactivity

---

## Phase 5: Payment Gateway Integration

### 5.1 Geidea Integration (Example)
```typescript
// lib/geidea/client.ts
interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  cardData?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

export async function initiatePayment(request: PaymentRequest) {
  // Validate request
  // Call Geidea API
  // Return transaction details
}

export async function verifyTransaction(transactionId: string) {
  // Query Geidea API for transaction status
  // Return verification result
}
```

### 5.2 Test Credentials Management
- Store credentials only in environment variables
- Never commit credentials to version control
- Rotate credentials regularly
- Use separate test and production credentials
- Implement credential validation on startup

### 5.3 Test Payment Cards
```
Visa Test:        4111 1111 1111 1111
Mastercard Test:  5555 5555 5555 4444
Amex Test:        3782 822463 10005

Expiry: Any future date (MM/YY)
CVV: Any 3-digit number
```

### 5.4 Payment Flow
1. Customer initiates payment
2. Frontend sends payment request to backend
3. Backend creates payment record in database
4. Backend calls payment gateway API
5. Payment gateway processes transaction
6. Gateway returns transaction ID and status
7. Backend stores transaction details
8. Frontend displays result to customer
9. On success: Update order status, clear order
10. On webhook: Verify and update payment status

---

## Phase 6: Security Implementation

### 6.1 Environment Configuration
- Use `.env.local` for development
- Never commit `.env.local` to git
- Use `.env.example` for template
- Validate environment variables on startup

### 6.2 Data Encryption
- Use HTTPS only in production
- Encrypt sensitive payment data
- Hash payment tokens
- Never store full card numbers (use tokenization)
- Use secure random generation for session IDs

### 6.3 Authentication & Authorization
- Implement role-based access control (merchant vs customer)
- Validate user identity for sensitive operations
- Use secure session management
- Implement CSRF protection
- Validate all API requests server-side

### 6.4 Payment Security
- Validate payment amounts server-side
- Implement idempotency for payment requests
- Use payment gateway's tokenization
- Never pass sensitive payment data through logs
- Implement proper error handling (avoid leaking details)

### 6.5 Database Security
- Use parameterized queries (prevent SQL injection)
- Implement Row Level Security (RLS) in Supabase
- Regular backups
- Monitor access logs
- Use strong passwords

---

## Phase 7: Local Development Setup

### 7.1 Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ running locally or via Docker
- Git for version control
- Code editor (VS Code recommended)

### 7.2 Local Database Setup
```bash
# Using Docker
docker run --name restaurant-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=restaurant \
  -p 5432:5432 \
  -d postgres:15

# Create tables using the schema from Phase 2
psql -U postgres -d restaurant -f schema.sql

# Seed initial data
psql -U postgres -d restaurant -f seed-data.sql
```

### 7.3 Development Environment
```bash
# Clone or create project
git clone <repository>
cd restaurant-crm

# Install dependencies
npm install

# Create .env.local with test credentials
cp .env.example .env.local
# Edit .env.local with your Supabase/payment credentials

# Run development server
npm run dev

# Application available at http://localhost:3000
```

### 7.4 Development Workflow
- Use `npm run dev` for development
- Use `npm run build` to test production build
- Use `npm run lint` for code quality
- Use browser DevTools for debugging
- Use server logs (`console.log`) for API debugging
- Test payment flow with test cards
- Verify database operations in Supabase

---

## Phase 8: Testing & Validation

### 8.1 Frontend Testing
- Test all UI components
- Test responsive design (mobile, tablet, desktop)
- Test payment flow with test cards
- Test split payment logic
- Test QR code generation and scanning
- Test error handling and edge cases

### 8.2 Backend Testing
- Test all API endpoints with Postman/Insomnia
- Test database transactions
- Test payment gateway integration
- Test error responses
- Test validation logic
- Test concurrent requests

### 8.3 Database Testing
- Verify table relationships
- Test data integrity constraints
- Test cascading deletes
- Verify indexes performance
- Test query optimization

### 8.4 Security Testing
- Test for SQL injection vulnerabilities
- Verify sensitive data is encrypted
- Test authentication/authorization
- Verify environment variables are not exposed
- Test CORS policies
- Verify payment data handling

---

## Phase 9: Deployment

### 9.1 Production Checklist
- [ ] All environment variables configured
- [ ] Database backups automated
- [ ] Error logging configured
- [ ] Payment credentials secured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Monitoring/alerts configured

### 9.2 Vercel Deployment
```bash
# Connect to Vercel
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... other variables

# Deploy
vercel deploy --prod
```

### 9.3 Production Best Practices
- Monitor error logs regularly
- Review transaction logs
- Backup database daily
- Keep dependencies updated
- Implement analytics
- Set up performance monitoring

---

## Key Architectural Decisions

1. **Server Components**: Use Next.js server components for data fetching to reduce client-side complexity
2. **API Routes**: Implement API routes in `/api` directory for backend logic
3. **Database Client**: Use singleton pattern for Supabase client to prevent connection leaks
4. **State Management**: Keep state minimal, prefer server-side state when possible
5. **Payment Flow**: Implement idempotent payment operations to handle retries safely
6. **Split Payments**: Track each split in database with transaction IDs for reconciliation

---

## Best Practices Summary

✅ **DO:**
- Store sensitive data in environment variables
- Validate all inputs server-side
- Use TypeScript for type safety
- Implement proper error handling
- Test payment flow thoroughly
- Monitor database performance
- Keep dependencies updated
- Document API endpoints
- Use version control

❌ **DON'T:**
- Commit credentials to git
- Store sensitive data in client-side code
- Trust client-side validation only
- Ignore payment error responses
- Use hardcoded URLs
- Skip database backups
- Deploy without testing
- Mix business logic in components
- Expose detailed error messages

---

## Additional Resources

- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- Payment Gateway API Docs: [Provide specific links]

---

## Support & Troubleshooting

For common issues:
1. Clear `.next` folder and rebuild
2. Check environment variables are set
3. Verify database connections
4. Check browser console for errors
5. Check server logs for API errors
6. Test with sample data
7. Verify payment credentials
