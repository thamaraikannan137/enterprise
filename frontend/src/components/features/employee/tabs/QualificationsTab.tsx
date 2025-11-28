import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Add, Delete, Save, Cancel } from '@mui/icons-material';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { employeeRelatedService } from '../../../../services/employeeRelatedService';
import { useToast } from '../../../../contexts/ToastContext';
import type { EmployeeWithDetails } from '../../../../types/employee';
import type {
  EmployeeQualification,
  CreateEmployeeQualificationInput,
  EmployeeCertification,
  CreateEmployeeCertificationInput,
} from '../../../../types/employeeRelated';

interface QualificationsTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const QualificationsTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: QualificationsTabProps) => {
  const { id: employeeIdFromUrl } = useParams<{ id: string }>();
  const { showSuccess, showError, showWarning } = useToast();
  // Memoize employeeId to prevent unnecessary re-renders
  const employeeId = useMemo(() => employee?.id || employeeIdFromUrl, [employee?.id, employeeIdFromUrl]);
  const [qualifications, setQualifications] = useState<EmployeeQualification[]>([]);
  const [certifications, setCertifications] = useState<EmployeeCertification[]>([]);
  const [loading, setLoading] = useState(false);
  const [newQualification, setNewQualification] = useState<CreateEmployeeQualificationInput>({
    employee_id: employeeId || '',
    degree: '',
    institution: '',
    completion_year: new Date().getFullYear(),
    verification_status: 'pending',
  });
  const [newCertification, setNewCertification] = useState<CreateEmployeeCertificationInput>({
    employee_id: employeeId || '',
    certification_name: '',
    certification_type: 'new',
    issue_date: new Date().toISOString().split('T')[0],
    ownership: 'employee',
    is_active: true,
  });

