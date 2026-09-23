// All mock data lives here. Edit freely.
// `dueInDays` is relative to today (negative = overdue) so the demo always looks current.

export type ItemType = 'Assignment' | 'Prelab' | 'Quiz' | 'Project' | 'Midterm'

export interface CourseItem {
  id: string
  title: string
  type: ItemType
  dueInDays: number
}

export interface Course {
  id: string
  name: string
  subtitle: string
  items: CourseItem[]
}

export interface School {
  id: string
  name: string
  courses: Course[]
}

export const schools: School[] = [
  {
    id: 'waterloo',
    name: 'Waterloo',
    courses: [
      {
        id: 'cs135',
        name: 'CS 135',
        subtitle: 'Designing Functional Programs',
        items: [
          { id: 'cs135-a5', title: 'Assignment 5: Lists', type: 'Assignment', dueInDays: 2 },
          { id: 'cs135-q3', title: 'Module 6 Quiz', type: 'Quiz', dueInDays: 6 },
          { id: 'cs135-a6', title: 'Assignment 6: Trees', type: 'Assignment', dueInDays: 13 },
        ],
      },
      {
        id: 'math135',
        name: 'MATH 135',
        subtitle: 'Algebra',
        items: [
          { id: 'm135-a4', title: 'Assignment 4: Divisibility', type: 'Assignment', dueInDays: -1 },
          { id: 'm135-a5', title: 'Assignment 5: Congruences', type: 'Assignment', dueInDays: 5 },
          { id: 'm135-mt', title: 'Midterm Exam', type: 'Midterm', dueInDays: 12 },
          { id: 'm135-a6', title: 'Assignment 6: RSA', type: 'Assignment', dueInDays: 19 },
        ],
      },
      {
        id: 'math137',
        name: 'MATH 137',
        subtitle: 'Calculus 1',
        items: [
          { id: 'm137-a3', title: 'Assignment 3: Limits', type: 'Assignment', dueInDays: 1 },
          { id: 'm137-q2', title: 'Online Quiz 2', type: 'Quiz', dueInDays: 8 },
          { id: 'm137-a4', title: 'Assignment 4: Derivatives', type: 'Assignment', dueInDays: 15 },
        ],
      },
    ],
  },
  {
    id: 'laurier',
    name: 'Laurier',
    courses: [
      {
        id: 'bu111',
        name: 'BU 111',
        subtitle: 'Foundations of Business',
        items: [
          { id: 'bu111-pl', title: 'Prelab 4: Case Analysis', type: 'Prelab', dueInDays: 3 },
          { id: 'bu111-a2', title: 'Assignment 2: Business Model Canvas', type: 'Assignment', dueInDays: 9 },
          { id: 'bu111-pr', title: 'Team Project Proposal', type: 'Project', dueInDays: 16 },
        ],
      },
      {
        id: 'ec120',
        name: 'EC 120',
        subtitle: 'Microeconomics',
        items: [
          { id: 'ec120-a2', title: 'Assignment 2: Supply & Demand', type: 'Assignment', dueInDays: 4 },
          { id: 'ec120-q2', title: 'Chapter 4 Quiz', type: 'Quiz', dueInDays: 10 },
        ],
      },
    ],
  },
]

export const DAY_MS = 86_400_000

/** Resolve an item's relative due offset into a concrete date (end of that day). */
export function dueDate(item: CourseItem): Date {
  const d = new Date()
  d.setHours(23, 59, 0, 0)
  return new Date(d.getTime() + item.dueInDays * DAY_MS)
}
