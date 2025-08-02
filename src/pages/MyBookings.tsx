import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Chat from "@/components/chat/Chat";
import { Loader2, MessageSquare } from "lucide-react";
import { format } from 'date-fns';

interface Booking {
  id: string;
  created_at: string;
  status: string;
  is_custom: boolean;
  tattoo_idea?: string;
  flash_design_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tattoo_size?: string;
  tattoo_placement?: string;
  preferred_date?: string;
  special_requests?: string;
}

const MyBookings = () => {
  const user = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForChat, setSelectedBookingForChat] = useState<Booking | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user || !supabase) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching user bookings:", error);
          // You might want to show a toast here
        } else {
          setBookings(data || []);
        }
      } catch (error) {
        console.error("Unexpected error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user]);

  const openChat = (booking: Booking) => {
    if (booking.status !== 'confirmed') {
      alert("Chat is only available for confirmed bookings.");
      return;
    }
    setSelectedBookingForChat(booking);
    setIsChatOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
        <p>Please log in to view your bookings.</p>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen pt-24 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
        <p>Database connection is not available. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">My Bookings</h1>

        {bookings.length === 0 ? (
          <p className="text-center text-muted-foreground">You haven't made any bookings yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle>Booking #{booking.id.substring(0, 6)}...</CardTitle>
                  <CardDescription>
                    Created: {format(new Date(booking.created_at), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Status: </strong>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.is_custom 
                      ? `Custom Idea: ${booking.tattoo_idea?.substring(0, 50)}...` 
                      : `Flash Design ID: ${booking.flash_design_id}`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Size: {booking.tattoo_size || 'Not specified'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Placement: {booking.tattoo_placement || 'Not specified'}
                  </p>
                  {booking.preferred_date && (
                    <p className="text-sm text-muted-foreground">
                      Preferred Date: {format(new Date(booking.preferred_date), 'MMM d, yyyy')}
                    </p>
                  )}
                  <Button
                    onClick={() => openChat(booking)}
                    disabled={booking.status !== 'confirmed'}
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with Artist
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
          {selectedBookingForChat && (
            <>
              <DialogHeader>
                <DialogTitle>Chat for Booking #{selectedBookingForChat.id.substring(0, 6)}...</DialogTitle>
                <DialogDescription>
                  Discuss details about your confirmed booking.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-grow overflow-hidden py-4">
                <Chat bookingId={selectedBookingForChat.id} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBookings; 