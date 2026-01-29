# Local Development Setup Guide - Restaurant CRM System

## Prerequisites

Before starting, ensure you have installed:
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))

---

## Step 1: Install PostgreSQL Locally

### macOS
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15
```

### Windows
- Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run the installer and follow the setup wizard
- Remember the password you set for the `postgres` user

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Step 2: Create Local Database

### Open PostgreSQL CLI
```bash
# macOS/Linux
psql -U postgres

# Windows (use psql from PostgreSQL installation)
psql -U postgres
```

### Create Database and User
```sql
-- Create database
CREATE DATABASE restaurant_crm;

-- Create user (optional, but recommended)
CREATE USER restaurant_dev WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE restaurant_crm TO restaurant_dev;

-- Exit psql
\q
```

---

## Step 3: Run Database Schema Script

### Option A: Using psql directly
```bash
# From your project root directory
psql -U postgres -d restaurant_crm -f scripts/01_init_database.sql
```

### Option B: Using pgAdmin (GUI)
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Create new database: `restaurant_crm`
4. Right-click the database → Query Tool
5. Copy and paste the entire contents of `scripts/01_init_database.sql`
6. Click Execute

### Option C: Using DBeaver (GUI)
1. Open DBeaver
2. Create new connection to PostgreSQL (localhost, port 5432)
3. Create new database: `restaurant_crm`
4. Open SQL editor
5. Copy and paste `scripts/01_init_database.sql`
6. Execute

---

## Step 4: Verify Database Setup

```bash
psql -U postgres -d restaurant_crm
```

```sql
-- List all tables
\dt

-- Should show:
-- menu_categories
-- menu_items
-- order_items
-- orders
-- payment_splits
-- payments
-- restaurants
-- tables

-- Verify sample data
SELECT * FROM restaurants;
SELECT * FROM tables;
SELECT COUNT(*) FROM menu_items;

-- Exit
\q
```

---

## Step 5: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# PostgreSQL Connection (for local development)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/restaurant_crm
POSTGRES_URL=postgresql://postgres:your_password@localhost:5432/restaurant_crm
POSTGRES_PRISMA_URL=postgresql://postgres:your_password@localhost:5432/restaurant_crm
POSTGRES_URL_NON_POOLING=postgresql://postgres:your_password@localhost:5432/restaurant_crm
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=restaurant_crm

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# (Supabase variables if migrating from cloud later)
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

---

## Step 6: Install Dependencies

```bash
# Navigate to project directory
cd your-project-folder

# Install dependencies
npm install
```

---

## Step 7: Setup Prisma (Optional - if using Prisma ORM)

If your project uses Prisma, create `prisma/schema.prisma` with connection to your local database:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Your schema here
```

Then run:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## Step 8: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Step 9: Access Database Tools

### Using psql CLI
```bash
psql -U postgres -d restaurant_crm
```

### Using pgAdmin
```bash
# macOS
open http://localhost:5050

# Linux/Windows
http://localhost:5050
```

### Using DBeaver
1. Create new connection
2. Host: `localhost`
3. Port: `5432`
4. Database: `restaurant_crm`
5. Username: `postgres`
6. Password: Your password

---

## Database Schema Overview

### Core Tables

1. **restaurants** - Restaurant information
2. **tables** - Restaurant tables with QR codes
3. **menu_categories** - Menu categories (Appetizers, Main Courses, etc.)
4. **menu_items** - Menu items with prices
5. **orders** - Customer orders
6. **order_items** - Items within an order
7. **payments** - Payment records
8. **payment_splits** - Split payment tracking

### Key Features

- **Row Level Security (RLS)** enabled on all tables
- **Automatic timestamps** (created_at, updated_at)
- **Foreign key constraints** for data integrity
- **Indexes** for query performance
- **Check constraints** for valid status values
- **Sample data** pre-loaded (The Golden Fork Restaurant)

---

## Troubleshooting

### Connection Refused Error
```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Start if not running
sudo systemctl start postgresql
```

### Permission Denied
```bash
# Check PostgreSQL service permissions
# macOS
brew services restart postgresql@15

# Linux
sudo systemctl restart postgresql
```

### Database Already Exists
```bash
# Drop and recreate
psql -U postgres
DROP DATABASE IF EXISTS restaurant_crm;
CREATE DATABASE restaurant_crm;
\q

# Re-run the schema script
psql -U postgres -d restaurant_crm -f scripts/01_init_database.sql
```

### Port Already in Use
```bash
# If port 5432 is in use, configure a different port in your connection string:
DATABASE_URL=postgresql://postgres:password@localhost:5433/restaurant_crm
```

---

## Sample API Endpoints (After Setup)

Once running locally, you can test:

```bash
# Get all restaurants
curl http://localhost:3000/api/restaurants

# Get all tables
curl http://localhost:3000/api/tables

# Get menu
curl http://localhost:3000/api/menu

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"tableId": "...", "items": [...]}'
```

---

## Next Steps

1. ✅ Database schema created
2. ✅ Sample data loaded
3. ✅ Environment variables configured
4. 🔄 **Now:** Set up frontend connection to database
5. 🔄 Implement API routes
6. 🔄 Build UI components
7. 🔄 Test payment integration
8. 🔄 Deploy to production

---

## Useful Commands

```bash
# Backup database
pg_dump -U postgres -d restaurant_crm > backup.sql

# Restore database
psql -U postgres -d restaurant_crm < backup.sql

# Reset database (WARNING: deletes all data)
dropdb -U postgres restaurant_crm
createdb -U postgres restaurant_crm
psql -U postgres -d restaurant_crm -f scripts/01_init_database.sql

# Check database size
psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('restaurant_crm'));"
```

---

## Support & Documentation

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Migration Guide](https://supabase.com/docs)
- [Next.js with PostgreSQL](https://nextjs.org/docs/getting-started)

For issues, check the application logs and PostgreSQL logs in `/var/log/postgresql/` (Linux) or PostgreSQL logs directory (Windows/macOS).
