import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from '@/components/admin/Overview';
import { PortfolioManager } from '@/components/admin/PortfolioManager';
import { BookingSettings } from '@/components/admin/BookingSettings';
import { ContentEditor } from '@/components/admin/ContentEditor';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      }
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="images">Image Management</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Management</CardTitle>
              <CardDescription>
                Upload and manage images for different sections of your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="home" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="home">Home Page</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="flash">Flash Designs</TabsTrigger>
                </TabsList>
                <TabsContent value="home" className="mt-4">
                  <PortfolioManager section="home" />
                </TabsContent>
                <TabsContent value="portfolio" className="mt-4">
                  <PortfolioManager section="portfolio" />
                </TabsContent>
                <TabsContent value="flash" className="mt-4">
                  <PortfolioManager section="flash" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings" className="space-y-4">
          <BookingSettings />
        </TabsContent>
        <TabsContent value="content" className="space-y-4">
          <ContentEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
