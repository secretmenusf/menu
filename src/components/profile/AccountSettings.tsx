import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lock, AlertTriangle } from 'lucide-react';
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
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function AccountSettings() {
  const navigate = useNavigate();
  const { user, signOut, updatePassword } = useAuth();
  const { toast } = useToast();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsPasswordLoading(true);

    // First verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: values.currentPassword,
    });

    if (signInError) {
      setIsPasswordLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Current password is incorrect',
      });
      return;
    }

    // Update to new password
    const { error } = await updatePassword(values.newPassword);
    setIsPasswordLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating password',
        description: error.message,
      });
    } else {
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      passwordForm.reset();
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleteLoading(true);

    // Note: This requires a Supabase Edge Function to fully delete user data
    // For now, we'll just sign out and show a message
    toast({
      title: 'Account deletion requested',
      description: 'Please contact support to complete account deletion.',
    });

    await signOut();
    navigate('/');
    setIsDeleteLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Email Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.15em]">
            EMAIL ADDRESS
          </CardTitle>
          <CardDescription>
            Your email is used for login and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {user?.email_confirmed_at ? 'Verified' : 'Not verified'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="font-display text-xs tracking-[0.1em]"
              onClick={() => {
                toast({
                  title: 'Contact support',
                  description: 'Please contact support to change your email address.',
                });
              }}
            >
              CHANGE
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.15em]">
            CHANGE PASSWORD
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                      CURRENT PASSWORD
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="password"
                          className="pl-11"
                          disabled={isPasswordLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                      NEW PASSWORD
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="password"
                          className="pl-11"
                          disabled={isPasswordLoading}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Must be at least 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                      CONFIRM NEW PASSWORD
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="password"
                          className="pl-11"
                          disabled={isPasswordLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full font-display tracking-[0.15em]"
                disabled={isPasswordLoading}
              >
                {isPasswordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    UPDATING...
                  </>
                ) : (
                  'UPDATE PASSWORD'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/50">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.15em] text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            DANGER ZONE
          </CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-1">
                Permanently delete your account and all data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="font-display text-xs tracking-[0.1em]"
                >
                  DELETE
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display tracking-[0.1em]">
                    DELETE ACCOUNT
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers, including order history,
                    saved addresses, and subscription information.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-display text-xs tracking-[0.1em]">
                    CANCEL
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleteLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-display text-xs tracking-[0.1em]"
                  >
                    {isDeleteLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        DELETING...
                      </>
                    ) : (
                      'DELETE ACCOUNT'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
