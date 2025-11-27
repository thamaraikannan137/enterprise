# Employee Feature Implementation - Frontend Structure Analysis

## Current Frontend Structure Analysis

### Existing Structure
```
frontend/src/
├── components/
│   ├── common/          # Reusable UI components (Button, Input, Card, etc.)
│   ├── features/        # Feature-specific components (currently empty)
│   ├── forms/           # Form components (LoginForm, RegisterForm, UserForm)
│   └── layout/           # Layout components (Header, Footer, Navigation, MainLayout)
├── pages/               # Page components (HomePage, AboutPage, LoginPage, RegisterPage)
├── services/            # API service layer (api.ts, userService.ts)
├── store/
│   └── slices/          # Redux slices (authSlice.ts, userSlice.ts)
├── types/               # TypeScript types (index.ts, models.ts)
├── routes/              # Route configuration (index.tsx)
├── config/              # Configuration files (constants.ts, navigation.ts, etc.)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── contexts/            # React contexts (AuthContext, ThemeContext)
```

## Recommended Folder Structure for Employee Feature

### 1. **Types & Interfaces** (`src/types/`)
```
types/
├── index.ts              # Common types (already exists)
├── models.ts             # Domain models (already exists - add Employee types here)
└── employee.ts           # Employee-specific types (NEW)
```

**Files to create:**
- `employee.ts` - Employee interfaces matching backend model

### 2. **Services** (`src/services/`)
```
services/
├── api.ts                # Base API client (already exists)
├── userService.ts        # User service (already exists)
└── employeeService.ts    # Employee service (NEW)
```

**Files to create:**
- `employeeService.ts` - All employee API calls (CRUD operations)

### 3. **Redux Store** (`src/store/slices/`)
```
store/slices/
├── authSlice.ts          # Auth state (already exists)
├── userSlice.ts          # User state (already exists)
└── employeeSlice.ts      # Employee state (NEW)
```

**Files to create:**
- `employeeSlice.ts` - Redux slice for employee state management

### 4. **Components** (`src/components/`)
```
components/
├── common/               # Shared components (already exists)
├── features/
│   └── employee/         # Employee feature components (NEW)
│       ├── EmployeeList.tsx
│       ├── EmployeeCard.tsx
│       ├── EmployeeTable.tsx
│       ├── EmployeeFilters.tsx
│       ├── EmployeeDetails.tsx
│       └── index.ts
├── forms/
│   ├── LoginForm.tsx     # (already exists)
│   ├── RegisterForm.tsx  # (already exists)
│   ├── UserForm.tsx      # (already exists)
│   └── EmployeeForm.tsx  # (NEW)
└── layout/               # (already exists)
```

**Files to create:**
- `components/features/employee/EmployeeList.tsx` - List view component
- `components/features/employee/EmployeeCard.tsx` - Card view for employee
- `components/features/employee/EmployeeTable.tsx` - Table view component
- `components/features/employee/EmployeeFilters.tsx` - Filter/search component
- `components/features/employee/EmployeeDetails.tsx` - Detail view component
- `components/features/employee/index.ts` - Barrel export
- `components/forms/EmployeeForm.tsx` - Create/Edit form component
  - ✅ **Follow existing form pattern** (UserForm, LoginForm, RegisterForm)
  - Use `react-hook-form` + `zod` + `MuiInput` + `MuiButton`
  - Export from `components/forms/index.ts`

### 5. **Pages** (`src/pages/`)
```
pages/
├── HomePage.tsx          # (already exists)
├── AboutPage.tsx         # (already exists)
├── LoginPage.tsx         # (already exists)
├── RegisterPage.tsx     # (already exists)
├── EmployeesPage.tsx    # (NEW) - Main employees listing page
├── EmployeeCreatePage.tsx # (NEW) - Create employee page
├── EmployeeEditPage.tsx  # (NEW) - Edit employee page
└── EmployeeDetailPage.tsx # (NEW) - Employee detail page
```

**Files to create:**
- `pages/EmployeesPage.tsx` - Main employees listing with filters
- `pages/EmployeeCreatePage.tsx` - Create new employee
- `pages/EmployeeEditPage.tsx` - Edit existing employee
- `pages/EmployeeDetailPage.tsx` - View employee details with all related data

### 6. **Routes** (`src/routes/`)
```
routes/
└── index.tsx             # Update to include employee routes
```

**Files to update:**
- `routes/index.tsx` - Add employee routes

### 7. **Configuration** (`src/config/`)
```
config/
├── constants.ts          # Update API_ENDPOINTS (already exists)
└── navigation.ts         # Update navigation items (already exists)
```

**Files to update:**
- `config/constants.ts` - Add employee API endpoints
- `config/navigation.ts` - Add employee navigation items

## Detailed File Structure

