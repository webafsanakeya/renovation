# Home Renovation Website

A modern, responsive website for a home renovation and carpentry company, with an admin dashboard to manage all public content. Built with Next.js, TypeScript and MongoDB.

**Live site:** https://renovation-swart.vercel.app
**Admin panel:** https://renovation-swart.vercel.app/admin

## Admin Login

| | |
|---|---|
| Email | `admin@renovation.com` |
| Password | Provided in the submission email |

## Features

### Public website
- Home, About, Services, Service details, Blog, Blog details, Projects, Project details, Contact
- Content is loaded from MongoDB and rendered on the server for SEO
- Only **published** content is shown to visitors
- Contact form saves messages to the database
- Fully responsive layout and optimised images (`next/image`)

### Admin dashboard
- Secure login (JWT in an httpOnly cookie)
- Create, edit, delete and publish/unpublish **Services**, **Blogs** and **Projects**
- Changes appear on the public website immediately
- Animated dashboard built with Framer Motion

### SEO management (bonus)
Every service, blog and project has an SEO section in the admin form:
- Meta title and meta description (with character counters)
- Keywords
- Open Graph title, description and image
- Canonical URL
- SEO-friendly slug (auto-generated from the title)
- Live **SEO score and checklist** that suggests improvements

SEO output on the public site:
- `generateMetadata` on every detail page (title, description, keywords, Open Graph, canonical)
- `sitemap.xml` and `robots.txt` generated from the database
- JSON-LD structured data on blog posts

## Tech Stack

- **Next.js 16** (App Router) and **React**
- **TypeScript**
- **MongoDB Atlas** with **Mongoose**
- **Tailwind CSS v4** and **shadcn/ui**
- **Framer Motion**
- **jose** for JWT authentication
- Deployed on **Vercel**

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/webafsanakeya/renovation-site.git
cd renovation-site
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/renovation
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_long_random_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login credentials |
| `JWT_SECRET` | Secret used to sign the admin session token |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for canonical URLs and the sitemap |

### 3. Run

```bash
npm run dev
```

Open http://localhost:3000. The admin panel is at http://localhost:3000/admin.

### 4. Production build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (site)/            # Public pages (Home, About, Services, Blog, Projects, Contact)
│   ├── admin/             # Admin dashboard and login
│   ├── api/
│   │   ├── admin/         # Protected CRUD APIs (services, blogs, projects)
│   │   ├── auth/          # Login and logout
│   │   └── contact/       # Public contact form endpoint
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── admin/             # Reusable admin CRUD component
│   └── site/              # Navbar, Footer, cards, forms
├── lib/                   # DB connection, auth, SEO and data helpers
├── models/                # Mongoose models (Service, Blog, Project, Message)
└── proxy.ts               # Protects /admin and /api/admin routes
```

## API Overview

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET, POST | `/api/admin/{services,blogs,projects}` | List and create (admin only) |
| GET, PUT, DELETE | `/api/admin/{services,blogs,projects}/[id]` | Read, update, delete (admin only) |
| POST | `/api/contact` | Submit a contact message |

## Notes

- Sample content (projects, locations, blog posts) is for demonstration only.
- Images are from [Unsplash](https://unsplash.com) (free license) or placeholders.
- Design is inspired by common home renovation websites. No text or images were copied from any reference site.

## Author

Afsana Noor Keya
GitHub: [@webafsanakeya](https://github.com/webafsanakeya)