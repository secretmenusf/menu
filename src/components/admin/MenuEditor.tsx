import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  dayNumber: number;
  mealType: 'lunch' | 'dinner';
  vegetarian: boolean;
  glutenFree: boolean;
  ritual?: string;
  symbol?: string;
}

interface MenuEditorProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem | Omit<MenuItem, 'id'>) => void;
  mode: 'create' | 'edit';
}

const dayOptions = [
  { value: '1', label: 'Day 1' },
  { value: '2', label: 'Day 2' },
  { value: '3', label: 'Day 3' },
  { value: '4', label: 'Day 4' },
  { value: '5', label: 'Day 5' },
  { value: '6', label: 'Day 6' },
  { value: '7', label: 'Day 7' },
];

export function MenuEditor({ item, isOpen, onClose, onSave, mode }: MenuEditorProps) {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: item?.name || '',
    description: item?.description || '',
    dayNumber: item?.dayNumber || 1,
    mealType: item?.mealType || 'dinner',
    vegetarian: item?.vegetarian || false,
    glutenFree: item?.glutenFree || false,
    ritual: item?.ritual || '',
    symbol: item?.symbol || '',
  });

  const handleSubmit = () => {
    if (mode === 'edit' && item) {
      onSave({ ...formData, id: item.id });
    } else {
      onSave(formData);
    }
    onClose();
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">
            {mode === 'create' ? 'ADD MENU ITEM' : 'EDIT MENU ITEM'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a new menu item for the weekly menu'
              : 'Update the menu item details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="font-display text-xs tracking-wider">NAME</Label>
            <Input
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Pan-Seared Salmon"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="font-display text-xs tracking-wider">DESCRIPTION</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Brief description of the dish"
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Day and Meal Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">DAY</Label>
              <Select
                value={String(formData.dayNumber)}
                onValueChange={(v) => updateField('dayNumber', parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dayOptions.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">MEAL TYPE</Label>
              <Select
                value={formData.mealType}
                onValueChange={(v) => updateField('mealType', v as 'lunch' | 'dinner')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dietary Options */}
          <div className="space-y-4">
            <Label className="font-display text-xs tracking-wider">DIETARY</Label>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.vegetarian}
                  onCheckedChange={(v) => updateField('vegetarian', v)}
                />
                <Label className="text-sm">Vegetarian</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.glutenFree}
                  onCheckedChange={(v) => updateField('glutenFree', v)}
                />
                <Label className="text-sm">Gluten-Free</Label>
              </div>
            </div>
          </div>

          {/* Ritual & Symbol (optional) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">RITUAL (OPTIONAL)</Label>
              <Input
                value={formData.ritual || ''}
                onChange={(e) => updateField('ritual', e.target.value)}
                placeholder="e.g., mindful eating"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">SYMBOL (OPTIONAL)</Label>
              <Input
                value={formData.symbol || ''}
                onChange={(e) => updateField('symbol', e.target.value)}
                placeholder="e.g., fire"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
            {mode === 'create' ? 'Add Item' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
