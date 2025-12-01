import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MuiInput } from '../../common';
import type { CreateDepartmentInput } from '../../../types/organization';

const departmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
});

type DepartmentFormInputs = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  onSubmit: (data: CreateDepartmentInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateDepartmentInput>;
  isEdit?: boolean;
}

export const DepartmentForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialData,
  isEdit = false
}: DepartmentFormProps) => {
  const methods = useForm<DepartmentFormInputs>({
    resolver: zodResolver(departmentSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  const { handleSubmit, register, formState: { errors } } = methods;

  const handleFormSubmit = (data: DepartmentFormInputs) => {
    onSubmit({
      name: data.name,
      description: data.description || undefined,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Name */}
          <MuiInput
            {...register('name')}
            type="text"
            label="Name"
            placeholder="e.g., Engineering"
            error={errors.name?.message as string}
            required
          />

          {/* Description */}
          <MuiInput
            {...register('description')}
            type="text"
            label="Description"
            placeholder="e.g., Engineering department"
            error={errors.description?.message as string}
            multiline
            rows={4}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update' : 'Add')}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};





