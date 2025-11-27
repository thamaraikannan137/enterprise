// React Imports
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { login } from '../store/slices/authSlice';

// MUI Imports
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import loginIllustration from '../assets/images/auth-v2-mask-light.png';

// Icons - using RemixIcon

// Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused': {
      boxShadow: `0 0 0 0 ${theme.palette.primary.main}1f`
    }
  }
}));

// Validation Schema (Zod)
const loginSchema = z.object({
  email: z.string().trim().min(1, 'This field is required').email('Please enter a valid email address'),
  password: z.string().trim().min(1, 'This field is required').min(5, 'Password must be at least 5 characters long')
});

export const LoginPage = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleClickShowPassword = () => setIsPasswordShown(show => !show);

  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate('/');
    } catch (err) {
      // Error is handled by Redux state
      console.error('Login failed:', err);
    }
  };

  return (
    <Box className='flex min-h-screen'>
      <Box
        className='flex items-center justify-center flex-1 min-h-screen relative p-6 hidden md:flex'
        sx={{
          borderRight: theme => theme.palette.divider
        }}
      >
        <LoginIllustration
          src={loginIllustration}
          alt='login-illustration'
          className={theme.direction === 'rtl' ? 'scale-x-[-1]' : ''}
        />
      </Box>
      <Box className='flex justify-center items-center min-h-screen bg-background-paper w-full p-6 md:w-[480px]'>
        <Box className='absolute top-6 left-6'>
          <Typography variant='h4' color='primary'>LOGO</Typography>
        </Box>
        <Box className='w-full max-w-[400px] mt-11 md:mt-0'>
          <Box className='mb-6'>
            <Typography variant='h4'>Welcome! 👋🏻</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box className='flex flex-col gap-5'>
              {error && (
                <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                  <Typography variant='body2'>{error}</Typography>
                </Box>
              )}
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='email'
                    label='Email'
                    placeholder='Enter your email'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Password'
                    placeholder='············'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            {isPasswordShown ? <i className="ri-eye-off-line" /> : <i className="ri-eye-line" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Box className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
                <FormControlLabel control={<Checkbox />} label='Remember me' />
                <Link href='/forgot-password' underline='none' color='primary'>
                  Forgot password?
                </Link>
              </Box>
              <Button fullWidth variant='contained' type='submit' disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
              <Box className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>New on our platform?</Typography>
                <Link href='/register' underline='none' color='primary'>
                  Create an account
                </Link>
              </Box>
              <Divider>or</Divider>
              <Box className='flex justify-center items-center gap-1.5'>
                <IconButton color='primary' size='small'>
                  <i className="ri-facebook-fill" style={{ fontSize: '1.25rem' }} />
                </IconButton>
                <IconButton color='info' size='small'>
                  <i className="ri-twitter-x-fill" style={{ fontSize: '1.25rem' }} />
                </IconButton>
                <IconButton size='small'>
                  <i className="ri-github-fill" style={{ fontSize: '1.25rem' }} />
                </IconButton>
                <IconButton color='error' size='small'>
                  <i className="ri-google-fill" style={{ fontSize: '1.25rem' }} />
                </IconButton>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

