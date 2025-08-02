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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface ContentItem {
  id: number;
  key: string;
  value: string;
  description: string;
}

export function ContentEditor() {
  const { toast } = useToast();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    if (!supabase) {
      console.warn('Supabase not available, skipping content fetch');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('key');

      if (error) throw error;
      setContent(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch content",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateContent(id: number, value: string) {
    if (!supabase) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Database connection is not available",
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from('content')
        .update({ value })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content updated successfully",
      });

      await fetchContent();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  }

  if (!supabase) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Database connection is not available. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {content.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-lg">{item.key}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              {item.value.length > 100 ? (
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    defaultValue={item.value}
                    rows={5}
                    onBlur={(e) => updateContent(item.id, e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Input
                    defaultValue={item.value}
                    onBlur={(e) => updateContent(item.id, e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {saving && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving changes...</span>
        </div>
      )}
    </div>
  );
}
