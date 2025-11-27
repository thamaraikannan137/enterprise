import { useState, useEffect } from 'react';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Add, Delete, Save, Cancel } from '@mui/icons-material';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { employeeRelatedService } from '../../../../services/employeeRelatedService';
import type { EmployeeWithDetails } from '../../../../types/employee';
import type { EmployeeContact, CreateEmployeeContactInput } from '../../../../types/employeeRelated';

interface ContactTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const ContactTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: ContactTabProps) => {
  const [contacts, setContacts] = useState<EmployeeContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newContact, setNewContact] = useState<CreateEmployeeContactInput>({
    employee_id: employee.id,
    contact_type: 'primary',
    phone: '',
    email: '',
    address_line1: '',
    city: '',
    country: '',
    is_current: true,
    valid_from: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadContacts();
  }, [employee.id]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await employeeRelatedService.getEmployeeContacts(employee.id);
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await employeeRelatedService.createContact(newContact);
      await loadContacts();
      setNewContact({
        employee_id: employee.id,
        contact_type: 'secondary',
        phone: '',
        email: '',
        address_line1: '',
        city: '',
        country: '',
        is_current: false,
        valid_from: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      // TODO: Implement delete API call
      await loadContacts();
    }
  };

  const getContactTypeColor = (type: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
      primary: 'primary',
      secondary: 'info',
      emergency: 'error',
    };
    return colors[type] || 'default';
  };

  return (
    <div className="space-y-6">
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
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
          <div className="text-center py-8 text-gray-500">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No contact information available.
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <Chip
                    label={contact.contact_type}
                    color={getContactTypeColor(contact.contact_type)}
                    size="small"
                  />
                  {contact.is_current && (
                    <Chip label="Current" color="success" size="small" />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {contact.phone && (
                    <div>
                      <span className="text-gray-500">Phone: </span>
                      <span className="text-gray-900">{contact.phone}</span>
                    </div>
                  )}
                  {contact.alternate_phone && (
                    <div>
                      <span className="text-gray-500">Alternate Phone: </span>
                      <span className="text-gray-900">{contact.alternate_phone}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div>
                      <span className="text-gray-500">Email: </span>
                      <span className="text-gray-900">{contact.email}</span>
                    </div>
                  )}
                  {contact.address_line1 && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Address: </span>
                      <span className="text-gray-900">
                        {contact.address_line1}
                        {contact.address_line2 && `, ${contact.address_line2}`}
                        {contact.city && `, ${contact.city}`}
                        {contact.postal_code && ` ${contact.postal_code}`}
                        {contact.country && `, ${contact.country}`}
                      </span>
                    </div>
                  )}
                  {contact.valid_from && (
                    <div>
                      <span className="text-gray-500">Valid From: </span>
                      <span className="text-gray-900">
                        {new Date(contact.valid_from).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {contact.valid_to && (
                    <div>
                      <span className="text-gray-500">Valid To: </span>
                      <span className="text-gray-900">
                        {new Date(contact.valid_to).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <div className="mt-3">
                    <MuiButton
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(contact.id)}
                    >
                      Delete
                    </MuiButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isEditMode && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Add New Contact</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Contact Type</InputLabel>
                  <Select
                    value={newContact.contact_type}
                    onChange={(e) => setNewContact({
                      ...newContact,
                      contact_type: e.target.value as any,
                    })}
                    label="Contact Type"
                  >
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="secondary">Secondary</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Phone"
                  value={newContact.alternate_phone || ''}
                  onChange={(e) => setNewContact({ ...newContact, alternate_phone: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newContact.email || ''}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  value={newContact.address_line1 || ''}
                  onChange={(e) => setNewContact({ ...newContact, address_line1: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  value={newContact.address_line2 || ''}
                  onChange={(e) => setNewContact({ ...newContact, address_line2: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={newContact.city || ''}
                  onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={newContact.postal_code || ''}
                  onChange={(e) => setNewContact({ ...newContact, postal_code: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Country"
                  value={newContact.country || ''}
                  onChange={(e) => setNewContact({ ...newContact, country: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Valid From"
                  type="date"
                  value={newContact.valid_from}
                  onChange={(e) => setNewContact({ ...newContact, valid_from: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Valid To (optional)"
                  type="date"
                  value={newContact.valid_to || ''}
                  onChange={(e) => setNewContact({ ...newContact, valid_to: e.target.value || undefined })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newContact.is_current}
                    onChange={(e) => setNewContact({ ...newContact, is_current: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">This is the current address</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <MuiButton
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAdd}
                >
                  Add Contact
                </MuiButton>
              </Grid>
            </Grid>
          </div>
        )}
      </MuiCard>
    </div>
  );
};


