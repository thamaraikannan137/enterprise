import { useFormContext, Controller } from 'react-hook-form';
import { MuiInput } from '../../common';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export const WorkPassTab = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Pass Information</h3>
        <p className="text-sm text-gray-500 mb-6">
          Enter work pass details if applicable. This information can be added or updated later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status */}
        <div className="md:col-span-2">
          <FormControl fullWidth>
            <InputLabel shrink>Work Pass Status</InputLabel>
            <Controller
              name="workPass.status"
              control={control}
              render={({ field }) => (
                <Select {...field} className="mt-2">
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="renewal">Renewal</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </div>

        {/* Work Permit Number */}
        <MuiInput
          {...register('workPass.work_permit_number')}
          type="text"
          label="Work Permit Number"
          placeholder="Enter work permit number"
          error={errors.workPass?.work_permit_number?.message as string}
        />

        {/* FIN Number */}
        <MuiInput
          {...register('workPass.fin_number')}
          type="text"
          label="FIN Number"
          placeholder="Enter FIN number"
          error={errors.workPass?.fin_number?.message as string}
        />

        {/* Application Date */}
        <MuiInput
          {...register('workPass.application_date')}
          type="date"
          label="Application Date"
          error={errors.workPass?.application_date?.message as string}
          InputLabelProps={{ shrink: true }}
        />

        {/* Issuance Date */}
        <MuiInput
          {...register('workPass.issuance_date')}
          type="date"
          label="Issuance Date"
          error={errors.workPass?.issuance_date?.message as string}
          InputLabelProps={{ shrink: true }}
        />

        {/* Expiry Date */}
        <MuiInput
          {...register('workPass.expiry_date')}
          type="date"
          label="Expiry Date"
          error={errors.workPass?.expiry_date?.message as string}
          InputLabelProps={{ shrink: true }}
        />

        {/* Medical Date */}
        <MuiInput
          {...register('workPass.medical_date')}
          type="date"
          label="Medical Date"
          error={errors.workPass?.medical_date?.message as string}
          InputLabelProps={{ shrink: true }}
        />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Work pass information is optional. Leave blank if not applicable. This can be added or updated later from the employee profile page.
        </p>
      </div>
    </div>
  );
};


