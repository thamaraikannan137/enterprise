import { useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MuiInput } from '../../common';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText, Box, Typography, IconButton } from '@mui/material';
import { CameraAlt, Info } from '@mui/icons-material';
import type { CreateLegalEntityInput } from '../../../types/organization';

const legalEntitySchema = z.object({
  country: z.string().min(1, 'Country is required'),
  entity_name: z.string().min(1, 'Entity name is required').max(200, 'Entity name must be less than 200 characters'),
  legal_name: z.string().min(1, 'Legal name is required').max(200, 'Legal name must be less than 200 characters'),
  company_identification_number: z.string().min(1, 'Company Identification Number is required').max(50, 'CIN must be less than 50 characters'),
  date_of_incorporation: z.string().min(1, 'Date of incorporation is required'),
  business_type: z.string().min(1, 'Type of business is required'),
  industry_type: z.string().min(1, 'Sector is required'),
  nature_of_business: z.string().min(1, 'Nature of business is required'),
  address_line_1: z.string().min(1, 'Address line 1 is required').max(200, 'Address line 1 must be less than 200 characters'),
  address_line_2: z.string().max(200, 'Address line 2 must be less than 200 characters').optional().or(z.literal('')),
  city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  state: z.string().min(1, 'State is required').max(100, 'State must be less than 100 characters'),
  zip_code: z.string().min(1, 'Zip code is required').max(20, 'Zip code must be less than 20 characters'),
  currency: z.string().max(50, 'Currency must be less than 50 characters').optional().or(z.literal('')),
  financial_year: z.string().max(100, 'Financial year must be less than 100 characters').optional().or(z.literal('')),
});

type LegalEntityFormInputs = z.infer<typeof legalEntitySchema>;

