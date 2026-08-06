# IMPORTANT UI & FRONTEND DEVELOPMENT RULES

## Objective

Your goal is NOT only to make the feature work.

Your goal is to build a production-quality frontend that is clean, scalable, reusable, maintainable, and visually polished.

Always think like a Senior Frontend Engineer and UI Designer.

---

# 1. UI Design Principles

Always follow these principles:

- Prioritize information hierarchy.
- Keep the interface clean and minimal.
- Reduce visual noise.
- Every page should have one obvious primary action.
- Use whitespace generously.
- Avoid unnecessary borders.
- Use subtle shadows only when needed.
- Prefer cards over large tables when appropriate.
- Maintain consistent spacing across the application.
- Follow an 8px spacing system.
- Keep layouts visually balanced.
- Avoid overcrowding.
- Design should feel like a modern SaaS application.

---

# 2. Layout Rules

Desktop

- Max content width: 1280px
- Centered layout
- 24px page padding

Cards

- Border radius: 16px
- Internal padding: 24px
- Soft shadow
- Clear content hierarchy

Sections

- Vertical spacing: 32px

Forms

- Maximum width around 600px

Tables

- Sticky header
- Pagination
- Responsive when possible

---

# 3. Component Rules

Build reusable components.

Never duplicate UI code.

Prefer composition over copy-paste.

Common reusable components include:

- PageHeader
- SummaryCard
- StatsCard
- EmptyState
- LoadingSkeleton
- ErrorState
- SectionTitle
- ConfirmDialog
- DataTable
- FilterBar
- SearchInput

Buttons

- Primary
- Secondary
- Ghost

Inputs

- Consistent height
- Consistent radius

Icons

- Use a single icon library consistently.

---

# 4. UX Rules

Every asynchronous screen must support:

- Loading
- Empty
- Error
- Success

Never leave blank screens.

Loading

- Prefer Skeleton over full-page spinner.

Forms

- Disable submit button while submitting.
- Prevent duplicate submissions.
- Display validation errors clearly.

Delete actions

- Require confirmation.

Search

- Debounce requests.

Pagination

- Preserve filters.
- Preserve sorting.

---

# 5. Typography Rules

Maintain strong visual hierarchy.

Page Title

- Largest typography.

Section Title

- Medium emphasis.

Body Text

- 14–16px.

Caption

- 12px.

Numbers

- Large
- Bold

Currency

- Highlight using primary color.

Avoid excessive bold text.

---

# 6. Data Presentation

Currency

Example:

1,250,000 VND

Dates

Readable format.

Statuses

Display as badges.

Success

Green.

Pending

Orange.

Cancelled

Red.

Zero values

Gray.

Positive values

Primary color.

---

# 7. Responsive Design

Design mobile-first whenever possible.

Support at least:

- Mobile
- Tablet
- Desktop

Avoid horizontal scrolling.

Cards should stack naturally on smaller screens.

---

# 8. Accessibility

Always consider accessibility.

- Keyboard navigation
- Proper focus states
- Semantic HTML
- Accessible colors
- Proper labels
- ARIA when necessary

---

# 9. Code Architecture

Pages should only define layout.

Business logic belongs in:

- Custom hooks
- Services
- State management

API calls must never live directly inside page components.

Extract reusable hooks whenever possible.

Avoid large components.

If a component exceeds approximately 300–400 lines of JSX or becomes difficult to understand, split it into smaller reusable components.

---

# 10. Dashboard Architecture

Dashboard pages should consist of reusable independent widgets.

Example:

DashboardPage

- SummaryCard
- RevenueCard
- PaymentCard
- OrderCard
- RecentActivityCard

Each widget should be independently reusable.

---

# 11. Styling Rules

Never hardcode:

- Colors
- Font sizes
- Border radius
- Shadows
- Spacing

Always use:

- Theme
- Design tokens
- Shared constants

---

# 12. Performance

Avoid unnecessary re-renders.

Memoize expensive computations.

Lazy load heavy components.

Paginate large datasets.

Avoid unnecessary API requests.

Cache server data when appropriate.

---

# 13. Before Writing Code

Before implementing, evaluate:

- Can the layout be improved?
- Can scrolling be reduced?
- Can information hierarchy be improved?
- Can user actions be simplified?
- Can repeated UI become reusable?
- Is there a more intuitive interaction?

If a better UX exists, improve it instead of blindly following the mockup.

---

# 14. Final UI Review Checklist

Before finishing, verify:

✓ Consistent spacing

✓ Consistent typography

✓ Consistent colors

✓ Consistent button styles

✓ Responsive layout

✓ Loading state implemented

✓ Empty state implemented

✓ Error state implemented

✓ Success feedback implemented

✓ Reusable components extracted

✓ No duplicated JSX

✓ No unnecessary API calls

✓ Clean folder structure

✓ Business logic separated from UI

✓ Accessible design

If any item fails, fix it before completing the task.