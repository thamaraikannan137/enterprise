# Employee Data Capture Analysis

## Overview
This document analyzes all employee-related database tables and compares them with what's currently being captured in the frontend employee creation form.

## Database Tables (Employee-Related)

### 1. ✅ Employee (Main Table) - PARTIALLY CAPTURED

**Currently Captured:**
- ✅ first_name
- ✅ middle_name
- ✅ last_name
- ✅ date_of_birth
- ✅ gender
- ✅ nationality
- ✅ marital_status
- ✅ profile_photo_path
- ✅ status
- ✅ designation (NEW - just added)
- ✅ department (NEW - just added)
- ✅ reporting_to (NEW - just added)
- ✅ hire_date
- ✅ termination_date

**Auto-generated (Not in form):**
- employee_code (auto-generated)
- created_by (from auth)
- createdAt/updatedAt (timestamps)

**Status:** ✅ **COMPLETE** - All required fields captured

---

### 2. ❌ EmployeeContact - NOT CAPTURED

**Table Fields:**
- employee_id (reference)
- contact_type: 'primary' | 'secondary' | 'emergency' ⚠️
- phone ⚠️
- alternate_phone
- email ⚠️
- address_line1 ⚠️
- address_line2
- city ⚠️
- postal_code ⚠️
- country ⚠️
- is_current (default: true)
- valid_from ⚠️
- valid_to

**Missing Fields:** 13 fields
**Priority:** 🔴 **HIGH** - Contact information is essential

**Recommendation:** Add "Contact Information" tab

---

### 3. ❌ EmployeeCompensation - NOT CAPTURED

**Table Fields:**
- employee_id (reference)
- basic_salary ⚠️ **REQUIRED**
- ot_hourly_rate
- effective_from ⚠️ **REQUIRED**
- effective_to
- is_current (default: true)
- approved_by (reference to User)
- approved_at

**Missing Fields:** 8 fields
**Priority:** 🟡 **MEDIUM** - Can be added after employee creation

**Recommendation:** Add "Compensation" tab or separate form

---

### 4. ❌ EmployeeDocument - NOT CAPTURED

**Table Fields:**
- employee_id (reference)
- document_type: 'passport' | 'certificate' | 'work_pass' | 'qualification' | 'other' ⚠️
- document_name ⚠️ **REQUIRED**
- file_path ⚠️ **REQUIRED**
- issue_date
- expiry_date
- is_active (default: true)
- uploaded_at (auto)

**Missing Fields:** 8 fields
**Priority:** 🟡 **MEDIUM** - Documents can be uploaded later

**Recommendation:** Add "Documents" tab with file upload

---

### 5. ❌ EmployeeAllowance - NOT CAPTURED

**Table Fields:**
- employee_id (reference)
- allowance_type_id (reference to AllowanceType) ⚠️
- amount ⚠️ **REQUIRED**
- effective_from ⚠️ **REQUIRED**
- effective_to
- is_active (default: true)

**Missing Fields:** 6 fields
**Priority:** 🟢 **LOW** - Can be added after employee creation

**Recommendation:** Add to "Compensation" tab or separate form

---

### 6. ❌ EmployeeDeduction - NOT CAPTURED

**Table Fields:**
- employee_id (reference)
- deduction_type_id (reference to DeductionType) ⚠️
- amount ⚠️ **REQUIRED**
- effective_from ⚠️ **REQUIRED**
- effective_to
- is_active (default: true)

**Missing Fields:** 6 fields
**Priority:** 🟢 **LOW** - Can be added after employee creation

**Recommendation:** Add to "Compensation" tab or separate form

---

### 7. ❌ EmployeeCertification - NOT CAPTURED

**Table Fields:**
- employee_id (reference)
- certification_name ⚠️ **REQUIRED**
- certification_type: 'new' | 'renewal' ⚠️
- issue_date ⚠️ **REQUIRED**
- expiry_date
- ownership: 'company' | 'employee' ⚠️
- document_id (reference to EmployeeDocument)
- is_active (default: true)
- reminder_sent (default: false)

