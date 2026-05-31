# VEC Admin

Panel de administración para **Iglesia Vida en Cristo (VEC)**. Gestión de miembros, asistencia y reportes internos.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS v4 |
| ORM | Prisma 7 + MariaDB/MySQL |
| Auth | NextAuth v5 (beta) |
| Formularios | React Hook Form + Zod v4 |
| Data fetching | TanStack Query v5 |
| Runtime gestor | PM2 |

## Requisitos

- Node.js ≥ 18
- pnpm
- MySQL / MariaDB en ejecución

## Instalación

```bash
pnpm install
```

Copia las variables de entorno y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión MySQL |
| `AUTH_SECRET` | Secreto de NextAuth (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL de la app en producción |

Aplica las migraciones y genera el cliente Prisma:

```bash
pnpm prisma migrate deploy
pnpm prisma generate
```

Opcional — poblar datos iniciales:

```bash
pnpm prisma db seed
```

## Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Producción

```bash
pnpm build
pnpm start
# o con PM2:
pm2 start ecosystem.config.js
```

## Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/           # Páginas públicas (login)
│   ├── (dashboard)/      # Páginas protegidas (members, events, finances, reports, settings)
│   └── api/              # Route Handlers REST
├── features/             # Módulos de negocio (auth, members, dashboard, events, finances, reports, settings)
├── components/           # UI compartida (ui/, layout/, shared/)
├── lib/                  # Singletons: prisma, auth, utils, constants
├── hooks/                # Hooks globales
└── types/                # Tipos TypeScript derivados de Prisma
```

Ver [ARCHITECTURE.md](ARCHITECTURE.md) para convenciones detalladas.
