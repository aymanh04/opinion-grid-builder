import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import { User } from '@/types/types';

const Index: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const savedUser = localStorage.getItem('survey_admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData: User): void => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('survey_admin_user', JSON.stringify(userData));
  };

  const handleLogout = (): void => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('survey_admin_user');
  };

  if (isLoggedIn && user) {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              mb: 4,
            }}
          >
            LHP Survey Portal
          </Typography>
          
          <AdminLogin onLogin={handleLogin} />
        </Paper>
      </Container>
    </Box>
  );
};

export default Index;