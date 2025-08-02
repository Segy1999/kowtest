import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { Loader2, MessageSquare } from "lucide-react";
import Chat from "@/components/chat/Chat";

interface Booking {
  id: string; // Changed to string since we're using UUIDs
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  preferred_date: string | null;
  special_requests: string | null;
  status: string;
  created_at: string;
  is_custom: boolean;
  tattoo_idea?: string;
  flash_design_id?: number;
}

export function BookingSettings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch bookings",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Booking ${status}`,
      });

      setSelectedBooking(null);
      await fetchBookings();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
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
      <Card>
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    {booking.first_name} {booking.last_name}
                  </TableCell>
                  <TableCell>
                    {booking.preferred_date
                      ? format(new Date(booking.preferred_date), 'MMM d, yyyy')
                      : 'No preference'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedBooking} onOpenChange={(isOpen) => !isOpen && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Review, manage, and chat about the booking request
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2 border-b pb-4">
                  <h4 className="font-medium">Contact Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Name: {selectedBooking.first_name} {selectedBooking.last_name}<br />
                    Email: {selectedBooking.email}<br />
                    Phone: {selectedBooking.phone}
                  </p>
                  {selectedBooking.special_requests && (
                    <div className="pt-2">
                      <h4 className="font-medium">Special Requests</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedBooking.special_requests}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mb-4">
                  {selectedBooking.status !== 'confirmed' && (
                    <Button
                      variant="outline"
                      onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                    >
                      Confirm Booking
                    </Button>
                  )}
                  {selectedBooking.status !== 'rejected' && (
                    <Button
                      variant="destructive"
                      onClick={() => updateBookingStatus(selectedBooking.id, 'rejected')}
                    >
                      Reject Booking
                    </Button>
                  )}
                </div>

                {selectedBooking.status === 'confirmed' && (
                  <div className="border-t pt-4">
                    <Chat bookingId={selectedBooking.id} />
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
