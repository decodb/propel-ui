<div align="center">

<img src="https://propel-ui-phi.vercel.app/assets/images/og-image.png" alt="Propel" width="100%" style="border-radius: 12px;" />

<br/><br/>

# Propel UI

**The frontend powering Propel — a project management platform built for companies that ship.**

[![Angular](https://img.shields.io/badge/Angular-v22-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Standalone](https://img.shields.io/badge/Architecture-Standalone-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev/guide/components/importing)
[![License: MIT](https://img.shields.io/badge/License-MIT-9046FF?style=flat-square)](LICENSE)

</div>

---

## The Problem

Most frontend codebases start clean and fall apart fast. Features get dumped into a single folder, shared logic bleeds into business logic, and what started as a tidy `components/` directory becomes a graveyard of files nobody wants to touch.

That's a different problem. And that's what this structure is built to solve.

---

## What is Propel?

Propel is a **multi-tenant project management SaaS** — think of it as a platform where companies sign up, get verified by a platform administrator, and immediately unlock a full workspace: projects, tasks, team members, real-time messaging, and file sharing, all scoped to their organisation.

This repository is the **Angular frontend** that makes all of that visible and usable. It communicates exclusively with the [Propel API](https://github.com/decodb/propel-api) via REST.

---

## Who is this for?

If you're a **hiring manager, recruiter, or product person** reading this: Propel UI is a demonstration of what it looks like to design and structure a frontend application from scratch — not a tutorial project, not a clone. Every decision here — the folder structure, the component boundaries, the naming conventions — was made intentionally to reflect how a real Angular SaaS application scales.

If you're a **developer**: the technical details follow below. The stack choices, the structure, the conventions — it's all there.

---

## What can teams do on Propel?

- ✅ **Register a company** — go through a structured onboarding flow with email verification and admin approval before getting access
- 👥 **Manage their team** — invite members, assign roles, and maintain an active user directory
- 📁 **Run projects** — create projects, move them through a full lifecycle, and control who has access
- ✅ **Track tasks** — assign work to specific people with priorities, due dates, and status tracking
- 💬 **Discuss in context** — comment on projects with threaded replies so conversations stay organised
- 📨 **Message privately** — one-on-one chat between team members with support for text, images, and files
- 🖼️ **Upload files** — profile images and attachments previewed and managed directly in the UI

Everything a team needs to coordinate — without the bloat.

---

## Why this stack?

| Layer | Choice | Why |
|---|---|---|
| Framework | **Angular v22** | Opinionated structure that scales. Modules, guards, interceptors, and DI keep the codebase clean as it grows. |
| Language | **TypeScript** | End-to-end type safety. No surprises at runtime. |
| Components | **Standalone** | No `NgModule` boilerplate. Every component declares its own dependencies directly — cleaner, more tree-shakeable, easier to lazy-load. |
| Reactivity | **Signals** | Angular's reactive primitive — no extra libraries, direct integration with change detection, and simpler than RxJS for most UI state. |
| Routing | **Angular Router** | Feature-level route files keep routing co-located with the feature that owns it. |
| HTTP | **`HttpClient`** | With interceptors for JWT injection and global error handling. |
| Auth | **JWT via Interceptor** | Stateless token stored on the client, attached to every outgoing request transparently. |

---

## Features

### 🔐 Authentication & Onboarding
A structured registration flow — company details, admin credentials, email verification — all gated before a user ever sees the main application. Separate login flows for platform admins and company users.

### 👥 Users & Roles
Role-aware UI — what a company `ADMIN` sees and can do is different from what a `MEMBER` sees. Guards protect routes. The UI reflects permissions without requiring the user to understand them.

### 📁 Projects
Full project lifecycle from `PLANNING` through to `COMPLETED` or `CANCELLED`. Members are assigned per project. Status changes are reflected immediately via optimistic UI updates.

### ✅ Tasks
Kanban-style task tracking with status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`), priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), due dates, and clear assignment — who assigned it, who owns it.

### 💬 Comments
Threaded comment sections on projects. Replies are visually nested. The UI handles both top-level comments and inline responses without flattening the conversation.

### 📨 Real-time Chat
Private one-on-one messaging between team members. Rooms are unique per user pair. Messages support text, images, and file attachments, with read receipt tracking.

### 🖼️ File Uploads
Profile images for users and companies, and file attachments in chat — uploaded directly from the UI, stored via the API's Cloudinary integration, and rendered inline.

---

## Project Structure

The application follows the [Angular v22 Folder Structure Guide](https://www.angular.courses/blog/angular-folder-structure-guide), organising `src/app` into three top-level buckets based on the *type* of code — not its technical shape.

```
src/
└── app/
    ├── core/              # Non-business infrastructure
    ├── modules/           # Business features, grouped by domain
    └── shared/            # Reusable, domain-agnostic code
```

### `core/` — Non-business infrastructure

```
core/
├── layout/                    # Shell, navbar, sidebar, footer
├── auth/
│   ├── models/
│   │   └── auth.model.ts
│   ├── guards/
│   │   └── auth-guard.ts
│   ├── services/
│   │   └── auth-store.ts
│   ├── auth.routes.ts
│   └── pages/
│       ├── login/
│       ├── register/
│       └── password-recovery/
├── interceptors/
│   └── api-interceptor.ts     # Attaches JWT to outgoing requests
└── services/
    └── notification-api.ts    # Global toast/notification service
```

### `modules/` — Business features, grouped by domain

Features are grouped by domain rather than listed flat. This is the approach that scales — a `projects/` folder that contains its model, its service, and its pages is far easier to navigate than hunting across separate `services/`, `models/`, and `pages/` directories.

```
modules/
├── company/
│   ├── company.model.ts
│   └── pages/
│       ├── company-profile/
│       └── company-settings/
├── users/
│   ├── user.model.ts
│   ├── user-api.ts
│   └── pages/
│       ├── user-profile/
│       └── user-settings/
├── projects/
│   ├── project.model.ts
│   ├── project-api.ts
│   ├── projects.routes.ts
│   └── pages/
│       ├── project-list/
│       ├── project-detail/
│       └── project-settings/
├── tasks/
│   ├── task.model.ts
│   ├── task-api.ts
│   └── pages/
│       ├── task-list/
│       └── task-detail/
├── comments/
│   ├── comment.model.ts
│   ├── comment-api.ts
│   └── components/
│       ├── comment-thread/
│       └── comment-form/
└── messages/
    ├── message.model.ts
    ├── message-api.ts
    └── pages/
        └── inbox/
```

### `shared/` — Reusable, domain-agnostic code

Components, pipes, and utilities with no business logic. The rule: if a component input is named `projectTitle` instead of `title`, it belongs in `modules/projects/`, not here.

```
shared/
├── components/
│   ├── badge/
│   ├── avatar/
│   ├── status-chip/
│   ├── empty-state/
│   └── confirm-dialog/
├── pipes/
│   ├── time-ago-pipe.ts
│   └── truncate-pipe.ts
└── utils/
    ├── date.utils.ts
    └── string.utils.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI v22

```bash
npm install -g @angular/cli
```

### 1. Clone the repo

```bash
git clone https://github.com/decodb/propel-ui.git
cd propel-ui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Update `src/environments/environment.ts` with your API base URL:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

### 4. Start the development server

```bash
ng serve
```

The application will be available at `http://localhost:4200`.

---

## Scripts

```bash
ng serve            # Start development server with hot reload
ng build            # Compile for production
ng build --watch    # Build with watch mode
ng test             # Run unit tests via Karma
ng lint             # Run ESLint
ng generate         # Scaffold components, services, guards, etc.
```

---

## Naming Conventions

This project follows the updated [Angular style guide](https://angular.dev/style-guide) introduced with Angular v20:

- **Components, Directives, Services** — no suffix on the class name or file name
  - `auth-store.ts` not `auth.service.ts`
  - `login.ts` not `login.component.ts`
- **Pipes, Guards, Resolvers, Interceptors** — keep the suffix, separated by `-`
  - `auth-guard.ts` not `auth.guard.ts`
  - `time-ago-pipe.ts` not `time-ago.pipe.ts`
- **Models** — keep the `.model.ts` suffix for clarity

---

## Security

- **JWT tokens are never logged** — the interceptor attaches them silently and the application never surfaces raw token values in the UI
- **Route guards** enforce both authentication and role-based access — unauthenticated users are redirected, unauthorised ones are blocked before the component loads
- **No sensitive data in local storage** — token handling follows secure storage practices
- **User-uploaded files** are sent to the API and stored on Cloudinary — the frontend never handles raw file data beyond the upload boundary

---

## Reading List

Articles and resources that directly shaped decisions made in this codebase — organised by topic.

### Structure & Architecture
- [Angular v22 Folder Structure Guide](https://www.angular.courses/blog/angular-folder-structure-guide) — the primary reference for the `core / modules / shared` split, the domain-grouping approach inside `modules/`, and the page folder pattern. Also the basis for co-locating models and services inside their domain rather than in a flat shared folder.

### Angular Fundamentals
- [Angular Style Guide](https://angular.dev/style-guide) — official conventions for file naming and class naming updated with Angular v20: no `.component.ts` suffix on components, `-` instead of `.` as separator for guards and pipes.

---

## Related

- **API** — [propel-api](https://github.com/decodb/propel-api) — NestJS + Prisma + PostgreSQL backend

---

## Status

This project is a work in progress. Features are being built out incrementally against the live API.

---

## License

MIT © 2026 [decodb](https://github.com/decodb)
