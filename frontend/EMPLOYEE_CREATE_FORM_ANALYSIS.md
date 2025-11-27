# Employee Create Form Analysis

## Current State

### Existing Form (`EmployeeForm.tsx`)
**Current Fields:**
- ✅ First Name
- ✅ Middle Name (optional)
- ✅ Last Name
- ✅ Date of Birth
- ✅ Gender
- ✅ Nationality
- ✅ Marital Status
- ✅ Hire Date
- ✅ Termination Date (optional)
- ✅ Profile Photo Path (optional)
- ✅ Status (edit mode only)

**Missing Fields (Required by Backend):**
- ❌ **Designation** (REQUIRED)
- ❌ **Department** (REQUIRED)
- ❌ **Reporting To** (optional - manager selection)

### Current Form Structure
- Single page form
- All fields in one grid layout
- No tabs or sections
- Basic validation

## Backend Database Requirements

### Core Employee Fields (Required for Creation)
Based on `Employee.ts` model:

1. **Personal Information** ✅ (Mostly captured)
   - first_name ✅
   - middle_name ✅ (optional)
   - last_name ✅
   - date_of_birth ✅
   - gender ✅
   - nationality ✅
   - marital_status ✅
   - profile_photo_path ✅ (optional)

2. **Job Information** ❌ (MISSING)
   - designation ❌ **REQUIRED**
   - department ❌ **REQUIRED**
   - reporting_to ❌ (optional - ObjectId reference)
   - hire_date ✅
   - termination_date ✅ (optional)
   - status ✅ (defaults to 'active')

3. **Auto-generated Fields** (Not in form)
   - employee_code (auto-generated)
   - created_by (from auth)
   - createdAt/updatedAt (timestamps)

### Related Data Models (Can be added later or during creation)

4. **Contact Information** (EmployeeContact model)
   - contact_type (primary/secondary/emergency)
   - phone
   - alternate_phone
   - email
   - address_line1, address_line2
   - city, postal_code, country
   - is_current
   - valid_from, valid_to

5. **Documents** (EmployeeDocument model)
   - document_type
   - document_path
   - issue_date, expiry_date
   - etc.

6. **Compensation** (EmployeeCompensation model)
   - salary, currency
   - effective_date
   - etc.

7. **Other Related Data**
   - Allowances
   - Deductions
   - Leave Entitlements
   - Certifications
   - Qualifications
   - Work Passes

## Proposed Tabbed Form Structure

Similar to the Employee Profile page, organize the form into logical tabs:

### Tab 1: Personal Information
**Fields:**
- First Name *
- Middle Name
- Last Name *
- Date of Birth *
- Gender *
- Nationality *
- Marital Status *
- Profile Photo (upload/URL) *

### Tab 2: Job Information ⚠️ NEW
**Fields:**
- Designation * (REQUIRED - missing)
- Department * (REQUIRED - missing)
- Reporting To (dropdown - select manager) (REQUIRED - missing)
- Hire Date *
- Termination Date
- Status (default: active)

### Tab 3: Contact Information (Optional - for future)
**Fields:**
- Contact Type (primary/secondary/emergency)
- Phone
- Alternate Phone
- Email
- Address Line 1
- Address Line 2
- City
- Postal Code
- Country
- Is Current Address
- Valid From
- Valid To

### Tab 4: Documents (Optional - for future)
- Upload documents
- Document type selection
- Issue/Expiry dates

### Tab 5: Compensation (Optional - for future)
- Salary information
- Currency
- Effective dates

## Implementation Plan

### Phase 1: Core Requirements (IMMEDIATE)
**Priority: HIGH - Required for form to work**

1. **Update TypeScript Types**
   - Add `designation`, `department`, `reporting_to` to `CreateEmployeeInput`
   - Add `reportingToEmployee` to `Employee` interface

2. **Update Form Schema**
   - Add validation for designation (required, max 100 chars)
   - Add validation for department (required, max 100 chars)
   - Add validation for reporting_to (optional, valid ObjectId)

3. **Create Tabbed Form Component**
   - Tab 1: Personal Information (existing fields)
   - Tab 2: Job Information (new fields + existing hire_date, termination_date)
   - Form state management across tabs
   - Validation per tab
   - Progress indicator

4. **Add Reporting To Selector**
   - Fetch list of employees for dropdown
   - Display: "Name (Designation) - Employee Code"
   - Filter out current employee (if editing)
   - Show "No Manager" option

5. **Update Employee Service**
   - Ensure API calls include new fields

### Phase 2: Enhanced Features (FUTURE)
**Priority: MEDIUM - Nice to have**

1. **Tab 3: Contact Information**
   - Add contact form section
   - Multiple contacts support
   - Address management

2. **Tab 4: Documents**
   - File upload component
   - Document type selection
   - Document management

3. **Tab 5: Compensation**
   - Salary information
   - Allowances/Deductions

## Detailed Field Requirements

### Job Information Tab (NEW - REQUIRED)

#### Designation
- **Type:** Text Input
- **Required:** Yes
- **Max Length:** 100 characters
- **Validation:** Required, non-empty string
- **Examples:** "Lead Engineer", "Senior Developer", "HR Manager"
- **UI:** Text input with autocomplete suggestions (optional)

#### Department
- **Type:** Text Input or Select
- **Required:** Yes
- **Max Length:** 100 characters
- **Validation:** Required, non-empty string
- **Examples:** "Engineering", "HR", "Finance", "Sales"
- **UI Options:**
  - Option A: Text input (flexible, allows any department)
  - Option B: Select dropdown (standardized departments)
  - **Recommendation:** Start with text input, can add select later

