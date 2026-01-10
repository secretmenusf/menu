import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MenuEditor, type MenuItem } from '@/components/admin/MenuEditor';
import { Plus, Edit, Trash2, Leaf, Wheat } from 'lucide-react';

// Mock data
const mockMenuItems: MenuItem[] = [
  {
    id: 'MI-001',
    name: 'Grilled Chicken Salad',
    description: 'Fresh greens with herb-marinated chicken',
    dayNumber: 1,
    mealType: 'lunch',
    vegetarian: false,
    glutenFree: true,
  },
  {
    id: 'MI-002',
    name: 'Pan-Seared Salmon',
    description: 'Wild-caught salmon with seasonal vegetables',
    dayNumber: 1,
    mealType: 'dinner',
    vegetarian: false,
    glutenFree: true,
    ritual: 'Gratitude',
    symbol: 'Water',
  },
  {
    id: 'MI-003',
    name: 'Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms',
    dayNumber: 1,
    mealType: 'dinner',
    vegetarian: true,
    glutenFree: true,
  },
  {
    id: 'MI-004',
    name: 'Mediterranean Bowl',
    description: 'Quinoa, hummus, and roasted vegetables',
    dayNumber: 2,
    mealType: 'lunch',
    vegetarian: true,
    glutenFree: true,
  },
  {
    id: 'MI-005',
    name: 'Braised Short Ribs',
    description: 'Slow-cooked beef with red wine reduction',
    dayNumber: 2,
    mealType: 'dinner',
    vegetarian: false,
    glutenFree: true,
    ritual: 'Presence',
    symbol: 'Fire',
  },
  {
    id: 'MI-006',
    name: 'Stuffed Bell Peppers',
    description: 'Quinoa and vegetable stuffed peppers',
    dayNumber: 2,
    mealType: 'dinner',
    vegetarian: true,
    glutenFree: true,
  },
];

export default function Menus() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const [isMenuActive, setIsMenuActive] = useState(true);

  const handleCreate = () => {
    setSelectedItem(null);
    setEditorMode('create');
    setIsEditorOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };

  const handleSave = (item: MenuItem | Omit<MenuItem, 'id'>) => {
    if ('id' in item) {
      // Edit existing
      setMenuItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    } else {
      // Create new
      const newItem: MenuItem = {
        ...item,
        id: `MI-${String(menuItems.length + 1).padStart(3, '0')}`,
      };
      setMenuItems((prev) => [...prev, newItem]);
    }
  };

  const handleDelete = () => {
    if (deleteItem) {
      setMenuItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
      setDeleteItem(null);
    }
  };

  // Group items by day
  const itemsByDay = menuItems.reduce(
    (acc, item) => {
      const day = item.dayNumber;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    },
    {} as Record<number, MenuItem[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.1em] mb-2">MENUS</h1>
          <p className="text-muted-foreground font-body">
            Edit weekly menus and menu items
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={isMenuActive} onCheckedChange={setIsMenuActive} />
            <Label className="text-sm">Menu Active</Label>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Menu Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display">{menuItems.length}</div>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display">
              {menuItems.filter((i) => i.mealType === 'lunch').length}
            </div>
            <p className="text-xs text-muted-foreground">Lunch Options</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display">
              {menuItems.filter((i) => i.mealType === 'dinner').length}
            </div>
            <p className="text-xs text-muted-foreground">Dinner Options</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-display">
              {menuItems.filter((i) => i.vegetarian).length}
            </div>
            <p className="text-xs text-muted-foreground">Vegetarian</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items by Day */}
      {Object.entries(itemsByDay)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([day, items]) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="font-display text-sm tracking-[0.1em]">
                DAY {day}
              </CardTitle>
              <CardDescription>
                {items.length} menu items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display text-xs tracking-wider">NAME</TableHead>
                      <TableHead className="font-display text-xs tracking-wider">DESCRIPTION</TableHead>
                      <TableHead className="font-display text-xs tracking-wider">MEAL</TableHead>
                      <TableHead className="font-display text-xs tracking-wider">DIETARY</TableHead>
                      <TableHead className="font-display text-xs tracking-wider">RITUAL</TableHead>
                      <TableHead className="w-24"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items
                      .sort((a, b) => (a.mealType === 'lunch' ? -1 : 1))
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                            {item.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {item.mealType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {item.vegetarian && (
                                <Badge variant="secondary" className="gap-1">
                                  <Leaf className="h-3 w-3" />
                                  V
                                </Badge>
                              )}
                              {item.glutenFree && (
                                <Badge variant="secondary" className="gap-1">
                                  <Wheat className="h-3 w-3" />
                                  GF
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.ritual || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteItem(item)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}

      {/* Menu Editor */}
      <MenuEditor
        item={selectedItem}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        mode={editorMode}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display tracking-wider">
              DELETE MENU ITEM
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