  // Memoize loadData to prevent recreating on every render
  const loadData = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const [quals, certs] = await Promise.all([
        employeeRelatedService.getEmployeeQualifications(employeeId),
        employeeRelatedService.getEmployeeCertifications(employeeId),
      ]);
      setQualifications(quals);
      setCertifications(certs);
    } catch (error) {
      console.error('Failed to load qualifications/certifications:', error);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const handleAddQualification = async () => {
    if (!employeeId) {
      showError('Error: Employee ID is missing. Please refresh the page and try again.');
      return;
    }
    if (!newQualification.degree || !newQualification.institution || !newQualification.completion_year) {
      showWarning('Please fill in all required fields');
      return;
    }
    try {
      await employeeRelatedService.createQualification({ ...newQualification, employee_id: employeeId });
      await loadData();
      showSuccess('Qualification added successfully!');
      setNewQualification({
        employee_id: employeeId,
        degree: '',
        institution: '',
        completion_year: new Date().getFullYear(),
        verification_status: 'pending',
      });
    } catch (error: any) {
      console.error('Failed to create qualification:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to create qualification. Please try again.';
      showError(errorMessage);
    }
  };

  const handleAddCertification = async () => {
    if (!employeeId) {
      showError('Error: Employee ID is missing. Please refresh the page and try again.');
      return;
    }
    if (!newCertification.certification_name || !newCertification.issue_date) {
      showWarning('Please fill in all required fields');
      return;
    }
    try {
      await employeeRelatedService.createCertification({ ...newCertification, employee_id: employeeId });
      await loadData();
      showSuccess('Certification added successfully!');
      setNewCertification({
        employee_id: employeeId,
        certification_name: '',
        certification_type: 'new',
        issue_date: new Date().toISOString().split('T')[0],
        ownership: 'employee',
        is_active: true,
      });
    } catch (error: any) {
      console.error('Failed to create certification:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to create certification. Please try again.';
      showError(errorMessage);
    }
  };

  const getVerificationStatusColor = (status: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
      verified: 'success',
      pending: 'warning',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Qualifications Section */}
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Educational Qualifications</h3>
          {!isEditMode && (
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => onEditModeChange(true)}
            >
              Edit
            </MuiButton>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading qualifications...</div>
        ) : qualifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No qualifications added yet.
          </div>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Degree</TableCell>
                  <TableCell>Major</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>Completion Year</TableCell>
                  <TableCell>Verification Status</TableCell>
                  {isEditMode && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {qualifications.map((qual) => (
                  <TableRow key={qual.id}>
                    <TableCell>{qual.degree}</TableCell>
                    <TableCell>{qual.major || '-'}</TableCell>
                    <TableCell>{qual.institution}</TableCell>
                    <TableCell>{qual.completion_year}</TableCell>
                    <TableCell>
                      <Chip
                        label={qual.verification_status}
                        color={getVerificationStatusColor(qual.verification_status)}
                        size="small"
                      />
                    </TableCell>
                    {isEditMode && (
                      <TableCell>
                        <MuiButton
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                        >
                          Delete
                        </MuiButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {isEditMode && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Add New Qualification</h4>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={newQualification.degree}
                  onChange={(e) => setNewQualification({ ...newQualification, degree: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Major (optional)"
                  value={newQualification.major || ''}
                  onChange={(e) => setNewQualification({ ...newQualification, major: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={newQualification.institution}
                  onChange={(e) => setNewQualification({ ...newQualification, institution: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Completion Year"
                  type="number"
                  value={newQualification.completion_year}
                  onChange={(e) => setNewQualification({
                    ...newQualification,
                    completion_year: parseInt(e.target.value) || new Date().getFullYear(),
                  })}
                  variant="outlined"
                  inputProps={{ min: 1900, max: new Date().getFullYear() + 10 }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <MuiButton
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddQualification}
                >
                  Add Qualification
                </MuiButton>
              </Grid>
            </Grid>
          </div>
        )}
      </MuiCard>

      {/* Certifications Section */}
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Professional Certifications</h3>
          {!isEditMode && (
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => onEditModeChange(true)}
            >
              Edit
            </MuiButton>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading certifications...</div>
        ) : certifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No certifications added yet.
          </div>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Certification Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Ownership</TableCell>
                  <TableCell>Status</TableCell>
                  {isEditMode && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {certifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>{cert.certification_name}</TableCell>
                    <TableCell>
                      <Chip label={cert.certification_type} size="small" />
                    </TableCell>
                    <TableCell>
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="capitalize">{cert.ownership}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        cert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cert.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    {isEditMode && (
                      <TableCell>
                        <MuiButton
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                        >
                          Delete
                        </MuiButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {isEditMode && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Add New Certification</h4>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Certification Name"
                  value={newCertification.certification_name}
                  onChange={(e) => setNewCertification({ ...newCertification, certification_name: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Certification Type</InputLabel>
                  <Select
                    value={newCertification.certification_type}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      certification_type: e.target.value as any,
                    })}
                    label="Certification Type"
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="renewal">Renewal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Issue Date"
                  type="date"
                  value={newCertification.issue_date}
                  onChange={(e) => setNewCertification({ ...newCertification, issue_date: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Expiry Date (optional)"
                  type="date"
                  value={newCertification.expiry_date || ''}
                  onChange={(e) => setNewCertification({
                    ...newCertification,
                    expiry_date: e.target.value || undefined,
                  })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Ownership</InputLabel>
                  <Select
                    value={newCertification.ownership}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      ownership: e.target.value as any,
                    })}
                    label="Ownership"
                  >
                    <MenuItem value="company">Company</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <div className="flex gap-2">
                  <MuiButton
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddCertification}
                  >
                    Add Certification
                  </MuiButton>
                  <MuiButton
                    variant="outlined"
                    startIcon={<Save />}
                    onClick={() => onEditModeChange(false)}
                  >
                    Done
                  </MuiButton>
                  <MuiButton
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => onEditModeChange(false)}
                  >
                    Cancel
                  </MuiButton>
                </div>
              </Grid>
            </Grid>
          </div>
        )}
      </MuiCard>
    </div>
  );
};


