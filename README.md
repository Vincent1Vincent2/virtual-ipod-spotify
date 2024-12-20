# 🎓 Examensarbete

## 📝 Projektbeskrivning

## 🚀 Kom igång

### Förutsättningar

- Node.js (v18 eller senare)
- npm
- Git

### Installation

1. Klona repot

```bash
git clone <your-repo-url>
cd <project-name>
```

2. Installera dependencies

```bash
npm install
```

3. Konfigurera miljövariabler

```bash
cp .env.example .env
```

### 🎵 Spotify Setup

1. Skapa en app via [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/create)
2. Lägg till `http://localhost:3000/` som callback URL i app-inställningarna
3. Kopiera Client ID till din `.env` fil

### 🗄️ Databas Setup

Projektet använder PostgreSQL via Neon med Prisma som ORM.

1. Skapa ett konto på [Neon](https://neon.tech)
2. Skapa en ny databas
3. Kopiera connection string till din `.env` fil
4. Kör Prisma migrationer:

```bash
npx prisma generate
npx prisma db push
```

### 🔧 Miljövariabler

```env
DATABASE_URL="postgresql://..."
SPOTIFY_CLIENT_ID="your-client-id"
SPOTIFY_CLIENT_SECRET="your-client-secret"
```

### 🏃‍♂️ Kör projektet

```bash
npm run dev
```

## ✅ Projektkrav Checklista

### 🎯 Godkänt (G) Krav

#### Planering och Research

- [ ] Målgruppsanalys
- [ ] Projekthantering (Trello/Kanban)

#### Design och Prototyping

- [ ] Figma wireframes/prototyp (UX/UI)
- [ ] Responsiv design (2+ skärmstorlekar)
- [ ] WCAG 2.1 compliance

#### Applikationsutveckling

- [ ] Modernt JavaScript-ramverk
- [ ] PostgreSQL + Prisma integration
- [ ] State management
- [ ] Dynamiska, reaktiva komponenter
- [ ] WCAG 2.1 & semantisk HTML
- [ ] Responsiv design (mobil + desktop)

#### Versionshantering

- [ ] Git workflow
- [ ] GitHub repo

#### Slutrapport (2-3 sidor)

- [ ] Engelsk abstract
- [ ] Tech stack & motivering
- [ ] Process dokumentation

#### Deploy

- [ ] Live hosting

### 🌟 Väl Godkänd (VG) Krav

#### Design och Prototyping

- [ ] Interaktiv prototyp
- [ ] Production-ready design
- [ ] Komplett WCAG 2.1 (A & AA)

#### Applikationsutveckling

- [ ] Advanced state management
- [ ] Optimerad kodbas
- [ ] Komponentåteranvändning
- [ ] CRUD-operationer
- [ ] Säker autentisering
- [ ] Full responsivitet

#### Versionshantering

- [ ] Feature branches
- [ ] Pull request workflow
- [ ] Clean commit history
- [ ] Detaljerad README

#### Deploy

- [ ] CI/CD pipeline
- [ ] Automatisk deployment

#### Slutrapport (3-6 sidor)

- [ ] Djupgående processanalys
- [ ] Tekniska val & motiveringar
- [ ] UX/UI dokumentation

## 📂 Projektstruktur

```
├── prisma/                    # Databasmodeller och migrationer
│   ├── migrations/
│   └── schema.prisma
├── public/                    # Statiska filer
│   └── themes/
│       └── classic/
├── src/
│   ├── api/                   # API endpoints
│   │   ├── database/
│   │   └── user/
│   ├── app/
│   │   ├── Components/
│   │   │   ├── iPod/         # iPod-relaterade komponenter
│   │   │   │   ├── ClickWheel/
│   │   │   │   ├── Screen/
│   │   │   │   └── Shell/
│   │   │   ├── Menu/
│   │   │   └── Themes/
│   │   ├── hooks/            # Custom hooks
│   │   ├── layouts/          # Layout komponenter
│   │   └── providers/        # Context providers
│   ├── helpers/              # Hjälpfunktioner
│   ├── services/             # Servicelager
│   ├── types/                # TypeScript typdefinitioner
│   └── utils/                # Utilities
├── .env                      # Miljövariabler
├── next.config.ts           # Next.js konfiguration
├── package.json
└── tsconfig.json            # TypeScript konfiguration
```

## 🛠️ Tech Stack

- Frontend: [Next]
- Backend: [Next]
- Database: PostgreSQL (Neon)
- ORM: Prisma
- Hosting: [Vercel]

## 📚 Användbara länkar

- [Prisma Docs](https://www.prisma.io/docs/)
- [Neon Documentation](https://neon.tech/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