interface LegalEntityFormProps {
  onSubmit: (data: CreateLegalEntityInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateLegalEntityInput>;
}

// Dropdown options
const countries = ['India', 'United States', 'United Kingdom', 'Singapore', 'United Arab Emirates'];
const businessTypes = ['Private Limited', 'Public Limited', 'Sole Proprietorship', 'Partnership', 'LLC'];
const sectors = [
  'Manufacturing Industry',
  'Service Sector',
  'IT enabled services',
  'Auto or Machine Sales',
  'Healthcare',
  'Finance',
  'Retail',
];
const natureOfBusinessOptions = [
  'Diamond cutting',
  'IT enabled services, BPO service providers',
  'Software Development',
  'Consulting Services',
];

export const LegalEntityForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialData 
}: LegalEntityFormProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const methods = useForm<LegalEntityFormInputs>({
    resolver: zodResolver(legalEntitySchema),
    mode: 'onChange',
    defaultValues: {
      country: initialData?.country || 'India',
      entity_name: initialData?.entity_name || '',
      legal_name: initialData?.legal_name || '',
      company_identification_number: initialData?.company_identification_number || '',
      date_of_incorporation: initialData?.date_of_incorporation || '',
      business_type: initialData?.business_type || '',
      industry_type: initialData?.industry_type || '',
      nature_of_business: initialData?.nature_of_business_code || '',
      address_line_1: initialData?.street_1 || initialData?.address_line_1 || '',
      address_line_2: initialData?.street_2 || initialData?.address_line_2 || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zip_code: initialData?.zip_code || '',
      currency: initialData?.currency || 'India Rupee',
      financial_year: initialData?.financial_year || 'April - March',
    },
  });

  const { handleSubmit, register, control, formState: { errors } } = methods;

  const handleFormSubmit = (data: LegalEntityFormInputs) => {
    // Map form data to CreateLegalEntityInput
    const submitData: CreateLegalEntityInput = {
      entity_name: data.entity_name,
      legal_name: data.legal_name,
      company_identification_number: data.company_identification_number,
      date_of_incorporation: data.date_of_incorporation,
      business_type: data.business_type,
      industry_type: data.industry_type,
      nature_of_business_code: data.nature_of_business,
      street_1: data.address_line_1,
      street_2: data.address_line_2 || undefined,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      country: data.country,
      currency: data.currency || undefined,
      financial_year: data.financial_year || undefined,
    };
    onSubmit(submitData);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">New legal entity</h2>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add'}
            </button>
            <IconButton onClick={onCancel} size="small">
              <span className="text-2xl">×</span>
            </IconButton>
          </div>
        </div>

        {/* Entity Details Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Entity Details</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <CameraAlt fontSize="small" />
                + Add Logo
              </button>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Info fontSize="small" />
              </IconButton>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          {logoPreview && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-contain border border-gray-300 rounded" />
              <button
                type="button"
                onClick={() => setLogoPreview(null)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </Box>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Entity Name */}
            <MuiInput
              {...register('entity_name')}
              type="text"
              label="Entity Name"
              placeholder="e.g., Keka IND"
              error={errors.entity_name?.message as string}
              required
            />

            {/* Legal Name */}
            <MuiInput
              {...register('legal_name')}
              type="text"
              label="Legal Name of the company"
              placeholder="e.g., IND"
              error={errors.legal_name?.message as string}
              required
            />

            {/* Company Identification Number */}
            <MuiInput
              {...register('company_identification_number')}
              type="text"
              label="Company Identification Number"
              placeholder="e.g., 7890y"
              error={errors.company_identification_number?.message as string}
              required
            />

            {/* Date of Incorporation */}
            <MuiInput
              {...register('date_of_incorporation')}
              type="date"
              label="Date of Incorporation"
              error={errors.date_of_incorporation?.message as string}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* Type Of Business */}
            <FormControl fullWidth error={!!errors.business_type}>
              <InputLabel>Type Of Business</InputLabel>
              <Controller
                name="business_type"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Type Of Business">
                    {businessTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.business_type && <FormHelperText>{errors.business_type.message as string}</FormHelperText>}
            </FormControl>

            {/* Sector */}
            <FormControl fullWidth error={!!errors.industry_type}>
              <InputLabel>Sector</InputLabel>
              <Controller
                name="industry_type"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Sector">
                    {sectors.map((sector) => (
                      <MenuItem key={sector} value={sector}>
                        {sector}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.industry_type && <FormHelperText>{errors.industry_type.message as string}</FormHelperText>}
            </FormControl>

            {/* Nature of Business */}
            <FormControl fullWidth error={!!errors.nature_of_business}>
              <InputLabel>Nature of Business</InputLabel>
              <Controller
                name="nature_of_business"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Nature of Business">
                    {natureOfBusinessOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.nature_of_business && <FormHelperText>{errors.nature_of_business.message as string}</FormHelperText>}
            </FormControl>

            {/* Address line 1 */}
            <MuiInput
              {...register('address_line_1')}
              type="text"
              label="Address line 1"
              placeholder="e.g., 4--2-3-"
              error={errors.address_line_1?.message as string}
              required
              className="md:col-span-2"
            />

            {/* Address line 2 */}
            <MuiInput
              {...register('address_line_2')}
              type="text"
              label="Address line 2"
              placeholder="Enter Address line 2"
              error={errors.address_line_2?.message as string}
              className="md:col-span-2"
            />

            {/* City */}
            <MuiInput
              {...register('city')}
              type="text"
              label="City"
              placeholder="e.g., Hyderabad"
              error={errors.city?.message as string}
              required
            />

            {/* State */}
            <MuiInput
              {...register('state')}
              type="text"
              label="State"
              placeholder="e.g., Telangana"
              error={errors.state?.message as string}
              required
            />

            {/* Zip Code */}
            <MuiInput
              {...register('zip_code')}
              type="text"
              label="Zip Code"
              placeholder="e.g., 500018"
              error={errors.zip_code?.message as string}
              required
            />

            {/* Currency */}
            <MuiInput
              {...register('currency')}
              type="text"
              label="CURRENCY"
              placeholder="e.g., India Rupee"
              error={errors.currency?.message as string}
            />

            {/* Financial Year */}
            <MuiInput
              {...register('financial_year')}
              type="text"
              label="FINANCIAL YEAR"
              placeholder="e.g., April - March"
              error={errors.financial_year?.message as string}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