### Complete Structure Overview
```
frontend/src/
│
├── types/
│   ├── index.ts                    # Common types
│   ├── models.ts                   # Domain models (update with Employee)
│   └── employee.ts                 # ✨ NEW - Employee types
│
├── services/
│   ├── api.ts                      # Base API client
│   ├── userService.ts              # User service
│   └── employeeService.ts          # ✨ NEW - Employee service
│
├── store/
│   └── slices/
│       ├── authSlice.ts            # Auth state
│       ├── userSlice.ts            # User state
│       └── employeeSlice.ts        # ✨ NEW - Employee state
│
├── components/
│   ├── common/                     # Shared components
│   ├── features/
│   │   └── employee/               # ✨ NEW - Employee feature components
│   │       ├── EmployeeList.tsx
│   │       ├── EmployeeCard.tsx
│   │       ├── EmployeeTable.tsx
│   │       ├── EmployeeFilters.tsx
│   │       ├── EmployeeDetails.tsx
│   │       └── index.ts
│   ├── forms/
│   │   └── EmployeeForm.tsx        # ✨ NEW - Employee form
│   └── layout/                     # Layout components
│
├── pages/
│   ├── EmployeesPage.tsx           # ✨ NEW - Employees listing
│   ├── EmployeeCreatePage.tsx      # ✨ NEW - Create employee
│   ├── EmployeeEditPage.tsx        # ✨ NEW - Edit employee
│   └── EmployeeDetailPage.tsx      # ✨ NEW - Employee details
│
├── routes/
│   └── index.tsx                   # 🔄 UPDATE - Add employee routes
│
└── config/
    ├── constants.ts                # 🔄 UPDATE - Add employee endpoints
    └── navigation.ts               # 🔄 UPDATE - Add employee nav items
```

## Backend API Endpoints Reference

Based on the backend analysis, the employee endpoints are:

```
POST   /api/v1/employees              - Create employee
GET    /api/v1/employees              - Get all employees (with pagination & filters)
GET    /api/v1/employees/:id         - Get employee by ID
GET    /api/v1/employees/:id/details - Get employee with all related data
PUT    /api/v1/employees/:id         - Update employee
DELETE /api/v1/employees/:id         - Delete employee (soft delete)
```

**Query Parameters for GET /api/v1/employees:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (active, inactive, terminated)
- `search` - Search by name or employee code

## Implementation Priority

### Phase 1: Foundation (Core Setup)
1. ✅ Types & Interfaces (`types/employee.ts`)
2. ✅ Service Layer (`services/employeeService.ts`)
3. ✅ Redux Slice (`store/slices/employeeSlice.ts`)
4. ✅ Update Constants (`config/constants.ts`)

### Phase 2: UI Components
5. ✅ Employee Form (`components/forms/EmployeeForm.tsx`)
   - Follow existing form component pattern (UserForm, LoginForm)
   - Use react-hook-form + zod + MuiInput + MuiButton
   - Export from `components/forms/index.ts`
6. ✅ Employee List Components (`components/features/employee/`)
7. ✅ Employee Detail Component

### Phase 3: Pages & Routing
8. ✅ Employee Pages (`pages/`)
9. ✅ Update Routes (`routes/index.tsx`)
10. ✅ Update Navigation (`config/navigation.ts`)

## Existing Form Component Pattern

### ✅ Form Components Already Established

The frontend already has a **consistent form component pattern** that should be followed:

**Existing Form Components:**
- `components/forms/LoginForm.tsx` - Simple form with email/password
- `components/forms/RegisterForm.tsx` - Registration form
- `components/forms/UserForm.tsx` - Complex form with multiple field types

**Common Pattern Used:**
```typescript
// 1. Define zod schema for validation
const schema = z.object({ ... });

// 2. Use react-hook-form with zodResolver
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... }
});

// 3. Use MuiInput and MuiButton from components/common
<MuiInput {...register('field')} error={errors.field?.message} />
<MuiButton type="submit" isLoading={isSubmitting}>Submit</MuiButton>
```

**EmployeeForm.tsx should:**
- ✅ Follow the same pattern as `UserForm.tsx` (most similar - has multiple fields)
- ✅ Use `react-hook-form` + `zod` + `MuiInput` + `MuiButton`
- ✅ Accept `defaultValues` and `onSubmit` props
- ✅ Handle date fields, select dropdowns, and text inputs
- ✅ Export from `components/forms/index.ts`

## Key Considerations

### 1. **State Management**
- Use Redux for global employee state (list, current employee, filters)
- Use local state for form data and UI-specific state

### 2. **Form Handling**
- ✅ **Form components already exist** - Follow the established pattern from:
  - `LoginForm.tsx` - Uses react-hook-form + zod + MuiInput + MuiButton
  - `RegisterForm.tsx` - Same pattern
  - `UserForm.tsx` - Same pattern with more complex fields
- `EmployeeForm.tsx` should follow the **exact same pattern**:
  - Use `react-hook-form` with `zodResolver` and `zod` schema
  - Use `MuiInput` and `MuiButton` from `components/common`
  - Accept `defaultValues` and `onSubmit` props (like UserForm)
  - Handle form state, validation, and errors consistently
- Match backend validation schema from `employee.validator.ts`

### 3. **Data Fetching**
- Use Redux async thunks for API calls
- Implement loading and error states
- Handle pagination properly

### 4. **Component Organization**
- Feature-based organization in `components/features/employee/`
- Reusable components in `components/common/`
- Form components in `components/forms/`

### 5. **Type Safety**
- Create TypeScript interfaces matching backend models
- Use proper typing for API responses
- Type all component props

### 6. **Related Features**
The backend has related models that may need frontend implementation:
- EmployeeContact
- EmployeeDocument
- EmployeeCompensation
- EmployeeAllowance
- EmployeeDeduction
- EmployeeLeaveEntitlement
- EmployeeCertification
- EmployeeQualification
- EmployeeWorkPass

These can be implemented as sub-features or tabs within the employee detail page.

## Next Steps

1. Review this structure
2. Start with Phase 1 (Foundation)
3. Implement Phase 2 (UI Components)
4. Complete Phase 3 (Pages & Routing)
5. Test integration with backend
6. Add related features as needed