#### Reporting To
- **Type:** Select Dropdown
- **Required:** No (optional)
- **Validation:** Must be valid employee ID if provided
- **UI Requirements:**
  - Fetch list of active employees
  - Display format: "First Last (Designation) - EMP0001"
  - Include "None" or "No Manager" option
  - Search/filter capability (if many employees)
  - Show employee hierarchy (optional - advanced)
- **API:** Need endpoint to fetch employees for dropdown
  - GET /api/v1/employees?status=active&limit=100
  - Or: GET /api/v1/employees/managers (if specific endpoint)

#### Hire Date
- **Type:** Date Picker
- **Required:** Yes
- **Already exists:** ✅

#### Termination Date
- **Type:** Date Picker
- **Required:** No
- **Already exists:** ✅

#### Status
- **Type:** Select Dropdown
- **Required:** Yes (defaults to 'active')
- **Options:** active, inactive, terminated
- **Default:** active
- **Already exists:** ✅ (only in edit mode currently)

## Form Flow

### Step-by-Step User Experience

1. **Tab 1: Personal Information**
   - User fills personal details
   - "Next" button validates and moves to Tab 2
   - Shows validation errors inline

2. **Tab 2: Job Information**
   - User selects/fills job details
   - Reporting To dropdown loads employees
   - "Previous" button to go back
   - "Create Employee" button submits form
   - Shows validation errors inline

3. **Submission**
   - Validates all tabs
   - Shows errors if validation fails
   - Submits to API
   - Redirects to employee profile on success
   - Shows error message on failure

## Component Structure

```
EmployeeCreatePage
└── EmployeeCreateForm (Tabbed Form)
    ├── TabNavigation
    │   ├── PersonalInfoTab (active)
    │   └── JobInfoTab
    ├── FormState (react-hook-form)
    ├── TabContent
    │   ├── PersonalInfoSection
    │   └── JobInfoSection
    └── FormActions
        ├── Previous Button
        ├── Next Button
        └── Submit Button
```

## API Requirements

### Current API
- ✅ POST /api/v1/employees (create employee)

### Additional API Needed
- ⚠️ GET /api/v1/employees?status=active&limit=100 (for Reporting To dropdown)
  - Or create: GET /api/v1/employees/managers
  - Should return: id, first_name, last_name, designation, employee_code

## Validation Rules

### Designation
- ✅ Required
- ✅ String
- ✅ Max 100 characters
- ✅ Trimmed

### Department
- ✅ Required
- ✅ String
- ✅ Max 100 characters
- ✅ Trimmed

### Reporting To
- ✅ Optional (can be null/empty)
- ✅ If provided, must be valid employee ID
- ✅ Cannot be self (if editing)
- ✅ Should prevent circular chains (backend handles this)

## UI/UX Considerations

1. **Tab Navigation**
   - Visual indicator of current tab
   - Progress indicator (1 of 2, 2 of 2)
   - Disable tabs until previous is valid (optional)

2. **Form Validation**
   - Real-time validation
   - Show errors on tab switch
   - Prevent moving to next tab if current tab has errors
   - Highlight required fields

3. **Reporting To Dropdown**
   - Search/filter functionality
   - Loading state while fetching
   - Empty state message
   - Group by department (optional enhancement)

4. **Responsive Design**
   - Mobile-friendly tabs
   - Stack form fields on small screens
   - Touch-friendly controls

## Files to Create/Modify

### New Files
1. `src/components/forms/EmployeeCreateForm.tsx` - Main tabbed form
2. `src/components/forms/tabs/PersonalInfoTab.tsx` - Personal info section
3. `src/components/forms/tabs/JobInfoTab.tsx` - Job info section
4. `src/hooks/useEmployeeList.ts` - Hook to fetch employees for dropdown

### Files to Modify
1. `src/types/employee.ts` - Add new fields to types
2. `src/pages/EmployeeCreatePage.tsx` - Use new tabbed form
3. `src/components/forms/EmployeeForm.tsx` - Can be deprecated or refactored
4. `src/services/employeeService.ts` - Ensure includes new fields

## Migration Strategy

### For Existing Form
- Keep `EmployeeForm.tsx` for edit mode (can be updated later)
- Create new `EmployeeCreateForm.tsx` for create mode
- Gradually migrate edit mode to tabbed form if needed

## Testing Checklist

- [ ] All required fields validated
- [ ] Tab navigation works
- [ ] Form state persists across tabs
- [ ] Validation errors show correctly
- [ ] Reporting To dropdown loads employees
- [ ] Can submit with all required fields
- [ ] Can submit without Reporting To (optional)
- [ ] Error handling for API failures
- [ ] Success redirect to profile page
- [ ] Mobile responsive
- [ ] Accessibility (keyboard navigation, screen readers)

## Estimated Implementation Time

- Type updates: 30 minutes
- Tabbed form component: 3-4 hours
- Job Information tab: 2-3 hours
- Reporting To dropdown: 2 hours
- Integration & testing: 2-3 hours
- **Total: 9-12 hours**

## Priority Actions

1. **IMMEDIATE** - Add missing required fields (designation, department, reporting_to)
2. **IMMEDIATE** - Create tabbed form structure
3. **HIGH** - Implement Reporting To employee selector
4. **MEDIUM** - Enhanced validation and UX
5. **LOW** - Additional tabs for contacts/documents (future)

---

**Status:** Analysis Complete - Ready for Implementation
**Next Step:** Create tabbed form component with Job Information tab


