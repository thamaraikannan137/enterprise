import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Grid, Chip, Box } from '@mui/material';
import { useAppDispatch } from '../../../../../store';
import { fetchEmployeeWithDetails } from '../../../../../store/slices/employeeSlice';
import { employeeService } from '../../../../../services/employeeService';
import { useToast } from '../../../../../contexts/ToastContext';
import { EditableCard } from './EditableCard';
import type { EmployeeWithDetails } from '../../../../../types/employee';

interface SkillsSectionProps {
  employee: EmployeeWithDetails;
  employeeId: string;
}

const skillsSchema = z.object({
  professional_summary: z.string().max(2000).optional().or(z.literal('')),
  languages_read: z.string().optional().or(z.literal('')),
  languages_write: z.string().optional().or(z.literal('')),
  languages_speak: z.string().optional().or(z.literal('')),
  special_academic_achievements: z.string().max(1000).optional().or(z.literal('')),
  certifications_details: z.string().max(1000).optional().or(z.literal('')),
  hobbies: z.string().max(500).optional().or(z.literal('')),
  interests: z.string().max(500).optional().or(z.literal('')),
  professional_institution_member: z.boolean().optional(),
  professional_institution_details: z.string().max(500).optional().or(z.literal('')),
  social_organization_member: z.boolean().optional(),
  social_organization_details: z.string().max(500).optional().or(z.literal('')),
  insigma_hire_date: z.string().optional().or(z.literal('')),
});

type SkillsFormData = z.infer<typeof skillsSchema>;

