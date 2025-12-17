# Quick Setup Guide 🚀

Follow these steps to get Vokabelbuch running on your machine.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

### Option A: Use Cloud Database (Easiest)

We recommend using [Neon](https://neon.tech) for a free PostgreSQL database:

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string
4. Skip to Step 3

### Option B: Use Local PostgreSQL

Install PostgreSQL:

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

Create database:
```bash
sudo -u postgres psql
CREATE DATABASE vokabelbuch;
CREATE USER vokabelbuch_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vokabelbuch TO vokabelbuch_user;
\q
```

## Step 3: Configure Environment Variables

Copy the example file and update it:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# For Neon (cloud):
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# For local PostgreSQL:
DATABASE_URL="postgresql://vokabelbuch_user:your_password@localhost:5432/vokabelbuch"

# Application URL (keep as is for local development)
NEXTAUTH_URL="http://localhost:3000"

# Generate a secret key (run this command):
# openssl rand -base64 32
NEXTAUTH_SECRET="paste-generated-secret-here"
```

## Step 4: Initialize Database

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Generate Prisma Client
- Set up the schema

## Step 5: Verify Setup

Check if database is set up correctly:

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` where you can view your database.

## Step 6: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 7: Test the Application

1. **Register a new account:**
   - Click "Get Started" on homepage
   - Fill in name, email, password
   - Click "Create Account"

2. **Login:**
   - Use your email and password
   - You'll be redirected to the dashboard

3. **Add a word:**
   - Click "Add New Word"
   - Example: German: "Hund", English: "dog"
   - Click "Add Word"

4. **Take a quiz:**
   - Click "Start Quiz" button
   - Type the English translation
   - Submit and see results!

## Troubleshooting

### "Can't reach database server"

**Problem:** Database connection fails

**Solutions:**
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DATABASE_URL in `.env` is correct
- For local DB, ensure user has proper permissions
- For Neon, check if IP is whitelisted (usually automatic)

### "Prisma Client not found"

**Problem:** Prisma client not generated

**Solution:**
```bash
npx prisma generate
```

### "NEXTAUTH_SECRET required"

**Problem:** Missing or invalid NEXTAUTH_SECRET

**Solution:**
```bash
# Generate a secret:
openssl rand -base64 32

# Copy output and paste in .env:
NEXTAUTH_SECRET="your-generated-secret"
```

### Port 3000 already in use

**Problem:** Another app is using port 3000

**Solution:**
```bash
# Kill the process:
lsof -ti:3000 | xargs kill -9

# Or use different port:
PORT=3001 npm run dev
```

### Database migration errors

**Problem:** Migration fails

**Solution:**
```bash
# Reset database (WARNING: deletes all data):
npx prisma migrate reset

# Or create new migration:
npx prisma migrate dev
```

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start production server

# Database
npx prisma studio             # Open database GUI
npx prisma migrate dev        # Create and run migration
npx prisma migrate reset      # Reset database (deletes data!)
npx prisma generate           # Generate Prisma Client
npx prisma db push            # Push schema without migration

# Code Quality
npm run lint                  # Run ESLint
npm run lint:fix              # Fix linting issues automatically
```

## Next Steps

Once everything is running:

1. ✅ Customize the homepage in `app/page.tsx`
2. ✅ Add your branding and colors in `app/globals.css`
3. ✅ Deploy to Vercel (see README.md)
4. ✅ Connect your domain (vokabelbuch.com)
5. ✅ Start adding features from `mvp_plan.md`

## Need Help?

- Check [README.md](README.md) for detailed documentation
- Review [mvp_plan.md](mvp_plan.md) for project architecture
- Open an issue on GitHub
- Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Check Prisma docs: [prisma.io/docs](https://prisma.io/docs)

---

**Happy coding! 🎉**

