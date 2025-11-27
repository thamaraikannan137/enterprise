import { useFormContext } from 'react-hook-form';
import { MuiInput } from '../../common';

export const CompensationTab = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compensation Information</h3>
        <p className="text-sm text-gray-500 mb-6">
          Enter the employee's compensation details. This information can be updated later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Salary */}
        <MuiInput
          {...register('compensation.basic_salary', { valueAsNumber: true })}
          type="number"
          label="Basic Salary"
          placeholder="Enter basic salary"
          error={errors.compensation?.basic_salary?.message as string}
          required
          inputProps={{ min: 0, step: 0.01 }}
        />

        {/* OT Hourly Rate */}
        <MuiInput
          {...register('compensation.ot_hourly_rate', { valueAsNumber: true })}
          type="number"
          label="OT Hourly Rate (optional)"
          placeholder="Enter overtime hourly rate"
          error={errors.compensation?.ot_hourly_rate?.message as string}
          inputProps={{ min: 0, step: 0.01 }}
        />

        {/* Effective From */}
        <MuiInput
          {...register('compensation.effective_from')}
          type="date"
          label="Effective From"
          error={errors.compensation?.effective_from?.message as string}
          required
          InputLabelProps={{ shrink: true }}
        />

        {/* Effective To */}
        <MuiInput
          {...register('compensation.effective_to')}
          type="date"
          label="Effective To (optional)"
          error={errors.compensation?.effective_to?.message as string}
          InputLabelProps={{ shrink: true }}
        />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Compensation details are optional during employee creation. You can add or update this information later from the employee profile page.
        </p>
      </div>
    </div>
  );
};




