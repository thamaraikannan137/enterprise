# Files to Remove After Employee Data Consolidation

## Models to Remove

These models will be consolidated into the Employee model:

1. **`src/models/EmployeeContact.ts`** - Contact information (emails, phones, addresses)
2. **`src/models/EmployeeAddress.ts`** - Address details (current/permanent)
3. **`src/models/EmployeeFamily.ts`** - Family details (father, mother, spouse, kids)
4. **`src/models/EmployeeExperience.ts`** - Previous work experience
5. **`src/models/EmployeeEducationDetail.ts`** - Education details (PG, Graduation, Inter/12th)
6. **`src/models/EmployeeIdentity.ts`** - Identity documents (Aadhar, PAN, Passport, etc.)
7. **`src/models/EmployeeSkills.ts`** - Skills, languages, hobbies, interests

## Controllers to Remove

1. **`src/controllers/employeeContact.controller.ts`** - Contact CRUD operations

**Note:** There are NO separate controllers for:
- EmployeeAddress
- EmployeeFamily
- EmployeeExperience
- EmployeeEducationDetail
- EmployeeIdentity
- EmployeeSkills

These were likely accessed through the employee controller or not exposed via API.

## Services to Remove

1. **`src/services/employeeContactService.ts`** - Contact service operations

**Note:** There are NO separate services for:
- EmployeeAddress
- EmployeeFamily
- EmployeeExperience
- EmployeeEducationDetail
- EmployeeIdentity
- EmployeeSkills

## Routes to Remove

1. **`src/routes/v1/employeeContact.routes.ts`** - Contact API routes

**Note:** There are NO separate routes for:
- EmployeeAddress
- EmployeeFamily
- EmployeeExperience
- EmployeeEducationDetail
- EmployeeIdentity
- EmployeeSkills

## Files to Update (Not Remove)

### Backend Files to Update:

1. **`src/models/HRModels.index.ts`**
   - Remove exports for: EmployeeContact, EmployeeAddress, EmployeeFamily, EmployeeExperience, EmployeeEducationDetail, EmployeeIdentity, EmployeeSkills

2. **`src/models/index.ts`**
   - Remove exports for: EmployeeContact, EmployeeAddress, EmployeeFamily, EmployeeExperience, EmployeeEducationDetail, EmployeeIdentity, EmployeeSkills

3. **`src/models/Employee.ts`**
   - **UPDATE** - Add all consolidated fields from the 7 models above

4. **`src/services/employeeService.ts`**
   - **UPDATE** - Remove imports and usage of EmployeeContact
   - **UPDATE** - Remove the EmployeeContact.find() call in getEmployeeWithDetails()
   - **UPDATE** - Simplify getEmployeeWithDetails() since all data will be in Employee model

5. **`src/routes/v1/index.ts`**
   - **UPDATE** - Remove: `import employeeContactRoutes from './employeeContact.routes.ts';`
   - **UPDATE** - Remove: `router.use('/employee-contacts', employeeContactRoutes);`

### Frontend Files to Update:

1. **`src/types/employee.ts`**
   - **UPDATE** - Add all consolidated fields to Employee type

2. **`src/types/employeeRelated.ts`**
   - **UPDATE** - Remove or update EmployeeContact, EmployeeAddress, EmployeeFamily, etc. types

3. **`src/services/employeeRelatedService.ts`**
   - **UPDATE** - Remove contact-related API calls
   - **UPDATE** - Update to use single employee endpoint

4. **`src/services/employeeService.ts`**
   - **UPDATE** - Ensure all fields are sent/received in single employee object

5. **`src/components/features/employee/tabs/ContactTab.tsx`**
   - **UPDATE** - Read/write contact data from employee object instead of separate API

6. **`src/components/features/employee/tabs/sections/ContactDetailsSection.tsx`**
   - **UPDATE** - Update to use employee object fields

7. **`src/components/features/employee/tabs/sections/AddressesSection.tsx`**
   - **UPDATE** - Update to use employee object fields

8. **`src/components/forms/EmployeeCreateForm.tsx`**
   - **UPDATE** - Add all new fields to form

9. **`src/components/forms/EmployeeForm.tsx`**
   - **UPDATE** - Add all new fields to form

## Summary

### Files to DELETE (8 files):
- `src/models/EmployeeContact.ts`
- `src/models/EmployeeAddress.ts`
- `src/models/EmployeeFamily.ts`
- `src/models/EmployeeExperience.ts`
- `src/models/EmployeeEducationDetail.ts`
- `src/models/EmployeeIdentity.ts`
- `src/models/EmployeeSkills.ts`
- `src/controllers/employeeContact.controller.ts`
- `src/services/employeeContactService.ts`
- `src/routes/v1/employeeContact.routes.ts`

### Files to UPDATE (11+ files):
- `src/models/HRModels.index.ts`
- `src/models/index.ts`
- `src/models/Employee.ts` ⭐ (Major update)
- `src/services/employeeService.ts` ⭐ (Major update)
- `src/routes/v1/index.ts`
- `src/types/employee.ts` ⭐ (Frontend - Major update)
- `src/types/employeeRelated.ts` (Frontend)
- `src/services/employeeRelatedService.ts` (Frontend)
- `src/services/employeeService.ts` (Frontend)
- `src/components/features/employee/tabs/ContactTab.tsx` (Frontend)
- `src/components/features/employee/tabs/sections/ContactDetailsSection.tsx` (Frontend)
- `src/components/features/employee/tabs/sections/AddressesSection.tsx` (Frontend)
- `src/components/forms/EmployeeCreateForm.tsx` (Frontend)
- `src/components/forms/EmployeeForm.tsx` (Frontend)

## Models to KEEP (Not Removing)

These models remain separate as they represent distinct entities:
- ✅ `Employee` - Main employee model (will be updated)
- ✅ `EmployeeDocument` - Document attachments
- ✅ `EmployeeCompensation` - Compensation details
- ✅ `EmployeeAllowance` - Allowances
- ✅ `EmployeeDeduction` - Deductions
- ✅ `EmployeeLeaveEntitlement` - Leave entitlements
- ✅ `EmployeeCertification` - Certifications (separate from skills)
- ✅ `EmployeeQualification` - Qualifications (separate from education details)
- ✅ `EmployeeWorkPass` - Work pass details





