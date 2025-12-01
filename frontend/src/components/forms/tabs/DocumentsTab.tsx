import { useFormContext, useFieldArray } from 'react-hook-form';
import { MuiInput, MuiButton } from '../../common';
import { Add, Delete } from '@mui/icons-material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Controller } from 'react-hook-form';

export const DocumentsTab = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents',
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
        <p className="text-sm text-gray-500 mb-6">
          Upload or link employee documents. Documents can also be added later from the employee profile.
        </p>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Document {index + 1}</h4>
            {fields.length > 0 && (
              <MuiButton
                type="button"
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={() => remove(index)}
              >
                Remove
              </MuiButton>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Type */}
            <div className="md:col-span-2">
              <FormControl fullWidth>
                <InputLabel shrink>Document Type</InputLabel>
                <Controller
                  name={`documents.${index}.document_type`}
                  control={control}
                  render={({ field }) => (
                    <Select {...field} className="mt-2">
                      <MenuItem value="passport">Passport</MenuItem>
                      <MenuItem value="certificate">Certificate</MenuItem>
                      <MenuItem value="work_pass">Work Pass</MenuItem>
                      <MenuItem value="qualification">Qualification</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </div>

            {/* Document Name */}
            <MuiInput
              {...register(`documents.${index}.document_name`)}
              type="text"
              label="Document Name"
              placeholder="Enter document name"
              error={errors.documents?.[index]?.document_name?.message as string}
              required
            />

            {/* File Path */}
            <MuiInput
              {...register(`documents.${index}.file_path`)}
              type="text"
              label="File Path or URL"
              placeholder="Enter file path or URL"
              error={errors.documents?.[index]?.file_path?.message as string}
              required
            />

            {/* Issue Date */}
            <MuiInput
              {...register(`documents.${index}.issue_date`)}
              type="date"
              label="Issue Date (optional)"
              error={errors.documents?.[index]?.issue_date?.message as string}
              InputLabelProps={{ shrink: true }}
            />

            {/* Expiry Date */}
            <MuiInput
              {...register(`documents.${index}.expiry_date`)}
              type="date"
              label="Expiry Date (optional)"
              error={errors.documents?.[index]?.expiry_date?.message as string}
              InputLabelProps={{ shrink: true }}
            />
          </div>
        </div>
      ))}

      {/* Add Document Button */}
      <MuiButton
        type="button"
        variant="outlined"
        startIcon={<Add />}
        onClick={() =>
          append({
            document_type: 'other',
            document_name: '',
            file_path: '',
            issue_date: '',
            expiry_date: '',
            is_active: true,
          })
        }
      >
        Add Document
      </MuiButton>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Documents are optional during employee creation. You can upload files later from the employee profile page. For now, you can enter file paths or URLs.
        </p>
      </div>
    </div>
  );
};








