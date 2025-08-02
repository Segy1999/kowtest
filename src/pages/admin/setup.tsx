import { useState, useEffect } from 'react';
import { createAdminUser } from '@/utils/adminSetup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

export default function AdminSetup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [setupKey, setSetupKey] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  useEffect(() => {
    // Check if setup is allowed
    const setupAllowed = import.meta.env.VITE_ADMIN_SETUP_ENABLED === 'true';
    if (!setupAllowed) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Admin setup is currently disabled.",
      });
      navigate('/admin/login');
    }
  }, []);

  const handleSetupKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setupKey === import.meta.env.VITE_ADMIN_SETUP_KEY) {
      setIsAuthorized(true);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Setup Key",
        description: "The provided setup key is incorrect.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createAdminUser(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Admin account created. Please check your email to confirm your account before logging in.",
        });
        // Navigate to login page after successful creation
        navigate('/admin/login');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to create admin user",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'setupKey') {
      setSetupKey(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Setup Authorization</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetupKeySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setupKey">Setup Key</Label>
                <Input
                  id="setupKey"
                  name="setupKey"
                  type="password"
                  required
                  value={setupKey}
                  onChange={handleChange}
                  placeholder="Enter setup key"
                />
              </div>
              <Button type="submit" className="w-full">
                Verify Setup Key
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Admin User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter admin username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter secure password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Admin User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
