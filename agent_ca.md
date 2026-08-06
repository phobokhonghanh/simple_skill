# IMPORTANT REACT / NEXT.JS ARCHITECTURE RULES

## Objective

Always build scalable, maintainable, testable and production-ready applications.

Prioritize long-term maintainability over writing code quickly.

Think like a Senior Software Engineer.

---

# 1. Architecture

Follow Clean Architecture principles.

Separate the application into independent layers.

Typical structure:

src/

app/
pages/

components/
shared UI components only

features/
business features

services/
API clients

hooks/
custom reusable hooks

stores/
global state

types/
shared types

constants/
application constants

utils/
pure utility functions

lib/
framework integrations

providers/
React providers

layouts/
application layouts

middleware/
Next.js middleware

---

# 2. Feature First

Organize code by feature instead of file type.

Good

features/
payment/
cashback/
dashboard/
user/

Avoid

components/
pages/
hooks/
services/

containing hundreds of unrelated files.

---

# 3. Component Responsibility

Every component should have one responsibility.

Separate

UI

Business Logic

State

Networking

Never mix everything inside one file.

---

# 4. Pages

Pages should only:

- compose layout
- connect components
- call feature hooks

Pages should NOT contain

- API requests
- business logic
- data transformation
- validation

---

# 5. Components

Components should be:

Small

Reusable

Predictable

Avoid components larger than 300 lines.

Extract repeated JSX immediately.

Prefer composition over inheritance.

---

# 6. Custom Hooks

Move business logic into hooks.

Examples

usePayment()

useCashback()

useDashboard()

useUser()

Hooks should encapsulate

Fetching

Mutation

Transformation

Caching

Error handling

Loading state

---

# 7. API Layer

Never call fetch() directly inside components.

Create

services/

payment.service.ts

cashback.service.ts

user.service.ts

API layer responsibilities

HTTP requests

Authentication

Request mapping

Response mapping

Error mapping

Retry strategy

---

# 8. Data Transformation

Never transform API response inside JSX.

Bad

<Component>

{data.items.filter(...).sort(...).map(...)}

Good

const items = useMemo(...)

or

service

or

hook

---

# 9. State Management

Choose the right state.

Local state

Component only

Context

Shared UI state

Global store

Application state

Server state

TanStack Query

Avoid putting server state into Redux/Zustand.

---

# 10. React Query

Prefer TanStack Query for server state.

Always configure

staleTime

gcTime

retry

enabled

queryKey

Invalidate queries after mutations.

---

# 11. Forms

Use

React Hook Form

+

Zod

Validation belongs outside UI.

---

# 12. Error Handling

Never ignore errors.

Handle

API errors

Validation errors

Network errors

Unexpected errors

Display user-friendly messages.

---

# 13. TypeScript

Avoid

any

Prefer

unknown

Generics

Strict typing

Shared DTOs

Avoid duplicate interfaces.

---

# 14. Naming

Components

PascalCase

Hooks

useSomething

Services

something.service.ts

Utils

camelCase

Types

PascalCase

Constants

UPPER_SNAKE_CASE

---

# 15. Styling

Never hardcode

spacing

colors

font size

radius

shadow

Use

Theme

Tailwind config

Design Tokens

---

# 16. Performance

Memoize expensive calculations.

Use

memo

useMemo

useCallback

only when beneficial.

Lazy load large pages.

Paginate large lists.

Virtualize very large lists.

---

# 17. Dependency Rules

Dependencies must point inward.

Pages

↓

Features

↓

Hooks

↓

Services

↓

API

Never reverse dependencies.

Features should not import pages.

Shared components should not depend on business logic.

---

# 18. Folder Rules

Every feature should be self-contained.

Example

features/

payment/

components/

hooks/

services/

types/

constants/

utils/

index.ts

Avoid deeply nested folders.

---

# 19. Testing

Business logic should be testable.

Pure functions

Unit tests

Hooks

Component tests

Avoid coupling logic with JSX.

---

# 20. Code Review Checklist

Before finishing, verify

✓ No duplicated code

✓ No duplicated types

✓ No API inside components

✓ No business logic inside pages

✓ Reusable hooks extracted

✓ Proper TypeScript types

✓ Proper folder structure

✓ Proper loading states

✓ Proper error states

✓ Responsive UI

✓ Accessible UI

✓ Feature-first organization

✓ Clean Architecture respected

If any rule is violated, refactor before completing.