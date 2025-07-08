
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminLogin = ({ onLogin }) => {
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
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-gray-900">Admin Portal</CardTitle>
        <p className="text-gray-600">Sign in to manage your surveys</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 h-12 text-lg font-medium"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Chrome className="w-5 h-5 mr-2" />
          )}
          Continue with Google
        </Button>
        
        <div className="text-center text-sm text-gray-500">
          <LogIn className="w-4 h-4 inline mr-1" />
          Secure admin authentication
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLogin;