**Missing Fields:** 9 fields
**Priority:** 🟡 **MEDIUM** - Can be added after employee creation

**Recommendation:** Add "Certifications" tab

---

### 8. ❌ EmployeeQualification - NOT CAPTURED

**Table Fields:**
- employee_id (reference)
- degree ⚠️ **REQUIRED**
- major
- institution ⚠️ **REQUIRED**
- completion_year ⚠️ **REQUIRED**
- document_id (reference to EmployeeDocument)
- verification_status: 'pending' | 'verified' | 'rejected' (default: 'pending')

**Missing Fields:** 7 fields
**Priority:** 🟡 **MEDIUM** - Can be added after employee creation

**Recommendation:** Add "Qualifications" tab

---

### 9. ❌ EmployeeWorkPass - NOT CAPTURED

**Table Fields:**
- employee_id (reference)
- status: 'new' | 'renewal' | 'cancelled' ⚠️
- work_permit_number (unique)
- fin_number (unique)
- application_date
- issuance_date
- expiry_date
- medical_date
- is_current (default: true)

**Missing Fields:** 9 fields
**Priority:** 🟡 **MEDIUM** - Important for work authorization

**Recommendation:** Add "Work Pass" tab

---

### 10. ❌ EmployeeLeaveEntitlement - NOT CAPTURED

**Table Fields:**
- employee_id (reference)
- leave_type_id (reference to LeaveType) ⚠️
- entitled_days ⚠️ **REQUIRED**
- used_days (default: 0)
- remaining_days ⚠️ **REQUIRED**
- year ⚠️ **REQUIRED**

**Missing Fields:** 6 fields
**Priority:** 🟢 **LOW** - Usually auto-calculated or set later

**Recommendation:** Can be auto-generated or set in separate form

---

## Summary

### Current Status

| Table | Fields | Captured | Missing | Priority |
|-------|--------|----------|---------|----------|
| **Employee** | 14 | 14 | 0 | ✅ Complete |
| **EmployeeContact** | 13 | 0 | 13 | 🔴 HIGH |
| **EmployeeCompensation** | 8 | 0 | 8 | 🟡 MEDIUM |
| **EmployeeDocument** | 8 | 0 | 8 | 🟡 MEDIUM |
| **EmployeeAllowance** | 6 | 0 | 6 | 🟢 LOW |
| **EmployeeDeduction** | 6 | 0 | 6 | 🟢 LOW |
| **EmployeeCertification** | 9 | 0 | 9 | 🟡 MEDIUM |
| **EmployeeQualification** | 7 | 0 | 7 | 🟡 MEDIUM |
| **EmployeeWorkPass** | 9 | 0 | 9 | 🟡 MEDIUM |
| **EmployeeLeaveEntitlement** | 6 | 0 | 6 | 🟢 LOW |
| **TOTAL** | **86** | **14** | **72** | |

### Capture Rate: 16.3% (14 out of 86 fields)

---

## Recommended Implementation Plan

### Phase 1: Essential Data (HIGH Priority) 🔴

**Tab 3: Contact Information**
- Contact type (primary/secondary/emergency)
- Phone, Alternate Phone
- Email
- Address (Line 1, Line 2, City, Postal Code, Country)
- Valid from/To dates
- Is current address

**Why:** Contact information is essential for employee communication and records.

---

### Phase 2: Important Data (MEDIUM Priority) 🟡

**Tab 4: Compensation**
- Basic Salary (REQUIRED)
- OT Hourly Rate
- Effective dates
- Allowances (multiple)
- Deductions (multiple)

**Tab 5: Documents**
- Document upload
- Document type selection
- Issue/Expiry dates
- Multiple documents support

**Tab 6: Work Authorization**
- Work Pass information
- Work permit number
- FIN number
- Application/Issuance/Expiry dates
- Medical date

**Tab 7: Qualifications & Certifications**
- Educational qualifications
- Professional certifications
- Issue/Expiry dates
- Document references

**Why:** These are important for payroll, compliance, and employee records.

---

### Phase 3: Additional Data (LOW Priority) 🟢

