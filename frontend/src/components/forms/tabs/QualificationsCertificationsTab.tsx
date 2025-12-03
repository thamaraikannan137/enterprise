import { useFormContext, useFieldArray } from 'react-hook-form';
import { MuiInput, MuiButton } from '../../common';
import { Add, Delete } from '@mui/icons-material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Controller } from 'react-hook-form';

export const QualificationsCertificationsTab = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control,
    name: 'qualifications',
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: 'certifications',
  });

  return (
    <div className="space-y-8">
      {/* Qualifications Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Educational Qualifications</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add educational qualifications and degrees.
            </p>
          </div>
          <MuiButton
            type="button"
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={() =>
              appendQualification({
                degree: '',
                major: '',
                institution: '',
                completion_year: new Date().getFullYear(),
                verification_status: 'pending',
              })
            }
          >
            Add Qualification
          </MuiButton>
        </div>

        {qualificationFields.map((field, index) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Qualification {index + 1}</h4>
              <MuiButton
                type="button"
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={() => removeQualification(index)}
              >
                Remove
              </MuiButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MuiInput
                {...register(`qualifications.${index}.degree`)}
                type="text"
                label="Degree"
                placeholder="e.g., Bachelor of Science"
                error={errors.qualifications?.[index]?.degree?.message as string}
                required
              />
              <MuiInput
                {...register(`qualifications.${index}.major`)}
                type="text"
                label="Major (optional)"
                placeholder="e.g., Computer Science"
                error={errors.qualifications?.[index]?.major?.message as string}
              />
              <MuiInput
                {...register(`qualifications.${index}.institution`)}
                type="text"
                label="Institution"
                placeholder="Enter institution name"
                error={errors.qualifications?.[index]?.institution?.message as string}
                required
              />
              <MuiInput
                {...register(`qualifications.${index}.completion_year`, { valueAsNumber: true })}
                type="number"
                label="Completion Year"
                placeholder="Enter year"
                error={errors.qualifications?.[index]?.completion_year?.message as string}
                required
                inputProps={{ min: 1900, max: new Date().getFullYear() + 10 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Certifications Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Professional Certifications</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add professional certifications and licenses.
            </p>
          </div>
          <MuiButton
            type="button"
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={() =>
              appendCertification({
                certification_name: '',
                certification_type: 'new',
                issue_date: new Date().toISOString().split('T')[0],
                ownership: 'employee',
                is_active: true,
              })
            }
          >
            Add Certification
          </MuiButton>
        </div>

        {certificationFields.map((field, index) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Certification {index + 1}</h4>
              <MuiButton
                type="button"
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={() => removeCertification(index)}
              >
                Remove
              </MuiButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MuiInput
                {...register(`certifications.${index}.certification_name`)}
                type="text"
                label="Certification Name"
                placeholder="Enter certification name"
                error={errors.certifications?.[index]?.certification_name?.message as string}
                required
              />
              <div>
                <FormControl fullWidth>
                  <InputLabel shrink>Certification Type</InputLabel>
                  <Controller
                    name={`certifications.${index}.certification_type`}
                    control={control}
                    render={({ field }) => (
                      <Select {...field} className="mt-2">
                        <MenuItem value="new">New</MenuItem>
                        <MenuItem value="renewal">Renewal</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              <MuiInput
                {...register(`certifications.${index}.issue_date`)}
                type="date"
                label="Issue Date"
                error={errors.certifications?.[index]?.issue_date?.message as string}
                required
                InputLabelProps={{ shrink: true }}
              />
              <MuiInput
                {...register(`certifications.${index}.expiry_date`)}
                type="date"
                label="Expiry Date (optional)"
                error={errors.certifications?.[index]?.expiry_date?.message as string}
                InputLabelProps={{ shrink: true }}
              />
              <div>
                <FormControl fullWidth>
                  <InputLabel shrink>Ownership</InputLabel>
                  <Controller
                    name={`certifications.${index}.ownership`}
                    control={control}
                    render={({ field }) => (
                      <Select {...field} className="mt-2">
                        <MenuItem value="company">Company</MenuItem>
                        <MenuItem value="employee">Employee</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Qualifications and certifications are optional. You can add them during employee creation or later from the employee profile page.
        </p>
      </div>
    </div>
  );
};










