import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Users, Image, Clock } from "lucide-react";

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  portfolioItems: number;
  recentBookings: Array<{
    id: number;
    first_name: string;
    last_name: string;
    created_at: string;
    status: string;
  }>;
}

export function Overview() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pendingBookings: 0,
    portfolioItems: 0,
    recentBookings: [],
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: totalBookings },
          { count: pendingBookings },
          { count: portfolioItems },
          { data: recentBookings },
        ] = await Promise.all([
          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),
          supabase
            .from('portfolio')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('bookings')
            .select('id, first_name, last_name, created_at, status')
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        setStats({
          totalBookings: totalBookings || 0,
          pendingBookings: pendingBookings || 0,
          portfolioItems: portfolioItems || 0,
          recentBookings: recentBookings || [],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Bookings
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            All time bookings
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Bookings
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingBookings}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting response
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Portfolio Items
          </CardTitle>
          <Image className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.portfolioItems}</div>
          <p className="text-xs text-muted-foreground">
            Published works
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {booking.first_name} {booking.last_name}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
