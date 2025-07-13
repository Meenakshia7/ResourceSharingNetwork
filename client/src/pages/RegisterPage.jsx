import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRegisterMutation } from '../features/auth/authApi';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { useState } from 'react';
import '../index.css';
import HandshakeIcon from '@mui/icons-material/Handshake';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email().required('Email is required'),
    password: yup.string().min(6).required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
    zipCode: yup.string().required('Zip Code is required'),
});

export default function RegisterPage() {
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const [showPassword, setShowPassword] = useState(false);
    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await register(data).unwrap();
            toast.success('Registration successful!');
            navigate('/');
        } catch (err) {
            toast.error(err.data?.message || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                    <HandshakeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            fontFamily: 'Segoe UI, sans-serif',
                            letterSpacing: 1,

                        }}
                    >
                        BorrowIT
                    </Typography>

                </Box>
                <Card>
                    <CardContent>
                        <Typography variant="h6" align="center" gutterBottom>
                            Create an Account
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label="Name"
                                fullWidth
                                margin="normal"
                                {...formRegister('name')}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                            <TextField
                                label="Email"
                                fullWidth
                                margin="normal"
                                {...formRegister('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                margin="normal"
                                {...formRegister('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                margin="normal"
                                {...formRegister('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                            />
                            <TextField
                                label="Zip Code"
                                fullWidth
                                margin="normal"
                                {...formRegister('zipCode')}
                                error={!!errors.zipCode}
                                helperText={errors.zipCode?.message}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                sx={{ mt: 2 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Register'}
                            </Button>
                            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                Already have an account?{' '}
                                <Link component={RouterLink} to="/login" underline="none" sx={{ fontWeight: 500 }}  >
                                    Login
                                </Link>
                            </Typography>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
