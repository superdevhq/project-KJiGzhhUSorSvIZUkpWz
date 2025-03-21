
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome back to your CRM dashboard',
      });
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">PulseCRM</h1>
          <p className="text-slate-600 mt-2">Your complete customer relationship solution</p>
        </div>
        
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Demo credentials are pre-filled for you</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
