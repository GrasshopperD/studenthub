# StudentHub

A clickable prototype of a hub for double-degree students (Waterloo + Laurier) to see all their courses and due dates in one place. Everything is mock data; there is no backend.

## How it works

A "bubble tree" you drill into:

1. Sign in (any username works) — the big central bubble becomes your name.
2. Click it to split into **Waterloo** and **Laurier**.
3. Pick a school to expand its course bubbles.
4. Pick a course to see its items (assignments, prelabs, quizzes...) sorted by due date.
   - Due within 3 days: orange highlight
   - Overdue: muted red tag

A **Back** button steps up one level, and the breadcrumb (`User › Waterloo › MATH 137`) lets you jump to any level.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Edit the data

All courses and items live in [`src/data/courses.ts`](src/data/courses.ts). Due dates are `dueInDays` offsets from today, so the demo always looks current.

## Stack

Vite, React, TypeScript, Tailwind CSS v4, Framer Motion.

## Structure

- `src/App.tsx` — navigation state (a single `path` array)
- `src/components/` — `Bubble`, `BubbleTree`, `BackButton`, `Breadcrumb`, `CourseDetail`, `Login`
- `src/data/courses.ts` — mock data
