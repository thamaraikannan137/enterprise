import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { MuiInput, MuiButton } from '../../common';
import { Add, Delete } from '@mui/icons-material';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';

export const ContactInfoTab = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });

  // Initialize with one primary contact if empty
  if (fields.length === 0) {
    append({
      contact_type: 'primary',
      phone: '',
      email: '',
      address_line1: '',
      city: '',
      postal_code: '',
      country: '',
      is_current: true,
      valid_from: new Date().toISOString().split('T')[0],
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <p className="text-sm text-gray-500 mb-6">
          Add contact details for the employee. At least one primary contact is recommended.
        </p>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">
              Contact {index + 1} {index === 0 && <span className="text-sm text-gray-500">(Primary)</span>}
            </h4>
            {fields.length > 1 && (
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
            {/* Contact Type */}
            <div className="md:col-span-2">
              <FormControl fullWidth>
                <InputLabel shrink>Contact Type</InputLabel>
                <Controller
                  name={`contacts.${index}.contact_type`}
                  control={control}
                  render={({ field }) => (
                    <Select {...field} className="mt-2">
                      <MenuItem value="primary">Primary</MenuItem>
                      <MenuItem value="secondary">Secondary</MenuItem>
                      <MenuItem value="emergency">Emergency</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </div>

            {/* Phone */}
            <MuiInput
              {...register(`contacts.${index}.phone`)}
              type="tel"
              label="Phone"
              placeholder="Enter phone number"
              error={errors.contacts?.[index]?.phone?.message as string}
            />

            {/* Alternate Phone */}
            <MuiInput
              {...register(`contacts.${index}.alternate_phone`)}
              type="tel"
              label="Alternate Phone"
              placeholder="Enter alternate phone (optional)"
              error={errors.contacts?.[index]?.alternate_phone?.message as string}
            />

            {/* Email */}
            <MuiInput
              {...register(`contacts.${index}.email`)}
              type="email"
              label="Email"
              placeholder="Enter email address"
              error={errors.contacts?.[index]?.email?.message as string}
            />

            {/* Address Line 1 */}
            <MuiInput
              {...register(`contacts.${index}.address_line1`)}
              type="text"
              label="Address Line 1"
              placeholder="Enter address"
              error={errors.contacts?.[index]?.address_line1?.message as string}
            />

            {/* Address Line 2 */}
            <MuiInput
              {...register(`contacts.${index}.address_line2`)}
              type="text"
              label="Address Line 2"
              placeholder="Enter address line 2 (optional)"
              error={errors.contacts?.[index]?.address_line2?.message as string}
            />

            {/* City */}
            <MuiInput
              {...register(`contacts.${index}.city`)}
              type="text"
              label="City"
              placeholder="Enter city"
              error={errors.contacts?.[index]?.city?.message as string}
            />

            {/* Postal Code */}
            <MuiInput
              {...register(`contacts.${index}.postal_code`)}
              type="text"
              label="Postal Code"
              placeholder="Enter postal code"
              error={errors.contacts?.[index]?.postal_code?.message as string}
            />

            {/* Country */}
            <MuiInput
              {...register(`contacts.${index}.country`)}
              type="text"
              label="Country"
              placeholder="Enter country"
              error={errors.contacts?.[index]?.country?.message as string}
            />

            {/* Valid From */}
            <MuiInput
              {...register(`contacts.${index}.valid_from`)}
              type="date"
              label="Valid From"
              error={errors.contacts?.[index]?.valid_from?.message as string}
              InputLabelProps={{ shrink: true }}
            />

            {/* Valid To */}
            <MuiInput
              {...register(`contacts.${index}.valid_to`)}
              type="date"
              label="Valid To (optional)"
              error={errors.contacts?.[index]?.valid_to?.message as string}
              InputLabelProps={{ shrink: true }}
            />

            {/* Is Current */}
            <div className="md:col-span-2">
              <Controller
                name={`contacts.${index}.is_current`}
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">This is the current address</span>
                  </label>
                )}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Contact Button */}
      <MuiButton
        type="button"
        variant="outlined"
        startIcon={<Add />}
        onClick={() =>
          append({
            contact_type: 'secondary',
            phone: '',
            email: '',
            address_line1: '',
            city: '',
            postal_code: '',
            country: '',
            is_current: false,
            valid_from: new Date().toISOString().split('T')[0],
          })
        }
      >
        Add Another Contact
      </MuiButton>
    </div>
  );
};








