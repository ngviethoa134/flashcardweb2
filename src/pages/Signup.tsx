import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Layers, ArrowRight, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const passwordRequirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p: string) => /\d/.test(p) },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = passwordRequirements.filter(req => req.test(password)).length;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordStrength < 4) {
      toast({
        title: 'Weak password',
        description: 'Please meet all password requirements.',
        variant: 'destructive',
      });
      return;
    }

    if (!passwordsMatch) {
      toast({
        title: 'Passwords don\'t match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await signup(displayName, email, password);
      toast({
        title: 'Account created!',
        description: 'Welcome to Memo. Let\'s start learning!',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decoration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8" style={{ background: 'var(--gradient-hero)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md text-center text-white"
        >
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <Layers className="h-10 w-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey</h2>
          <p className="text-white/80 text-lg">
            Create flashcards, study with spaced repetition, and track your progress to mastery.
          </p>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">Memo</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">
            Start learning smarter today — it's free!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex"
                maxLength={40}
                className="h-12"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password strength */}
              {password.length > 0 && (
                <div className="space-y-2 mt-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= passwordStrength
                            ? passwordStrength <= 1
                              ? 'bg-destructive'
                              : passwordStrength <= 2
                              ? 'bg-amber-500'
                              : passwordStrength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-success'
                            : 'bg-secondary'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.label}
                        className={`flex items-center gap-1 text-xs ${
                          req.test(password) ? 'text-success' : 'text-muted-foreground'
                        }`}
                      >
                        {req.test(password) ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`h-12 ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'border-success focus-visible:ring-success'
                      : 'border-destructive focus-visible:ring-destructive'
                    : ''
                }`}
                required
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-destructive">Passwords don't match</p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-muted-foreground">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>

          {/* Login link */}
          <p className="mt-6 text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
