# VEC Admin — Architecture Guide

Sistema de administración para Iglesia Vida en Cristo (VEC).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| ORM | Prisma 7 (MySQL) |
| Auth | NextAuth v5 (beta) |
| Forms | React Hook Form + Zod |
| Data fetching | TanStack Query v5 |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router — routing only
│   ├── (auth)/             # Route group: unauthenticated pages
│   ├── (dashboard)/        # Route group: authenticated pages (shared layout)
│   └── api/                # Route Handlers (REST endpoints)
│
├── features/               # Feature modules (main business logic)
│   ├── auth/
│   ├── members/
│   ├── dashboard/
│   ├── events/             # Future
│   ├── finances/           # Future
│   └── reports/            # Future
│
├── components/             # Shared UI (no business logic)
│   ├── ui/                 # Primitive components (Button, Input, Modal…)
│   ├── layout/             # Structural components (Sidebar, Topbar…)
│   └── shared/             # Cross-feature composites
│
├── lib/                    # Infrastructure singletons & utilities
│   ├── prisma.ts           # PrismaClient singleton
│   ├── auth.ts             # NextAuth configuration & exports
│   ├── utils.ts            # cn() and other generic utilities
│   └── constants.ts        # App-wide constant arrays (districts, etc.)
│
├── hooks/                  # Global custom React hooks
│
└── types/
    └── index.ts            # Base TypeScript types derived from Prisma models
```

### Feature module anatomy

Each feature under `src/features/<name>/` follows this internal structure:

```
features/<name>/
├── components/     # React components scoped to this feature
├── actions/        # Server Actions ("use server" files)
├── schemas/        # Zod validation schemas
├── hooks/          # React hooks scoped to this feature (optional)
└── types.ts        # Feature-specific types (re-exports or extensions of src/types)
```

---

## Conventions

### Language

- **All code is in English**: file names, folder names, function names, variable names, TypeScript types, database field names, environment variable names.
- **User-visible text is in Spanish**: labels, placeholders, error messages, page headings, button text — anything rendered in the UI.

### Pages vs Features

`app/` pages are thin shells. They import and render feature components; they do not contain business logic, data fetching, or form handling directly.

```tsx
// app/(dashboard)/members/page.tsx  ✅
import { MemberListView } from '@/features/members/components/MemberListView'
export default function MembersPage() {
  return <MemberListView />
}
```

### Server Actions

Place all mutations inside `features/<name>/actions/`. Mark each file or function with `'use server'`. Always verify authentication at the top of every action.

```ts
// features/members/actions/createMember.ts
'use server'
import { auth } from '@/lib/auth'

export async function createMember(input: CreateMemberInput) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  // ...
}
```

### API Routes

Route Handlers in `app/api/` are for external consumers or cases where a REST interface is necessary. Prefer Server Actions for internal mutations triggered from the UI.

### Data flow

```
Page (app/)
  └─ Feature component (features/<name>/components/)
       ├─ reads via TanStack Query hook (features/<name>/hooks/)
       │    └─ calls API route (app/api/) or direct server query
       └─ mutates via Server Action (features/<name>/actions/)
```

### Prisma client

Always import `prisma` from `@/lib/prisma`. Never instantiate `PrismaClient` elsewhere.

```ts
import { prisma } from '@/lib/prisma'
```

The generated client lives in `src/generated/prisma` (Prisma 7 default output). Run `pnpm prisma generate` after any schema change.

### Styling

Use `cn()` from `@/lib/utils` to merge Tailwind classes conditionally.

```ts
import { cn } from '@/lib/utils'
```

---

## Adding a New Module

1. **Create the feature directory**:
   ```
   src/features/<name>/
   ├── components/
   ├── actions/
   ├── schemas/
   ├── hooks/       (if needed)
   └── types.ts
   ```

2. **Add Prisma model** to `prisma/schema.prisma`, then run:
   ```bash
   pnpm prisma migrate dev --name add_<name>
   ```

3. **Export base types** from `src/types/index.ts`.

4. **Add app pages** under the appropriate route group in `src/app/(dashboard)/<name>/`.

5. **Add API routes** (if needed) under `src/app/api/<name>/`.

6. **Register navigation** in the sidebar component inside `src/components/layout/`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `AUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (required in production) |
