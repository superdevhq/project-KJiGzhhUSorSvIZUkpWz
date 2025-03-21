
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, loading, error, clearError } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast({
        title: 'Reset link sent',
        description: 'Check your email for password reset instructions',
      });
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
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {submitted ? (
              <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                <AlertDescription>
                  If an account exists with the email {email}, you will receive password reset instructions.
                </AlertDescription>
              </Alert>
            ) : (
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
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send reset link'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-slate-600">
              Remember your password?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Back to login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
