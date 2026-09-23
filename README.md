# StudentHub

A clickable prototype of a hub for double-degree students (Waterloo + Laurier) to see all their courses and due dates in one place. Everything is mock data; there is no backend.

## How it works

A "bubble tree" that grows downward, one level per click:

1. Sign in (any username works). The sign-in bubble becomes your name.
2. Click it to reveal **Waterloo** and **Laurier**.
3. Pick a school to expand its course bubbles.
4. Pick a course to see its items (assignments, prelabs, quizzes...) as cards sorted by due date.
   - Due within 3 days: orange highlight
   - Overdue: muted red tag

Every visited level stays on screen. Your path is highlighted in orange, and the other bubbles in those levels are dimmed but still clickable to switch branch. Shimmering ghost bubbles preview the next level and morph into the real bubbles when you click. Dashed lines connect each parent to its children.

The **Back** button (or **Esc**) steps up one level. The breadcrumb (`David › Waterloo › MATH 137`) jumps to any level.

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
- `src/components/` — `Bubble`, `BubbleTree`, `ConnectorLines`, `BackButton`, `Breadcrumb`, `CourseDetail`, `Login`
- `src/lib/format.ts` — name capitalization and Title Case helpers
- `src/data/courses.ts` — mock data
