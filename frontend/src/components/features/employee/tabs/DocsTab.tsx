import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Upload, Delete, Visibility, Save, Cancel } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { employeeRelatedService } from '../../../../services/employeeRelatedService';
import { useToast } from '../../../../contexts/ToastContext';
import type { EmployeeWithDetails } from '../../../../types/employee';
import type { EmployeeDocument, CreateEmployeeDocumentInput } from '../../../../types/employeeRelated';

interface DocsTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const DocsTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: DocsTabProps) => {
  const { id: employeeIdFromUrl } = useParams<{ id: string }>();
  const { showSuccess, showError, showWarning } = useToast();
  // Memoize employeeId to prevent unnecessary re-renders
  const employeeId = useMemo(() => employee?.id || employeeIdFromUrl, [employee?.id, employeeIdFromUrl]);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDocument, setNewDocument] = useState<CreateEmployeeDocumentInput>({
    employee_id: employeeId || '',
    document_type: 'other',
    document_name: '',
    file_path: '',
    is_active: true,
  });

  // Memoize loadDocuments to prevent recreating on every render
  const loadDocuments = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const data = await employeeRelatedService.getEmployeeDocuments(employeeId);
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      loadDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const handleAdd = async () => {
    if (!employeeId) {
      showError('Error: Employee ID is missing. Please refresh the page and try again.');
      return;
    }
    if (!newDocument.document_name || !newDocument.file_path) {
      showWarning('Please fill in document name and file path');
      return;
    }
    try {
      await employeeRelatedService.createDocument({ ...newDocument, employee_id: employeeId });
      await loadDocuments();
      showSuccess('Document added successfully!');
      setNewDocument({
        employee_id: employeeId,
        document_type: 'other',
        document_name: '',
        file_path: '',
        is_active: true,
      });
    } catch (error: any) {
      console.error('Failed to create document:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to create document. Please try again.';
      showError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      // TODO: Implement delete
      await loadDocuments();
    }
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      passport: 'blue',
      certificate: 'green',
      work_pass: 'orange',
      qualification: 'purple',
      other: 'gray',
    };
    return colors[type] || 'gray';
  };

  return (
    <div className="space-y-6">
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          <div className="flex gap-2">
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<Upload />}
              onClick={() => onEditModeChange(true)}
            >
              Upload
            </MuiButton>
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
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No documents uploaded yet.
          </div>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Status</TableCell>
                  {isEditMode && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.document_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={doc.document_type}
                        size="small"
                        color={getDocumentTypeColor(doc.document_type) as any}
                      />
                    </TableCell>
                    <TableCell>
                      {doc.issue_date ? new Date(doc.issue_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        doc.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    {isEditMode && (
                      <TableCell>
                        <div className="flex gap-2">
                          <MuiButton
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => window.open(doc.file_path, '_blank')}
                          >
                            View
                          </MuiButton>
                          <MuiButton
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(doc.id)}
                          >
                            Delete
                          </MuiButton>
                        </div>
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
            <h4 className="font-medium text-gray-900 mb-4">Add New Document</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newDocument.document_type}
                  onChange={(e) => setNewDocument({
                    ...newDocument,
                    document_type: e.target.value as any,
                  })}
                >
                  <option value="passport">Passport</option>
                  <option value="certificate">Certificate</option>
                  <option value="work_pass">Work Pass</option>
                  <option value="qualification">Qualification</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Document Name"
                  value={newDocument.document_name}
                  onChange={(e) => setNewDocument({
                    ...newDocument,
                    document_name: e.target.value,
                  })}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="File Path or URL"
                  value={newDocument.file_path}
                  onChange={(e) => setNewDocument({
                    ...newDocument,
                    file_path: e.target.value,
                  })}
                />
              </div>
              <div>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Issue Date"
                  value={newDocument.issue_date || ''}
                  onChange={(e) => setNewDocument({
                    ...newDocument,
                    issue_date: e.target.value || undefined,
                  })}
                />
              </div>
              <div>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Expiry Date"
                  value={newDocument.expiry_date || ''}
                  onChange={(e) => setNewDocument({
                    ...newDocument,
                    expiry_date: e.target.value || undefined,
                  })}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex gap-2">
                  <MuiButton
                    variant="contained"
                    startIcon={<Upload />}
                    onClick={handleAdd}
                  >
                    Add Document
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
              </div>
            </div>
          </div>
        )}
      </MuiCard>
    </div>
  );
};
