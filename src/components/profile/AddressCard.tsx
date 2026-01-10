import { MapPin, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface Address {
  id: string;
  label: string;
  street_address: string;
  apt_suite: string | null;
  city: string;
  state: string;
  zip_code: string;
  delivery_instructions: string | null;
  is_default: boolean;
}

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const fullAddress = [
    address.street_address,
    address.apt_suite,
    `${address.city}, ${address.state} ${address.zip_code}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Card className="bg-card border-border group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-display text-sm tracking-[0.1em] text-foreground truncate">
                {address.label}
              </span>
              {address.is_default && (
                <Badge variant="secondary" className="font-display text-[10px] tracking-[0.1em]">
                  DEFAULT
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground ml-6">
              {fullAddress}
            </p>

            {address.delivery_instructions && (
              <p className="text-xs text-muted-foreground/70 ml-6 mt-2 italic">
                "{address.delivery_instructions}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!address.is_default && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSetDefault}
                className="h-8 w-8"
                title="Set as default"
              >
                <Star className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display tracking-[0.1em]">
                    DELETE ADDRESS
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{address.label}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-display text-xs tracking-[0.1em]">
                    CANCEL
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-display text-xs tracking-[0.1em]"
                  >
                    DELETE
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
