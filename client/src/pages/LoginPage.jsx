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
    FormControlLabel,
    Checkbox,
    Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginMutation } from '../features/auth/authApi';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useState } from 'react';
import '../index.css';
import HandshakeIcon from '@mui/icons-material/Handshake';


const schema = yup.object().shape({
    email: yup.string().email().required('Email is required'),
    password: yup.string().required('Password is required'),
});

export default function LoginPage() {
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await login(data).unwrap();
            toast.success('Login successful');
            navigate('/');
        } catch (err) {
            toast.error(err.data?.message || 'Login failed');
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

                <Card sx={{ padding: 2 }}>
                    <CardContent>
                        <Typography variant="h6" align="center" gutterBottom>
                            Login
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
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
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                                sx={{ color: 'action.active' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />


                            <FormControlLabel
                                control={<Checkbox />}
                                label="Remember me"
                                sx={{ mt: 1 }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                sx={{ mt: 2 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Login'}
                            </Button>

                            <Box mt={2} display="flex" justifyContent="flex-end">
                                <Link
                                    component={RouterLink}
                                    to="/forgot-password"
                                    underline="none"
                                >
                                    Forgot password?
                                </Link>
                            </Box>
                            <Box mt={2} textAlign="center">
                                <Typography variant="body2">
                                    Don’t have an account?{' '}
                                    <Link
                                        component={RouterLink}
                                        to="/register"
                                        underline="none"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        Sign Up
                                    </Link>
                                </Typography>
                            </Box>
                        </form>
                    </CardContent>
                </Card>


            </Box>
        </Container>
    );
}
