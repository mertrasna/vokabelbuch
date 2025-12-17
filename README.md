# Vokabelbuch 📚

Your personal German vocabulary learning companion. Save words you learn, practice with quizzes, and master German one word at a time.

## Features

- 🔐 **User Authentication** - Secure registration and login
- 📝 **Vocabulary Management** - Add, view, and organize German words with translations
- 🎯 **Interactive Quizzes** - Test your knowledge with randomized quizzes
- 📊 **Progress Tracking** - Monitor learning statistics and review history
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, NextAuth.js
- **Database:** PostgreSQL with Prisma ORM
- **UI Components:** shadcn/ui
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vokabelbuch.git
cd vokabelbuch
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   
Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vokabelbuch"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

### Local PostgreSQL

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt install postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE vokabelbuch;
CREATE USER vokabelbuch_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vokabelbuch TO vokabelbuch_user;
```

### Cloud Database (Recommended for Production)

Use one of these services for easy setup:
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - Open source Firebase alternative
- [Railway](https://railway.app) - Simple deployment platform

## Project Structure

```
vokabelbuch/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── register/     # User registration
│   │   ├── words/        # Word CRUD operations
│   │   └── quiz/         # Quiz submission
│   ├── dashboard/        # Main dashboard page
│   ├── login/            # Login page
│   ├── quiz/             # Quiz interface
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Navigation component
│   └── providers.tsx     # Session provider
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── types/
│   └── next-auth.d.ts    # TypeScript definitions
└── mvp_plan.md           # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

Your app will be live at: `https://your-app.vercel.app`

### Connect Custom Domain

1. Add domain in Vercel dashboard
2. Update DNS records as instructed
3. Your app will be live at: `https://vokabelbuch.com`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Generate with `openssl rand -base64 32` |

## Usage

### Adding Words

1. Login to your account
2. Navigate to Dashboard
3. Click "Add New Word"
4. Fill in German word, English translation, and optional notes
5. Select difficulty level
6. Click "Add Word"

### Taking Quizzes

1. Add at least one word to your vocabulary
2. Navigate to "Quiz" from dashboard
3. Type the English translation for each German word
4. Submit your answer
5. Review results and continue

### Tracking Progress

- View word statistics on dashboard
- See times reviewed for each word
- Check quiz results and scores
- Monitor learning progress over time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Future Features

- Spaced repetition algorithm
- Audio pronunciation
- Example sentences
- Word categories and tags
- Mobile app
- Community word lists
- Achievement system

See [mvp_plan.md](mvp_plan.md) for detailed roadmap.

## License

MIT License - feel free to use this project for your own learning!

## Support

For questions or issues, please open an issue on GitHub.

---

**Happy Learning! Viel Erfolg! 🇩🇪**