export const SkillsSection = ({ employee, employeeId }: SkillsSectionProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [languagesRead, setLanguagesRead] = useState<string[]>([]);
  const [languagesWrite, setLanguagesWrite] = useState<string[]>([]);
  const [languagesSpeak, setLanguagesSpeak] = useState<string[]>([]);
  const [newLanguageRead, setNewLanguageRead] = useState('');
  const [newLanguageWrite, setNewLanguageWrite] = useState('');
  const [newLanguageSpeak, setNewLanguageSpeak] = useState('');

  // Skills fields are now directly on the Employee model
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      professional_summary: employee.professional_summary || '',
      languages_read: '',
      languages_write: '',
      languages_speak: '',
      special_academic_achievements: employee.special_academic_achievements || '',
      certifications_details: employee.certifications_details || '',
      hobbies: employee.hobbies || '',
      interests: employee.interests || '',
      professional_institution_member: employee.professional_institution_member || false,
      professional_institution_details: employee.professional_institution_details || '',
      social_organization_member: employee.social_organization_member || false,
      social_organization_details: employee.social_organization_details || '',
      insigma_hire_date: employee.insigma_hire_date ? new Date(employee.insigma_hire_date).toISOString().split('T')[0] : '',
    },
  });

  useEffect(() => {
    setLanguagesRead(employee.languages_read || []);
    setLanguagesWrite(employee.languages_write || []);
    setLanguagesSpeak(employee.languages_speak || []);
    reset({
      professional_summary: employee.professional_summary || '',
      languages_read: '',
      languages_write: '',
      languages_speak: '',
      special_academic_achievements: employee.special_academic_achievements || '',
      certifications_details: employee.certifications_details || '',
      hobbies: employee.hobbies || '',
      interests: employee.interests || '',
      professional_institution_member: employee.professional_institution_member || false,
      professional_institution_details: employee.professional_institution_details || '',
      social_organization_member: employee.social_organization_member || false,
      social_organization_details: employee.social_organization_details || '',
      insigma_hire_date: employee.insigma_hire_date ? new Date(employee.insigma_hire_date).toISOString().split('T')[0] : '',
    });
  }, [employee, reset]);

  const addLanguage = (type: 'read' | 'write' | 'speak', value: string) => {
    if (!value.trim()) return;
    if (type === 'read') {
      setLanguagesRead([...languagesRead, value.trim()]);
      setNewLanguageRead('');
    } else if (type === 'write') {
      setLanguagesWrite([...languagesWrite, value.trim()]);
      setNewLanguageWrite('');
    } else {
      setLanguagesSpeak([...languagesSpeak, value.trim()]);
      setNewLanguageSpeak('');
    }
  };

  const removeLanguage = (type: 'read' | 'write' | 'speak', index: number) => {
    if (type === 'read') {
      setLanguagesRead(languagesRead.filter((_, i) => i !== index));
    } else if (type === 'write') {
      setLanguagesWrite(languagesWrite.filter((_, i) => i !== index));
    } else {
      setLanguagesSpeak(languagesSpeak.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: SkillsFormData) => {
    try {
      // Update employee with skills information
      // Skills fields are now directly on the Employee model
      const updateData: any = {
        ...(data.professional_summary && { professional_summary: data.professional_summary.trim() }),
        languages_read: languagesRead.length > 0 ? languagesRead : undefined,
        languages_write: languagesWrite.length > 0 ? languagesWrite : undefined,
        languages_speak: languagesSpeak.length > 0 ? languagesSpeak : undefined,
        ...(data.special_academic_achievements && { special_academic_achievements: data.special_academic_achievements.trim() }),
        ...(data.certifications_details && { certifications_details: data.certifications_details.trim() }),
        ...(data.hobbies && { hobbies: data.hobbies.trim() }),
        ...(data.interests && { interests: data.interests.trim() }),
        ...(data.professional_institution_member !== undefined && { professional_institution_member: data.professional_institution_member }),
        ...(data.professional_institution_details && { professional_institution_details: data.professional_institution_details.trim() }),
        ...(data.social_organization_member !== undefined && { social_organization_member: data.social_organization_member }),
        ...(data.social_organization_details && { social_organization_details: data.social_organization_details.trim() }),
        ...(data.insigma_hire_date && { insigma_hire_date: data.insigma_hire_date }),
      };

      // Remove undefined and empty string values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      await employeeService.updateEmployee(employeeId, updateData);
      await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      showSuccess('Skills & Interests saved successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      showError(error?.message || 'Failed to save skills & interests');
    }
  };

  const handleCancel = () => {
    reset();
    setLanguagesRead(employee.languages_read || []);
    setLanguagesWrite(employee.languages_write || []);
    setLanguagesSpeak(employee.languages_speak || []);
    setIsEditMode(false);
  };

  return (
    <EditableCard
      title="Skills & Interests"
      isEditMode={isEditMode}
      onEditModeChange={setIsEditMode}
      onSave={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      modalMaxWidth="lg"
      editContent={
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <Controller
                name="professional_summary"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth multiline rows={4} label="Professional Summary" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages you can READ</label>
                <div className="flex gap-2 mb-2">
                  <TextField
                    size="small"
                    value={newLanguageRead}
                    onChange={(e) => setNewLanguageRead(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLanguage('read', newLanguageRead);
                      }
                    }}
                    placeholder="Add language"
                  />
                  <button
                    type="button"
                    onClick={() => addLanguage('read', newLanguageRead)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {languagesRead.map((lang, idx) => (
                    <Chip key={idx} label={lang} onDelete={() => removeLanguage('read', idx)} />
                  ))}
                </Box>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages you can WRITE</label>
                <div className="flex gap-2 mb-2">
                  <TextField
                    size="small"
                    value={newLanguageWrite}
                    onChange={(e) => setNewLanguageWrite(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLanguage('write', newLanguageWrite);
                      }
                    }}
                    placeholder="Add language"
                  />
                  <button
                    type="button"
                    onClick={() => addLanguage('write', newLanguageWrite)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {languagesWrite.map((lang, idx) => (
                    <Chip key={idx} label={lang} onDelete={() => removeLanguage('write', idx)} />
                  ))}
                </Box>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages you can SPEAK</label>
                <div className="flex gap-2 mb-2">
                  <TextField
                    size="small"
                    value={newLanguageSpeak}
                    onChange={(e) => setNewLanguageSpeak(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLanguage('speak', newLanguageSpeak);
                      }
                    }}
                    placeholder="Add language"
                  />
                  <button
                    type="button"
                    onClick={() => addLanguage('speak', newLanguageSpeak)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {languagesSpeak.map((lang, idx) => (
                    <Chip key={idx} label={lang} onDelete={() => removeLanguage('speak', idx)} />
                  ))}
                </Box>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <Controller
                name="special_academic_achievements"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth multiline rows={3} label="Special Academic Achievements (if any)" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <Controller
                name="certifications_details"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth multiline rows={3} label="Details of Certifications (other than academics)" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Controller
                name="hobbies"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth multiline rows={2} label="Your Hobbies" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Controller
                name="interests"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth multiline rows={2} label="Your Interests" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Controller
                name="professional_institution_member"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    SelectProps={{ native: true }}
                    label="Member of Professional Institution/Association"
                    value={field.value ? 'yes' : 'no'}
                    onChange={(e) => field.onChange(e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Controller
                name="professional_institution_details"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth multiline rows={2} label="Professional Institution Details" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Controller
                name="social_organization_member"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    SelectProps={{ native: true }}
                    label="Member of Social Organization"
                    value={field.value ? 'yes' : 'no'}
                    onChange={(e) => field.onChange(e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Controller
                name="social_organization_details"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth multiline rows={2} label="Social Organization Details" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="insigma_hire_date"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Insigma Hire Date" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
          </Grid>
        </form>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Professional Summary</div>
          <div className="text-base text-gray-900 whitespace-pre-wrap">{employee.professional_summary || '-'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-2">Languages you can READ</div>
          <div className="flex flex-wrap gap-2">
            {employee.languages_read && employee.languages_read.length > 0 ? (
              employee.languages_read.map((lang, idx) => (
                <Chip key={idx} label={lang} size="small" />
              ))
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-2">Languages you can WRITE</div>
          <div className="flex flex-wrap gap-2">
            {employee.languages_write && employee.languages_write.length > 0 ? (
              employee.languages_write.map((lang, idx) => (
                <Chip key={idx} label={lang} size="small" />
              ))
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-2">Languages you can SPEAK</div>
          <div className="flex flex-wrap gap-2">
            {employee.languages_speak && employee.languages_speak.length > 0 ? (
              employee.languages_speak.map((lang, idx) => (
                <Chip key={idx} label={lang} size="small" />
              ))
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Special Academic Achievements</div>
          <div className="text-base text-gray-900 whitespace-pre-wrap">{employee.special_academic_achievements || '-'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Certifications Details</div>
          <div className="text-base text-gray-900 whitespace-pre-wrap">{employee.certifications_details || '-'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Hobbies</div>
          <div className="text-base text-gray-900">{employee.hobbies || '-'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Interests</div>
          <div className="text-base text-gray-900">{employee.interests || '-'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Professional Institution Member</div>
          <div className="text-base text-gray-900">{employee.professional_institution_member !== undefined ? (employee.professional_institution_member ? 'Yes' : 'No') : '-'}</div>
          {employee.professional_institution_member && employee.professional_institution_details && (
            <div className="mt-2 text-sm text-gray-700">{employee.professional_institution_details}</div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Social Organization Member</div>
          <div className="text-base text-gray-900">{employee.social_organization_member !== undefined ? (employee.social_organization_member ? 'Yes' : 'No') : '-'}</div>
          {employee.social_organization_member && employee.social_organization_details && (
            <div className="mt-2 text-sm text-gray-700">{employee.social_organization_details}</div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Insigma Hire Date</div>
          <div className="text-base text-gray-900">{employee.insigma_hire_date ? new Date(employee.insigma_hire_date).toLocaleDateString() : '-'}</div>
        </div>
      </div>
    </EditableCard>
  );
};

