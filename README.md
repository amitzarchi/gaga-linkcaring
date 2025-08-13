### Gaga X LinkCaring

Admin dashboard for the Gaga X LinkCaring API.

## Quick Start (with Bun)

### Prerequisites
- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- PostgreSQL database (Neon recommended)
- Google OAuth 2.0 credentials
- Cloudflare R2 bucket and API keys (for video storage)

### 1) Clone
```bash
git clone https://github.com/<your-org>/gaga-linkcaring.git
cd gaga-linkcaring
```

### 2) Install deps
```bash
bun install
```

### 3) Configure environment
Create a `.env.local` file in the project root:
```bash
cp .env.local.example .env.local # if you create one
# or create it manually:
```

Put the following variables in `.env.local`:
```bash
# Database (Neon Postgres recommended)
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DBNAME"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Better Auth core
# Base URL of your app (include protocol); use your deployed URL in production
BETTER_AUTH_URL="http://localhost:3000"
# Secret for signing/encryption (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET="replace-with-a-secure-random-string"

# External analyze API
GAGA_API_URL="https://api.gaga.care"
GAGA_API_KEY="your-secret-api-key"

# Cloudflare R2 (S3-compatible) for file storage
R2_ENDPOINT="https://<accountid>.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="your-bucket-name"
```

### 4) Initialize the database (Drizzle)
Push the schema to your database:
```bash
bunx drizzle-kit push
```

### 5) Seed data
```bash
bun run seed
# optional, granular seeds
bun run seed:milestones
bun run seed:milestone-age-statuses
bun run seed:validators
bun run seed:systemprompt
```

### 6) Run the app
```bash
bun run dev
```
Open http://localhost:3000

### 7) Production build
```bash
bun run build
bun run start
```

## Notes
- Sign-in uses Google OAuth and access can be restricted to approved emails via the `access_requests` table. Use the Request Access flow in-app or pre-populate approvals as needed.
- Video uploads use Cloudflare R2. Ensure the R2 credentials and bucket exist and are correct.
