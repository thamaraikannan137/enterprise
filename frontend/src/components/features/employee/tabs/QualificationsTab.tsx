import { useState, useEffect } from 'react';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Add, Delete } from '@mui/icons-material';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { employeeRelatedService } from '../../../../services/employeeRelatedService';
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
  const [qualifications, setQualifications] = useState<EmployeeQualification[]>([]);
  const [certifications, setCertifications] = useState<EmployeeCertification[]>([]);
  const [loading, setLoading] = useState(false);
  const [newQualification, setNewQualification] = useState<CreateEmployeeQualificationInput>({
    employee_id: employee.id,
    degree: '',
    institution: '',
    completion_year: new Date().getFullYear(),
    verification_status: 'pending',
  });
  const [newCertification, setNewCertification] = useState<CreateEmployeeCertificationInput>({
    employee_id: employee.id,
    certification_name: '',
    certification_type: 'new',
    issue_date: new Date().toISOString().split('T')[0],
    ownership: 'employee',
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, [employee.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [quals, certs] = await Promise.all([
        employeeRelatedService.getEmployeeQualifications(employee.id),
        employeeRelatedService.getEmployeeCertifications(employee.id),
      ]);
      setQualifications(quals);
      setCertifications(certs);
    } catch (error) {
      console.error('Failed to load qualifications/certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQualification = async () => {
    if (!newQualification.degree || !newQualification.institution || !newQualification.completion_year) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await employeeRelatedService.createQualification(newQualification);
      await loadData();
      setNewQualification({
        employee_id: employee.id,
        degree: '',
        institution: '',
        completion_year: new Date().getFullYear(),
        verification_status: 'pending',
      });
    } catch (error) {
      console.error('Failed to create qualification:', error);
    }
  };

  const handleAddCertification = async () => {
    if (!newCertification.certification_name || !newCertification.issue_date) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await employeeRelatedService.createCertification(newCertification);
      await loadData();
      setNewCertification({
        employee_id: employee.id,
        certification_name: '',
        certification_type: 'new',
        issue_date: new Date().toISOString().split('T')[0],
        ownership: 'employee',
        is_active: true,
      });
    } catch (error) {
      console.error('Failed to create certification:', error);
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
                    <TableCell>{qual.major || 'N/A'}</TableCell>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={newQualification.degree}
                  onChange={(e) => setNewQualification({ ...newQualification, degree: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Major (optional)"
                  value={newQualification.major || ''}
                  onChange={(e) => setNewQualification({ ...newQualification, major: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={newQualification.institution}
                  onChange={(e) => setNewQualification({ ...newQualification, institution: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12}>
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
                      {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : 'N/A'}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Certification Name"
                  value={newCertification.certification_name}
                  onChange={(e) => setNewCertification({ ...newCertification, certification_name: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12}>
                <MuiButton
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddCertification}
                >
                  Add Certification
                </MuiButton>
              </Grid>
            </Grid>
          </div>
        )}
      </MuiCard>
    </div>
  );
};


