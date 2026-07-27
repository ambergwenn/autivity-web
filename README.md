# 🌟 Autivity — Web Portal & Landing Page

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

> **Autivity** is an evidence-based, sensory-safe adaptive learning platform designed to empower neurodivergent (ASD) learners. This repository contains the web application housing the public **Landing Page** and the secure **Admin Management Portal**.

---

## 📌 Overview

The Autivity web application serves as the digital front door for educators, parents, and platform administrators. Built with modern web technologies, it features:

- **Public Landing Page:** Showcases Autivity's architecture, sensory-safe motor engine, interactive activity previews, research foundations, and mobile application download options.
- **Admin Management Portal:** A secure interface allowing system administrators to manage accounts, provision and verify educator profiles, configure adaptive activities with dynamic JSON data, and oversee class assignments.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Nova preset) built with Base UI primitives & [Lucide Icons](https://lucide.dev/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth Admin API)

---

## ✨ Features

### 🎨 1. Public Landing Page
- **Hero Section:** Highlights Autivity's mission, sensory-safe environment, and errorless learning framework.
- **Role-Based Value Cards:** Dedicated feature overviews tailored for Learners, Teachers & OTs, and Parents.
- **Feature Previews:** Component previews demonstrating the features of mobile app.
- **Scientific & Academic Basis:** Details the science supporting the platform.
- **Call to Action (CTA) & Download Section:** Direct store download badges and links to the login portal.

### 🔐 2. Admin Management Portal & Login
- **Secure Administrator Authentication:** Protected admin login system.
- **User & Educator Provisioning:** Provisions verified accounts using the Supabase Auth Admin API (`supabase.auth.admin.createUser`) to safely generate temporary credentials and inject role metadata.
- **Activity Content CMS:** Manage adaptive learning activities with structured `JSONB` payloads (`content_data`) and difficulty tiering.
- **Classroom Management:** Create classrooms and assign verified teachers dynamically.

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- `npm`, `pnpm`, or `yarn`

### 1. Clone the Repository

```bash
git clone [https://github.com/your-org/autivity-web.git](https://github.com/your-org/autivity-web.git)
cd autivity-web
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your Supabase environment variables into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=[https://your-supabase-project.supabase.co](https://your-supabase-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Start the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the **Landing Page**. Navigate to `/login` to access the **Admin Login Portal**.

---

## 📄 License

This project is proprietary software developed for **Autivity**. All rights reserved.
