# TechPulse — Full Setup Guide
## Prisma + NextAuth + NewsAPI

---

## STEP 1 — Install Dependencies

```bash
npm install prisma @prisma/client
npm install next-auth @auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs
npx prisma init
```

---

## STEP 2 — Environment Variables

Create `.env.local` in your project root:

```env
# Database (use free PostgreSQL from https://neon.tech or https://supabase.com)
DATABASE_URL="postgresql://user:password@host/techpulse?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# NewsAPI (free key from https://newsapi.org/register)
NEWS_API_KEY="your_newsapi_key_here"
```

> Generate NEXTAUTH_SECRET by running: `openssl rand -base64 32`

---

## STEP 3 — Prisma Schema

Replace `prisma/schema.prisma` with:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String     @id @default(cuid())
  name          String?
  email         String     @unique
  password      String?
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  bookmarks     Bookmark[]
  createdAt     DateTime   @default(now())
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Bookmark {
  id          String   @id @default(cuid())
  userId      String
  articleUrl  String
  title       String
  description String?
  imageUrl    String?
  source      String?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, articleUrl])
}
```

Run migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## STEP 4 — Prisma Client

Create `lib/db.ts`:

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

---

## STEP 5 — NextAuth Setup

Create `lib/auth.ts`:

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',   // use JWT so credentials provider works
  },
  pages: {
    signIn: '/login',  // custom login page
  },
  providers: [
    // Option A: Email + Password login
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return user
      },
    }),

    // Option B: GitHub OAuth (optional, free)
    GitHubProvider({
      clientId:     process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
}
```

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

---

## STEP 6 — Register API Route

Create `app/api/register/route.ts`:

```typescript
// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await db.user.create({
    data: { name, email, password: hashed },
  })

  return NextResponse.json({ user: { id: user.id, email: user.email } })
}
```

---

## STEP 7 — NewsAPI Service

Create `lib/news.ts`:

```typescript
// lib/news.ts

export interface Article {
  source:      { id: string | null; name: string }
  author:      string | null
  title:       string
  description: string | null
  url:         string
  urlToImage:  string | null
  publishedAt: string
  content:     string | null
}

export interface NewsResponse {
  status:       string
  totalResults: number
  articles:     Article[]
}

// Fetch top tech headlines (cached for 1 hour via ISR)
export async function getTopHeadlines(page = 1): Promise<NewsResponse> {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?category=technology&pageSize=12&page=${page}&apiKey=${process.env.NEWS_API_KEY}`,
    { next: { revalidate: 3600 } }  // ISR: revalidate every 1 hour
  )

  if (!res.ok) throw new Error('Failed to fetch headlines')
  return res.json()
}

// Search articles by keyword
export async function searchArticles(query: string): Promise<NewsResponse> {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${process.env.NEWS_API_KEY}`,
    { next: { revalidate: 600 } }   // cache search for 10 minutes
  )

  if (!res.ok) throw new Error('Failed to search articles')
  return res.json()
}
```

---

## STEP 8 — Bookmark Server Actions

Create `app/actions/bookmarks.ts`:

```typescript
// app/actions/bookmarks.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function addBookmark(article: {
  url:         string
  title:       string
  description: string | null
  urlToImage:  string | null
  source:      { name: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  await db.bookmark.upsert({
    where: {
      userId_articleUrl: {
        userId:     session.user.id,
        articleUrl: article.url,
      },
    },
    update: {},
    create: {
      userId:      session.user.id,
      articleUrl:  article.url,
      title:       article.title,
      description: article.description,
      imageUrl:    article.urlToImage,
      source:      article.source.name,
    },
  })

  revalidatePath('/bookmarks')
}

export async function removeBookmark(articleUrl: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  await db.bookmark.deleteMany({
    where: {
      userId:     session.user.id,
      articleUrl: articleUrl,
    },
  })

  revalidatePath('/bookmarks')
}

export async function getUserBookmarks() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return []

  return db.bookmark.findMany({
    where:   { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
}
```

---

## STEP 9 — Homepage (Server Component)

Update `app/page.tsx`:

```typescript
// app/page.tsx
import { getTopHeadlines } from '@/lib/news'
import { getUserBookmarks } from '@/app/actions/bookmarks'
import ArticleCard from '@/components/ArticleCard'

export default async function HomePage() {
  const [{ articles }, bookmarks] = await Promise.all([
    getTopHeadlines(),
    getUserBookmarks(),
  ])

  const bookmarkedUrls = new Set(bookmarks.map((b) => b.articleUrl))

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Top Tech News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.url}
            article={article}
            isBookmarked={bookmarkedUrls.has(article.url)}
          />
        ))}
      </div>
    </main>
  )
}
```

---

## STEP 10 — Middleware (Auth Guard)

Update `middleware.ts`:

```typescript
// middleware.ts
export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/bookmarks/:path*'],
}
```

---

## STEP 11 — SessionProvider (Client)

Update `app/layout.tsx`:

```typescript
// app/layout.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/SessionProvider'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

Create `components/SessionProvider.tsx`:

```typescript
// components/SessionProvider.tsx
'use client'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  return <NextAuthProvider session={session}>{children}</NextAuthProvider>
}
```

---

## Final Folder Structure

```
techpulse/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   ✅ NextAuth
│   │   └── register/route.ts             ✅ Registration
│   ├── actions/
│   │   └── bookmarks.ts                  ✅ Server Actions
│   ├── layout.tsx                        ✅ SessionProvider
│   └── page.tsx                          ✅ Homepage
├── lib/
│   ├── auth.ts                           ✅ NextAuth config
│   ├── db.ts                             ✅ Prisma client
│   └── news.ts                           ✅ NewsAPI service
├── prisma/
│   └── schema.prisma                     ✅ DB schema
├── middleware.ts                         ✅ Auth guard
└── .env.local                            ✅ All secrets
```

---

## Quick Start Commands

```bash
# 1. Install everything
npm install prisma @prisma/client next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

# 2. Setup database
npx prisma migrate dev --name init
npx prisma generate

# 3. Run the app
npm run dev
```

> Get your free NewsAPI key at: https://newsapi.org/register
> Get free PostgreSQL DB at: https://neon.tech (no credit card needed)