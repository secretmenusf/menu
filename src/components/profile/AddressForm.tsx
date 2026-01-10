import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  street_address: z.string().min(5, 'Street address is required'),
  apt_suite: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  delivery_instructions: z.string().optional(),
  is_default: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: {
    label: string;
    street_address: string;
    apt_suite: string | null;
    city: string;
    state: string;
    zip_code: string;
    delivery_instructions: string | null;
    is_default: boolean;
  };
  onSubmit: (values: AddressFormValues) => Promise<void>;
  onCancel: () => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const LABEL_SUGGESTIONS = ['Home', 'Work', 'Office', 'Other'];

export function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: address?.label || '',
      street_address: address?.street_address || '',
      apt_suite: address?.apt_suite || '',
      city: address?.city || '',
      state: address?.state || 'CA',
      zip_code: address?.zip_code || '',
      delivery_instructions: address?.delivery_instructions || '',
      is_default: address?.is_default || false,
    },
  });

  const handleSubmit = async (values: AddressFormValues) => {
    setIsLoading(true);
    await onSubmit(values);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                LABEL
              </FormLabel>
              <div className="flex gap-2 flex-wrap mb-2">
                {LABEL_SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant={field.value === suggestion ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => field.onChange(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Home, Work"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                STREET ADDRESS
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="123 Main Street"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apt_suite"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                APT/SUITE (OPTIONAL)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Apt 4B"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-6 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                  CITY
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="San Francisco"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                  STATE
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="CA" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                  ZIP CODE
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="94102"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="delivery_instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-display text-xs tracking-[0.15em] text-muted-foreground">
                DELIVERY INSTRUCTIONS (OPTIONAL)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Leave at door, ring doorbell, etc."
                  className="resize-none"
                  rows={3}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  Set as default delivery address
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 font-display tracking-[0.15em]"
            disabled={isLoading}
          >
            CANCEL
          </Button>
          <Button
            type="submit"
            className="flex-1 font-display tracking-[0.15em]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                SAVING...
              </>
            ) : (
              'SAVE ADDRESS'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
