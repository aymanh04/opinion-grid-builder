
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Chrome } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/types';

interface AdminLoginProps {
  onLogin: (userData: User) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // Simulate Google OAuth login
    setTimeout(() => {
      const userData = {
        id: '1',
        name: 'Admin User',
        email: 'admin@surveyflow.com',
        picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      
      onLogin(userData);
      toast({
        title: "Login Successful",
        description: "Welcome to SurveyFlow Admin Portal",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card sx={{ 
      width: '100%', 
      maxWidth: '28rem', 
      mx: 'auto',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)',
      border: 0,
      boxShadow: '1 20px 25px -5px rgb(0 0 0 / 0.1)'
    }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#fff',
            color: '#3c4043',
            boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
            },
            border: '1px solid #dadce0',
            height: '48px',
            fontSize: '1.125rem',
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Chrome className="w-5 h-5 mr-2 text-[#4285f4]" />
          )}
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminLogin;
