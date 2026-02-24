# Uqie Personal Portfolio Website

A modern, minimalist personal portfolio website built with Next.js 16, TypeScript, and Tailwind CSS. This project showcases projects, experience, blog posts, and technical expertise with a sleek dark/light theme support.

![Next.js](https://img.shields.io/badge/Next.js-16-black?**style**=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### Public Pages
- **Home** - Hero section, about me, portfolio showcase, experience timeline, tech stack slider
- **Blog** - Blog listing with pagination and individual post pages with slug routing
- **Projects** - Portfolio/Projects gallery with filtering
- **Features** - Feature showcase page
- **Login** - Authentication portal for admin access

### Admin Dashboard
- **Dashboard Overview** - Statistics cards showing total items (portfolios, experiences, blogs, tech stacks)
- **Portfolio Management** - CRUD operations for portfolio items
- **Experience Management** - Timeline-based work experience entries
- **Blog Management** - Create, edit, publish blog posts with slug generation
- **Tech Stack Management** - Technology skills with categories and proficiency levels

### Core Features
- 🌙 **Dark/Light Theme** - System preference detection with manual toggle
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **Authentication** - JWT-based login with refresh tokens
- 🎨 **Animations** - Smooth page transitions and micro-interactions
- 🔍 **SEO Optimized** - Metadata and Open Graph tags
- 📊 **Analytics** - Vercel Analytics integration
- 🐳 **Docker Support** - Multi-stage Docker build
- ⚡ **Performance** - Image optimization and code splitting

## 🛠 Tech Stack

### Core
- **Framework:** Next.js 16.0.0 (App Router)
- **Language:** TypeScript
- **Runtime:** Node.js 20

### Styling & UI
- **CSS:** Tailwind CSS 4.x
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Fonts:** Work Sans (Google Fonts)

### State & Data
- **State Management:** Zustand with persistence
- **Form Handling:** React Hook Form
- **Validation:** Zod schemas
- **API Client:** Custom singleton with JWT handling

### DevOps
- **Containerization:** Docker (multi-stage build)
- **Deployment:** Vercel
- **Analytics:** @vercel/analytics

## 📁 Project Structure

```
v3-personal-site/
├── app/                        # Next.js App Router pages
│   ├── admin/                  # Admin dashboard pages
│   │   ├── blog/              # Blog management
│   │   ├── experience/        # Experience management
│   │   ├── portfolio/         # Portfolio management
│   │   ├── tech-stack/        # Tech stack management
│   │   ├── layout.tsx         # Admin layout
│   │   └── page.tsx           # Admin dashboard
│   ├── blog/                  # Blog pages
│   │   ├── [slug]/            # Dynamic blog post
│   │   └── page.tsx           # Blog listing
│   ├── features/              # Features page
│   ├── login/                 # Login page
│   ├── projects/              # Projects page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/                # React components
│   ├── ui/                    # shadcn/ui components
│   ├── admin-header.tsx       # Admin header
│   ├── admin-sidebar.tsx      # Admin sidebar
│   ├── animated-hero.tsx      # Animated hero section
│   ├── blog-card.tsx          # Blog card component
│   ├── blog-form.tsx          # Blog form
│   ├── experience-form.tsx    # Experience form
│   ├── experience-timeline.tsx# Experience timeline
│   ├── footer.tsx             # Footer
│   ├── navbar.tsx             # Navigation
│   ├── portfolio-card.tsx     # Portfolio card
│   ├── portfolio-form.tsx     # Portfolio form
│   ├── portfolio-section.tsx  # Portfolio showcase
│   ├── tech-stack-form.tsx    # Tech stack form
│   ├── tech-stack-grid.tsx    # Tech stack grid
│   ├── tech-stack-slider.tsx # Tech stack slider
│   ├── theme-provider.tsx     # Theme context
│   ├── theme-toggle.tsx       # Theme switcher
│   └── ...                    # Other components
├── hooks/                     # Custom React hooks
│   ├── use-blog.ts            # Blog data fetching
│   ├── use-experience.ts      # Experience data
│   ├── use-file.ts            # File handling
│   ├── use-portfolio.ts       # Portfolio data
│   ├── use-tags.ts            # Tag filtering
│   └── use-tech-stack.ts      # Tech stack data
├── lib/                       # Utility libraries
│   ├── api-client.ts          # API client singleton
│   ├── auth-store.ts          # Zustand auth store
│   ├── schemas.ts             # Zod validation schemas
│   ├── types.ts               # TypeScript interfaces
│   ├── constants.ts           # App constants
│   ├── normalize-response.ts  # Response normalization
│   ├── storage.ts             # Storage utilities
│   ├── token-storage.ts       # Token management
│   └── utils.ts               # General utilities
├── public/                    # Static assets
│   ├── images/                # Images and icons
│   └── fonts/                 # Custom fonts
├── styles/                    # Additional styles
├── Dockerfile                 # Docker configuration
├── Jenkinsfile               # Jenkins CI/CD pipeline
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Docker (optional, for containerization)

### Installation

1. Clone the repository:
```
bash
git clone <repository-url>
cd <folder name>
```

2. Install dependencies:
```
bash
npm install
# or
yarn install
```

3. Set up environment variables:
```
bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

4. Run the development server:
```
bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```
bash
npm run build
npm start
```

### Docker Build

```
bash
# Build the Docker image
docker build -t portfolio-site .

# Run the container
docker run -p 3000:3000 portfolio-site
```