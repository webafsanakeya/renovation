# Crafting Renovation: Home Renovation & Carpentry Website

A full-stack website for a home renovation and custom carpentry business, with a public marketing site and a protected admin dashboard for managing content.

**Live demo:** https://renovation-swart.vercel.app
**Admin panel:** https://renovation-swart.vercel.app/admin/login
**Admin credentials:** provided separately (not stored in this repository)

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React, TypeScript |
| Database | MongoDB Atlas with Mongoose |
| Styling | Tailwind CSS v4, shadcn/ui, Framer Motion |
| Auth | JWT (`jose`) in an httpOnly cookie, route protection in `proxy.ts` |
| Hosting | Vercel |

---

## Features

### Public website
- Home, About, Services, Projects, Blog / Vlog, Contact and a custom 404 page
- Detail pages for services, projects and blog posts (server-rendered, `generateMetadata` per page)
- Blog posts can embed an optional YouTube video (privacy-enhanced `youtube-nocookie.com`)
- Project pages with an image gallery
- Contact form with client and server validation (including phone number), honeypot spam protection and stored messages
- Responsive layout, keyboard-friendly navigation, visible focus states and semantic headings

### Admin dashboard
- Dashboard with content stats (total, published, draft) and recent contact messages
- Full CRUD for Services, Blogs and Projects
- Publish / unpublish toggle, only published items appear on the public site
- Field-level validation (shared between client and server) with success and error toasts
- Inline delete confirmation instead of a browser `confirm()` dialog
- SEO management for every item: meta title, meta description, keywords, Open Graph fields, canonical URL, plus a simple SEO checklist and score

### SEO
- Unique title, description and canonical URL for each page
- `LocalBusiness` JSON-LD on the home page and `BlogPosting` JSON-LD on posts
- `sitemap.xml` and `robots.txt`
- Optimized images with `next/image`, correct `sizes` and a prioritized hero image

### Security
- Admin session stored in an httpOnly, `sameSite=lax` cookie (`secure` in production)
- `/admin/*` and `/api/admin/*` protected by `proxy.ts`
- Login uses a generic error message, constant-time credential comparison and basic rate limiting
- JSON-LD output is escaped to avoid script injection

---

## Lighthouse (home page)

Measured on the live site in an incognito window. Mobile emulation (Moto G Power), Slow 4G throttling, Lighthouse 13.4.1, 19 Oct 2026.

| Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|
| 94 | 100 | 100 | 100 |

Core metrics: FCP 1.1 s, LCP 2.5 s, TBT 230 ms, CLS 0.

---

## Getting Started

### Prerequisites
- Node.js 20 or later
- A MongoDB Atlas cluster (or any MongoDB instance)

### Installation

```bash
git clone https://github.com/webafsanakeya/renovation-site.git
cd renovation-site
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.local` is git-ignored. Never commit real credentials.

### Run

```bash
npm run dev      # development
npm run build    # production build
npm start        # run the production build
```

Open http://localhost:3000. Log in at `/admin/login` with the admin credentials from your `.env.local`.

---

## Project Structure

```
src/
  app/
    (site)/            public pages (home, services, projects, blog, about, contact)
    admin/             dashboard, login and resource management pages
    api/
      admin/           protected CRUD and stats endpoints
      auth/            login and logout
      contact/         public contact form endpoint
  components/
    site/              public UI (navbar, footer, hero, cards, forms)
    admin/             ResourceManager (shared CRUD UI)
    ui/                shadcn/ui components
  lib/                 database, auth, validation, SEO helpers
  models/              Mongoose models (Service, Blog, Project, Message)
  proxy.ts             route protection for admin pages and APIs
```

---

## Design Decisions

- **One reusable `ResourceManager`** powers CRUD for all three content types, so validation, feedback and layout stay consistent.
- **Shared validation modules** are used by both the forms and the API routes, so the rules cannot drift apart.
- **Server Components by default.** Only interactive parts (navbar, forms, admin UI) are client components.
- **Unknown image hosts fall back to a plain `<img>`** so a bad URL never crashes a page.

---

## Version 2 Improvements

This project was first built as a technical assessment. After receiving a review, I improved it in four areas:

1. **SEO:** unique metadata and canonical URLs, structured data, semantic heading order.
2. **Forms and validation:** phone, email and content validation on both client and server, with clear inline errors.
3. **Admin and auth:** stats dashboard, redesigned login with safer error handling and rate limiting, CRUD validation with toast feedback.
4. **Design and accessibility:** typography, spacing and card consistency, hero image, keyboard focus states, and contrast fixes.

---

## Known Limitations and Next Steps

- Public pages use `force-dynamic`. Moving to ISR with on-demand revalidation would cut response time further.
- Login rate limiting is in-memory, so on serverless hosting it is best-effort. A shared store such as Redis would make it strict.
- Image upload is URL-based. Direct upload to cloud storage would be a natural next feature.
- Automated tests (API routes and validation) are not included yet.

---

## Author

**Afsana Noor Keya**, full-stack developer
GitHub: [webafsanakeya](https://github.com/webafsanakeya)
LinkedIn: [linkedin.com/in/web-afsana-noor-keya-](https://www.linkedin.com/in/web-afsana-noor-keya-)