**Tab 8: Leave Management**
- Leave entitlements
- Leave types
- Year-based tracking

**Why:** Can be auto-calculated or set up after employee creation.

---

## Proposed Enhanced Form Structure

```
EmployeeCreateForm
├── Tab 1: Personal Information ✅ (Current)
├── Tab 2: Job Information ✅ (Current)
├── Tab 3: Contact Information ⚠️ (NEW - HIGH Priority)
├── Tab 4: Compensation ⚠️ (NEW - MEDIUM Priority)
├── Tab 5: Documents ⚠️ (NEW - MEDIUM Priority)
├── Tab 6: Work Pass ⚠️ (NEW - MEDIUM Priority)
├── Tab 7: Qualifications & Certifications ⚠️ (NEW - MEDIUM Priority)
└── Tab 8: Leave Entitlements ⚠️ (NEW - LOW Priority)
```

---

## Implementation Strategy

### Option A: All-in-One Form (Recommended for MVP)
- Single form with all tabs
- User can skip optional tabs
- Submit all data at once
- **Pros:** Complete data capture, better UX
- **Cons:** Longer form, more complex

### Option B: Multi-Step Wizard
- Step 1: Basic Info (Personal + Job) ✅ Current
- Step 2: Contact Information
- Step 3: Compensation
- Step 4: Documents & Work Pass
- Step 5: Qualifications
- **Pros:** Less overwhelming, can save progress
- **Cons:** Multiple API calls, state management

### Option C: Create + Edit Flow
- Create employee with basic info (current)
- Redirect to profile page
- Add related data through edit forms
- **Pros:** Simpler initial form, flexible
- **Cons:** Multiple steps, data entry spread out

---

## API Considerations

### Current API
- ✅ POST /api/v1/employees (creates employee only)

### Needed APIs
- ⚠️ POST /api/v1/employees/:id/contacts (create contact)
- ⚠️ POST /api/v1/employees/:id/compensation (create compensation)
- ⚠️ POST /api/v1/employees/:id/documents (upload document)
- ⚠️ POST /api/v1/employees/:id/allowances (create allowance)
- ⚠️ POST /api/v1/employees/:id/deductions (create deduction)
- ⚠️ POST /api/v1/employees/:id/certifications (create certification)
- ⚠️ POST /api/v1/employees/:id/qualifications (create qualification)
- ⚠️ POST /api/v1/employees/:id/workpasses (create work pass)
- ⚠️ POST /api/v1/employees/:id/leave-entitlements (create leave entitlement)

### Alternative: Bulk Create API
- ⚠️ POST /api/v1/employees/create-with-details
- Accepts employee + all related data
- Creates everything in one transaction
- **Pros:** Single API call, atomic operation
- **Cons:** Complex payload, large request

---

## Priority Action Items

### Immediate (Week 1)
1. ✅ Add Contact Information tab
2. ✅ Create contact form fields
3. ✅ Add contact API integration

### Short-term (Week 2-3)
4. ⚠️ Add Compensation tab
5. ⚠️ Add Documents tab with file upload
6. ⚠️ Add Work Pass tab

### Medium-term (Week 4+)
7. ⚠️ Add Qualifications & Certifications tab
8. ⚠️ Add Leave Entitlements (if needed)
9. ⚠️ Add Allowances/Deductions management

---

## Data Flow Recommendation

### Recommended Approach: Hybrid

1. **Required on Creation:**
   - Employee (Personal + Job) ✅
   - Contact Information (at least primary) ⚠️

2. **Optional on Creation:**
   - Compensation
   - Documents
   - Work Pass
   - Qualifications
   - Certifications

3. **Can be Added Later:**
   - Allowances/Deductions
   - Leave Entitlements
   - Additional contacts
   - Additional documents

---

## Next Steps

1. **Review this analysis** with stakeholders
2. **Prioritize** which tabs to implement first
3. **Design** the form structure and UX
4. **Implement** Phase 1 (Contact Information)
5. **Test** and iterate

---

**Status:** Analysis Complete
**Date:** Analysis completed
**Recommendation:** Start with Contact Information tab (HIGH priority)


