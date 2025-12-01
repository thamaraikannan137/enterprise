import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MuiInput } from '../../common';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import type { CreateLocationInput } from '../../../types/organization';

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  timezone: z.string().min(1, 'Timezone is required').max(100, 'Timezone must be less than 100 characters'),
  country: z.string().min(1, 'Country is required').max(100, 'Country must be less than 100 characters'),
  state: z.string().min(1, 'State is required').max(100, 'State must be less than 100 characters'),
  address: z.string().min(1, 'Address is required').max(500, 'Address must be less than 500 characters'),
  city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  zip_code: z.string().min(1, 'Zip code is required').max(20, 'Zip code must be less than 20 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
});

type LocationFormInputs = z.infer<typeof locationSchema>;

interface LocationFormProps {
  onSubmit: (data: CreateLocationInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateLocationInput>;
  isEdit?: boolean;
}

// Common timezones
const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

// Common countries
const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'India',
  'Singapore',
  'United Arab Emirates',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'China',
];

export const LocationForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialData,
  isEdit = false
}: LocationFormProps) => {
  const methods = useForm<LocationFormInputs>({
    resolver: zodResolver(locationSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      timezone: initialData?.timezone || 'UTC',
      country: initialData?.country || '',
      state: initialData?.state || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      zip_code: initialData?.zip_code || '',
      description: initialData?.description || '',
    },
  });

  const { handleSubmit, register, control, formState: { errors } } = methods;

  const handleFormSubmit = (data: LocationFormInputs) => {
    onSubmit({
      name: data.name,
      timezone: data.timezone,
      country: data.country,
      state: data.state,
      address: data.address,
      city: data.city,
      zip_code: data.zip_code,
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
            label="Name of the location"
            placeholder="e.g., New York Office"
            error={errors.name?.message as string}
            required
          />

          {/* Timezone */}
          <FormControl fullWidth error={!!errors.timezone}>
            <InputLabel>Timezone</InputLabel>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Timezone">
                  {timezones.map((tz) => (
                    <MenuItem key={tz} value={tz}>
                      {tz}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.timezone && <FormHelperText>{errors.timezone.message as string}</FormHelperText>}
          </FormControl>

          {/* Country */}
          <FormControl fullWidth error={!!errors.country}>
            <InputLabel>Country</InputLabel>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Country">
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.country && <FormHelperText>{errors.country.message as string}</FormHelperText>}
          </FormControl>

          {/* State */}
          <MuiInput
            {...register('state')}
            type="text"
            label="State"
            placeholder="e.g., New York"
            error={errors.state?.message as string}
            required
          />

          {/* Address */}
          <MuiInput
            {...register('address')}
            type="text"
            label="Address"
            placeholder="e.g., 123 Main Street"
            error={errors.address?.message as string}
            required
            multiline
            rows={2}
          />

          {/* City */}
          <MuiInput
            {...register('city')}
            type="text"
            label="City"
            placeholder="e.g., New York"
            error={errors.city?.message as string}
            required
          />

          {/* Zip Code */}
          <MuiInput
            {...register('zip_code')}
            type="text"
            label="Zip Code"
            placeholder="e.g., 10001"
            error={errors.zip_code?.message as string}
            required
          />

          {/* Description */}
          <MuiInput
            {...register('description')}
            type="text"
            label="Description"
            placeholder="Optional description"
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





