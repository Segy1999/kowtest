import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  featured: boolean;
}

interface FlashDesign {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  category: string;
  available: boolean;
  created_at: string;
}

interface PortfolioManagerProps {
  section?: string;
}

export function PortfolioManager({ section = "portfolio" }: PortfolioManagerProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<(PortfolioItem | FlashDesign)[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    image_url: '',
    featured: section === 'home',
    price: '',
    category: '',
    available: true
  });

  useEffect(() => {
    if (section === 'home' || section === 'portfolio') {
      setNewItem(prev => ({ 
        ...prev, 
        featured: section === 'home',
        price: '',
        category: ''
      }));
    } else if (section === 'flash') {
      setNewItem(prev => ({ 
        ...prev, 
        featured: false,
        price: '100.00',
        category: 'General'
      }));
    }
    fetchItems();
  }, [section]);

  async function fetchItems() {
    try {
      if (section === 'flash') {
        // Fetch from flash_designs table
        const { data, error } = await supabase
          .from('flash_designs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setItems(data || []);
      } else {
        // Fetch from portfolio table
        let query = supabase
          .from('portfolio')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (section === 'home') {
          query = query.eq('featured', true);
        } else if (section === 'portfolio') {
          query = query.eq('featured', false);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        setItems(data || []);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch ${section} items`,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (section === 'flash') {
        // Insert into flash_designs table
        const { error } = await supabase
          .from('flash_designs')
          .insert([{
            title: newItem.title,
            description: newItem.description,
            image_url: newItem.image_url,
            price: parseFloat(newItem.price),
            category: newItem.category,
            available: newItem.available
          }]);

        if (error) throw error;
      } else {
        // Insert into portfolio table
        const { error } = await supabase
          .from('portfolio')
          .insert([{
            title: newItem.title,
            description: newItem.description,
            image_url: newItem.image_url,
            featured: newItem.featured
          }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `${getSectionTitle()} added successfully`,
      });

      // Reset form based on section
      if (section === 'flash') {
        setNewItem({ 
          title: '', 
          description: '', 
          image_url: '', 
          featured: false,
          price: '100.00',
          category: 'General',
          available: true
        });
      } else {
        setNewItem({ 
          title: '', 
          description: '', 
          image_url: '', 
          featured: section === 'home',
          price: '',
          category: '',
          available: true
        });
      }
      
      await fetchItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteItem(id: number) {
    try {
      if (section === 'flash') {
        // Delete from flash_designs table
        const { error } = await supabase
          .from('flash_designs')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        // Delete from portfolio table
        const { error } = await supabase
          .from('portfolio')
          .delete()
          .eq('id', id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `${getSectionTitle()} deleted successfully`,
      });

      await fetchItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }

  const getSectionTitle = () => {
    switch(section) {
      case 'home': return 'Home Page Image';
      case 'flash': return 'Flash Design';
      default: return 'Portfolio Item';
    }
  };

  console.log(`Managing images for section: ${section}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New {getSectionTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <Input
              placeholder="Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              required
            />
            <Input
              placeholder="Image URL"
              value={newItem.image_url}
              onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
              required
            />
            
            {section === 'flash' && (
              <>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  required
                />
                <Input
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                />
              </>
            )}
            
            <Button type="submit" disabled={loading}>
              Add {section === 'flash' ? 'Design' : 'Image'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>
              
              {section === 'flash' && 'price' in item && (
                <p className="font-bold mb-2">Price: ${item.price}</p>
              )}
              
              <Button
                variant="destructive"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
