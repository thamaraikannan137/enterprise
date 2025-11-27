import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { MuiInput, FileUpload } from '../../common';
import { employeeService } from '../../../services/employeeService';

interface PersonalInfoTabProps {
  uploadPhotoRef?: React.MutableRefObject<(() => Promise<void>) | null> | null;
}

export const PersonalInfoTab = ({ uploadPhotoRef }: PersonalInfoTabProps) => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  
  const profilePhotoPath = watch('profile_photo_path');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Expose upload function to parent component via form context
  // Store the selected file temporarily
  const handleProfilePhotoChange = (file: File | null, previewUrl?: string) => {
    if (!file) {
      setSelectedFile(null);
      setValue('profile_photo_path', '', { shouldValidate: true });
    } else {
      setSelectedFile(file);
      // Clear existing path if new file is selected
      if (profilePhotoPath) {
        setValue('profile_photo_path', '', { shouldValidate: true });
      }
    }
  };

  // This function will be called from parent when Next is clicked
  const uploadProfilePhoto = async (): Promise<void> => {
    // Only upload if there's a selected file and no existing path
    if (!selectedFile) {
      console.log('No file selected, skipping upload');
      return;
    }

    if (profilePhotoPath) {
      console.log('Profile photo already uploaded, skipping');
      return;
    }

    setUploading(true);
    try {
      console.log('Uploading profile photo:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
      const filePath = await employeeService.uploadProfilePhoto(selectedFile);
      console.log('Profile photo uploaded successfully:', filePath);
      setValue('profile_photo_path', filePath, { shouldValidate: true });
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Profile photo upload failed:', error);
      const errorMessage = error?.message || 'Failed to upload profile photo';
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Expose upload function to parent via ref
  useEffect(() => {
    if (uploadPhotoRef) {
      uploadPhotoRef.current = uploadProfilePhoto;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, profilePhotoPath]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <p className="text-sm text-gray-500 mb-6">
          Please provide the employee's personal details. Fields marked with * are required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <MuiInput
          {...register('first_name')}
          type="text"
          label="First Name"
          placeholder="Enter first name"
          error={errors.first_name?.message as string}
          required
        />

        {/* Middle Name */}
        <MuiInput
          {...register('middle_name')}
          type="text"
          label="Middle Name"
          placeholder="Enter middle name (optional)"
          error={errors.middle_name?.message as string}
        />

        {/* Last Name */}
        <MuiInput
          {...register('last_name')}
          type="text"
          label="Last Name"
          placeholder="Enter last name"
          error={errors.last_name?.message as string}
          required
        />

        {/* Date of Birth */}
        <MuiInput
          {...register('date_of_birth')}
          type="date"
          label="Date of Birth"
          error={errors.date_of_birth?.message as string}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            )}
          />
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message as string}</p>
          )}
        </div>

        {/* Nationality */}
        <MuiInput
          {...register('nationality')}
          type="text"
          label="Nationality"
          placeholder="Enter nationality"
          error={errors.nationality?.message as string}
          required
        />

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marital Status <span className="text-red-500">*</span>
          </label>
          <Controller
            name="marital_status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            )}
          />
          {errors.marital_status && (
            <p className="mt-1 text-sm text-red-600">{errors.marital_status.message as string}</p>
          )}
        </div>

        {/* Hire Date */}
        <MuiInput
          {...register('hire_date')}
          type="date"
          label="Hire Date"
          error={errors.hire_date?.message as string}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Termination Date */}
        <MuiInput
          {...register('termination_date')}
          type="date"
          label="Termination Date (optional)"
          error={errors.termination_date?.message as string}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Profile Photo Upload */}
        <div className="md:col-span-2">
          <FileUpload
            label="Profile Photo (optional)"
            accept="image/*"
            maxSize={5}
            value={profilePhotoPath}
            onChange={handleProfilePhotoChange}
            autoUpload={false}
            error={errors.profile_photo_path?.message as string}
            disabled={uploading}
          />
          {uploading && (
            <p className="mt-2 text-sm text-blue-600">Uploading photo...</p>
          )}
        </div>
      </div>
    </div>
  );
};


