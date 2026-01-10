import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AddressCard } from '@/components/profile/AddressCard';
import { AddressForm } from '@/components/profile/AddressForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export interface Address {
  id: string;
  user_id: string;
  label: string;
  street_address: string;
  apt_suite: string | null;
  city: string;
  state: string;
  zip_code: string;
  delivery_instructions: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

function AddressesContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load addresses',
      });
    } else {
      setAddresses((data as Address[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleAddAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    // If this is the first address or marked as default, update others
    if (address.is_default && addresses.length > 0) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { error } = await supabase.from('addresses').insert({
      ...address,
      user_id: user.id,
      is_default: addresses.length === 0 ? true : address.is_default,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add address',
      });
    } else {
      toast({
        title: 'Address added',
        description: 'Your new address has been saved.',
      });
      setShowAddForm(false);
      fetchAddresses();
    }
  };

  const handleUpdateAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !editingAddress) return;

    // If setting as default, update others first
    if (address.is_default && !editingAddress.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { error } = await supabase
      .from('addresses')
      .update({
        ...address,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingAddress.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update address',
      });
    } else {
      toast({
        title: 'Address updated',
        description: 'Your changes have been saved.',
      });
      setEditingAddress(null);
      fetchAddresses();
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete address',
      });
    } else {
      toast({
        title: 'Address deleted',
        description: 'The address has been removed.',
      });
      fetchAddresses();
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    // Remove default from all addresses
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);

    // Set new default
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to set default address',
      });
    } else {
      toast({
        title: 'Default address updated',
      });
      fetchAddresses();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Back button */}
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </button>

          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-2xl tracking-[0.15em]">
              DELIVERY ADDRESSES
            </h1>
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="font-display text-xs tracking-[0.15em]"
            >
              <Plus className="mr-2 h-4 w-4" />
              ADD NEW
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : addresses.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No addresses saved yet
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="font-display text-xs tracking-[0.15em]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  ADD YOUR FIRST ADDRESS
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() => setEditingAddress(address)}
                  onDelete={() => handleDeleteAddress(address.id)}
                  onSetDefault={() => handleSetDefault(address.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Add Address Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-lg tracking-[0.15em]">
              ADD NEW ADDRESS
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-lg tracking-[0.15em]">
              EDIT ADDRESS
            </DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <AddressForm
              address={editingAddress}
              onSubmit={handleUpdateAddress}
              onCancel={() => setEditingAddress(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Addresses() {
  return (
    <ProtectedRoute>
      <AddressesContent />
    </ProtectedRoute>
  );
}
