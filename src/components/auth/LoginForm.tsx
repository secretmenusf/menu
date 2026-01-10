import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
  onSuccess?: () => void;
}

export function LoginForm({ onForgotPassword, onSignUp, onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const { signIn, signInWithMagicLink } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    const { error } = await signIn(values.email, values.password);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error signing in',
        description: error.message,
      });
    } else {
      toast({
        title: 'Welcome back',
        description: 'You have been signed in successfully.',
      });
      onSuccess?.();
    }
  };

  const handleMagicLink = async () => {
    const email = form.getValues('email');
    if (!email || !z.string().email().safeParse(email).success) {
      form.setError('email', { message: 'Please enter a valid email first' });
      return;
    }

    setIsMagicLinkLoading(true);
    const { error } = await signInWithMagicLink(email);
    setIsMagicLinkLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error sending magic link',
        description: error.message,
      });
    } else {
      toast({
        title: 'Magic link sent',
        description: 'Check your email for the login link.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl tracking-[0.2em] text-foreground">
          ENTER THE SANCTUM
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in to access your secret membership
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                  EMAIL
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="your@email.com"
                      className="pl-11"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!showMagicLink && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                    PASSWORD
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="pl-11"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!showMagicLink ? (
            <>
              <Button
                type="submit"
                className="w-full font-display tracking-[0.15em]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ENTERING...
                  </>
                ) : (
                  'SIGN IN'
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full font-display tracking-[0.15em]"
                onClick={() => setShowMagicLink(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                USE MAGIC LINK
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                className="w-full font-display tracking-[0.15em]"
                onClick={handleMagicLink}
                disabled={isMagicLinkLoading}
              >
                {isMagicLinkLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    SEND MAGIC LINK
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setShowMagicLink(false)}
              >
                Use password instead
              </Button>
            </>
          )}
        </form>
      </Form>

      <div className="space-y-2 text-center text-sm">
        {!showMagicLink && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot your password?
          </button>
        )}
        <p className="text-muted-foreground">
          Not yet initiated?{' '}
          <button
            type="button"
            onClick={onSignUp}
            className="text-foreground hover:underline font-medium"
          >
            Join the circle
          </button>
        </p>
      </div>
    </div>
  );
}
