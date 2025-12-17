# Vokabelbuch - MVP Plan

## Project Overview

**Vokabelbuch** (German for "vocabulary book") is a web application designed to help users learn German vocabulary effectively. Users can save German words they're learning, organize them with translations and notes, and test their knowledge through interactive quizzes.

**Domain:** vokabelbuch.com

---

## Core Features (MVP)

### 1. User Authentication
- User registration with email and password
- Secure login/logout functionality
- Session management with NextAuth.js
- Password hashing with bcrypt

### 2. Vocabulary Management
- **Add Words:** Users can add German words with:
  - German word (required)
  - English translation (required)
  - Personal notes (optional)
  - Difficulty level (Easy/Medium/Hard)
- **View Words:** Display all saved words in a card-based layout
- **Delete Words:** Remove words from collection
- **Statistics:** Track times reviewed and last review date

### 3. Interactive Quiz System
- Quiz generated from user's personal vocabulary
- Randomized word order for each quiz session
- Type-based answers (manual input)
- Immediate feedback (correct/incorrect)
- Show correct answer when wrong
- Track quiz results and progress
- Final score display with percentage
- Quiz results stored in database

### 4. Dashboard
- Overview of vocabulary collection
- Word count display
- Quick access to add new words
- Navigation to quiz section

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React hooks + NextAuth session

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Authentication:** NextAuth.js
- **Validation:** Zod

### Database
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Schema:** User, Word, QuizResult, Account, Session models

### Deployment
- **Platform:** Vercel (recommended)
- **Database Hosting:** Neon, Supabase, or Railway (free tier available)
- **Domain:** vokabelbuch.com (already owned)

---

## Database Schema

### User
- id (String, primary key)
- name (String, optional)
- email (String, unique)
- password (String, hashed)
- createdAt (DateTime)
- updatedAt (DateTime)

### Word
- id (String, primary key)
- userId (String, foreign key)
- german (String) - The German word
- english (String) - English translation
- notes (String, optional) - User notes
- difficulty (Enum: EASY/MEDIUM/HARD)
- timesReviewed (Int) - Number of times reviewed in quiz
- lastReviewed (DateTime, optional)
- createdAt (DateTime)
- updatedAt (DateTime)

### QuizResult
- id (String, primary key)
- userId (String, foreign key)
- wordId (String, foreign key)
- correct (Boolean)
- createdAt (DateTime)

### Account & Session
- NextAuth.js session management tables

---

## User Flow

### New User Journey
1. Land on homepage
2. Click "Get Started"
3. Register with name, email, password
4. Redirected to login
5. Login with credentials
6. Arrive at dashboard
7. Add first German word
8. Continue adding words
9. Start quiz when ready

### Returning User Journey
1. Visit website
2. Login
3. View dashboard with existing words
4. Add more words or start quiz
5. Take quiz and see results
6. Review vocabulary and practice again

---

## Pages Structure

```
/                    - Homepage (landing page)
/login              - Login page
/register           - Registration page
/dashboard          - Main dashboard (vocabulary list)
/quiz               - Quiz interface
/api/auth/[...nextauth] - NextAuth endpoints
/api/register       - User registration API
/api/words          - CRUD operations for words
/api/quiz/submit    - Submit quiz results
```

---

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, logout, session)

### Words
- `GET /api/words` - Get all words for authenticated user
- `POST /api/words` - Create new word
- `PATCH /api/words/[id]` - Update word
- `DELETE /api/words/[id]` - Delete word

### Quiz
- `POST /api/quiz/submit` - Submit quiz result

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vokabelbuch"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

---

## Development Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)

### Installation Steps
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run Prisma migrations: `npx prisma migrate dev`
5. Generate Prisma client: `npx prisma generate`
6. Start development server: `npm run dev`
7. Open http://localhost:3000

### Deployment Steps
1. Push code to GitHub
2. Connect repository to Vercel
3. Set up PostgreSQL database (Neon/Supabase)
4. Add environment variables in Vercel
5. Deploy
6. Connect custom domain (vokabelbuch.com)

---

## Future Enhancements (Post-MVP)

### Phase 2 - Enhanced Learning
- Spaced repetition algorithm (review words at optimal intervals)
- Multiple choice quiz option
- Audio pronunciation for German words
- Example sentences for each word
- Word categories/tags (nouns, verbs, adjectives, etc.)
- Conjugation tables for verbs
- Gender indicators for nouns (der/die/das)

### Phase 3 - User Experience
- Dark mode toggle
- Statistics dashboard (learning progress over time)
- Streak counter (daily practice tracking)
- Achievement badges
- Export vocabulary to PDF/CSV
- Import vocabulary from files

### Phase 4 - Social Features
- Share vocabulary lists with other users
- Community word lists
- Study groups
- Leaderboards

### Phase 5 - Advanced Features
- Mobile app (React Native)
- Offline mode (PWA)
- Integration with German dictionaries
- AI-powered word suggestions
- Speech recognition for pronunciation practice
- Flashcard mode

---

## Cost Analysis

### MVP Costs (Monthly)
- **Hosting (Vercel):** $0 (free tier sufficient for MVP)
- **Database (Neon/Supabase):** $0 (free tier: 0.5GB storage)
- **Domain:** Already owned ✓
- **Total:** $0/month

### Scaling Costs (Future)
- Vercel Pro: $20/month (after 1000+ users)
- Database upgrade: $10-25/month (after free tier limits)
- CDN/Assets: Variable based on traffic

---

## Success Metrics

### MVP Launch Metrics
- Number of registered users
- Average words per user
- Quiz completion rate
- Daily/Weekly active users
- User retention rate

### Target Goals (3 months post-launch)
- 100+ registered users
- 50+ daily active users
- 1000+ words in database
- 500+ quizzes completed
- 60%+ user retention rate

---

## Timeline

### Week 1: Setup & Backend ✓
- Project initialization
- Database schema design
- API endpoints development
- Authentication implementation

### Week 2: Frontend Development ✓
- UI component library setup
- Page layouts (home, auth, dashboard, quiz)
- Form validation
- Responsive design

### Week 3: Testing & Polish
- User testing
- Bug fixes
- Performance optimization
- UI/UX improvements

### Week 4: Deployment
- Production database setup
- Environment configuration
- Domain connection
- Launch! 🚀

---

## Support & Maintenance

### Regular Tasks
- Monitor error logs
- Database backups
- Security updates
- User feedback collection
- Performance monitoring

### Tools
- Vercel Analytics (built-in)
- Sentry (error tracking) - future
- Google Analytics - future

---

## Conclusion

Vokabelbuch MVP focuses on core functionality: saving vocabulary and testing knowledge through quizzes. The tech stack is modern, scalable, and cost-effective. The application is designed to provide immediate value to German learners while laying groundwork for future enhancements.

**Next Steps:**
1. Complete development (this document)
2. Set up production database
3. Deploy to Vercel
4. Connect domain
5. User testing
6. Launch and gather feedback!

---

*Last Updated: December 18, 2025*

