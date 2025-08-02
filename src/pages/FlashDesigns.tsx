import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSupabase } from '@/hooks/use-supabase';
import { FlashDesign } from '@/lib/types';
import { CustomTattooForm, CustomTattooFormData } from "@/components/booking/CustomTattooForm";
import { useToast } from "@/components/ui/use-toast";

const FlashDesigns = () => {
  const [selectedDesign, setSelectedDesign] = useState<FlashDesign | null>(null);
  const [flashDesigns, setFlashDesigns] = useState<FlashDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const { getFlashDesigns, createFlashDesignBooking } = useSupabase();
  const { toast } = useToast();

  // For initial setup, we'll use mock data
  useEffect(() => {
    const fetchFlashDesigns = async () => {
      try {
        setLoading(true);
        const designs = await getFlashDesigns();
        
        if (designs && designs.length > 0) {
          setFlashDesigns(designs);
        } else {
          // Fallback to mock data if no designs are found
          // This is useful during development or if the database is empty
          const mockDesigns: FlashDesign[] = [
            {
              id: 1,
              title: "Traditional Rose",
              description: "Classic American traditional rose design with bold lines and vibrant colors.",
              image_url: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1000",
              price: 150,
              category: "Traditional",
              available: true
            },
            {
              id: 2,
              title: "Minimalist Moon",
              description: "Simple, elegant crescent moon design perfect for wrists or ankles.",
              image_url: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?q=80&w=1000",
              price: 100,
              category: "Minimalist",
              available: true
            },
            {
              id: 3,
              title: "Geometric Wolf",
              description: "Modern geometric wolf design with clean lines and abstract elements.",
              image_url: "https://images.unsplash.com/photo-1590246814883-57c629a5bdd7?q=80&w=1000",
              price: 200,
              category: "Geometric",
              available: true
            },
            {
              id: 4,
              title: "Floral Mandala",
              description: "Intricate mandala design with floral elements, perfect for larger placements.",
              image_url: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1000",
              price: 250,
              category: "Mandala",
              available: true
            },
            {
              id: 5,
              title: "Snake and Dagger",
              description: "Bold traditional design featuring a snake wrapped around a dagger.",
              image_url: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?q=80&w=1000",
              price: 180,
              category: "Traditional",
              available: true
            },
            {
              id: 6,
              title: "Botanical Line Art",
              description: "Delicate botanical illustration with fine line work.",
              image_url: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=1000",
              price: 120,
              category: "Fine Line",
              available: true
            },
            {
              id: 7,
              title: "Cosmic Whale",
              description: "Dreamy whale silhouette with cosmic elements and stars.",
              image_url: "https://images.unsplash.com/photo-1584191088800-8a294d8372f6?q=80&w=1000",
              price: 220,
              category: "Illustrative",
              available: true
            },
            {
              id: 8,
              title: "Small Heart",
              description: "Simple, classic heart design perfect for a small, subtle tattoo.",
              image_url: "https://images.unsplash.com/photo-1571805341302-f857308690e3?q=80&w=1000",
              price: 80,
              category: "Minimalist",
              available: true
            },
            {
              id: 9,
              title: "Japanese Wave",
              description: "Traditional Japanese-inspired wave design with dynamic movement.",
              image_url: "https://images.unsplash.com/photo-1611501267219-5a71d8d8f2c5?q=80&w=1000",
              price: 200,
              category: "Japanese",
              available: true
            }
          ];
          
          setFlashDesigns(mockDesigns);
        }
      } catch (error) {
        console.error('Error fetching flash designs:', error);
        // Fallback to mock data on error
        const mockDesigns: FlashDesign[] = [
          {
            id: 1,
            title: "Traditional Rose",
            description: "Classic American traditional rose design with bold lines and vibrant colors.",
            image_url: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1000",
            price: 150,
            category: "Traditional",
            available: true
          },
          {
            id: 2,
            title: "Minimalist Moon",
            description: "Simple, elegant crescent moon design perfect for wrists or ankles.",
            image_url: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?q=80&w=1000",
            price: 100,
            category: "Minimalist",
            available: true
          },
          {
            id: 3,
            title: "Geometric Wolf",
            description: "Modern geometric wolf design with clean lines and abstract elements.",
            image_url: "https://images.unsplash.com/photo-1590246814883-57c629a5bdd7?q=80&w=1000",
            price: 200,
            category: "Geometric",
            available: true
          },
          {
            id: 4,
            title: "Floral Mandala",
            description: "Intricate mandala design with floral elements, perfect for larger placements.",
            image_url: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1000",
            price: 250,
            category: "Mandala",
            available: true
          },
          {
            id: 5,
            title: "Snake and Dagger",
            description: "Bold traditional design featuring a snake wrapped around a dagger.",
            image_url: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?q=80&w=1000",
            price: 180,
            category: "Traditional",
            available: true
          },
          {
            id: 6,
            title: "Botanical Line Art",
            description: "Delicate botanical illustration with fine line work.",
            image_url: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=1000",
            price: 120,
            category: "Fine Line",
            available: true
          },
          {
            id: 7,
            title: "Cosmic Whale",
            description: "Dreamy whale silhouette with cosmic elements and stars.",
            image_url: "https://images.unsplash.com/photo-1584191088800-8a294d8372f6?q=80&w=1000",
            price: 220,
            category: "Illustrative",
            available: true
          },
          {
            id: 8,
            title: "Small Heart",
            description: "Simple, classic heart design perfect for a small, subtle tattoo.",
            image_url: "https://images.unsplash.com/photo-1571805341302-f857308690e3?q=80&w=1000",
            price: 80,
            category: "Minimalist",
            available: true
          },
          {
            id: 9,
            title: "Japanese Wave",
            description: "Traditional Japanese-inspired wave design with dynamic movement.",
            image_url: "https://images.unsplash.com/photo-1611501267219-5a71d8d8f2c5?q=80&w=1000",
            price: 200,
            category: "Japanese",
            available: true
          }
        ];
        
        setFlashDesigns(mockDesigns);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashDesigns();
  }, [getFlashDesigns]);

  const handleBookDesign = (design: FlashDesign) => {
    // Close the design detail dialog
    setSelectedDesign(null);
    // Open the booking form
    setIsBookingFormOpen(true);
  };

  const handleBookingFormClose = () => {
    setIsBookingFormOpen(false);
  };

  const handleBookingFormBack = () => {
    setIsBookingFormOpen(false);
    // Optionally reopen the design detail
    if (selectedDesign) {
      setSelectedDesign(selectedDesign);
    }
  };

  const handleBookingFormSubmit = async (data: CustomTattooFormData) => {
    if (!selectedDesign) return;
    
    try {
      // Format the data for the API
      await createFlashDesignBooking({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        flash_design_id: selectedDesign.id,
        tattoo_size: data.tattooSize,
        tattoo_placement: data.tattooPlacement,
        preferred_date: null, // We don't collect a specific date
        availability: data.availability, // We collect availability days
        pronouns: data.pronouns,
        allergies: data.allergies,
        special_requests: data.tattooIdea // Use the tattoo idea field for any special notes
      });
      
      // Close the form
      setIsBookingFormOpen(false);
      
      // Show success message
      toast({
        title: "Booking Request Submitted",
        description: "We'll contact you soon to confirm your appointment for your flash design.",
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-background flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-primary border-r-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4"
        >
          Flash Designs
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Browse our collection of ready-to-tattoo flash designs. Click on any design to see details and book your appointment.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashDesigns.map((design) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: design.id * 0.1 }}
              className="group relative cursor-pointer"
              onClick={() => setSelectedDesign(design)}
            >
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src={design.image_url} 
                  alt={design.title} 
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 rounded-lg">
                <h3 className="text-white text-xl font-bold mb-2">{design.title}</h3>
                <p className="text-white/80 text-center mb-2">{design.description}</p>
                <p className="text-white font-bold">${design.price}</p>
                <ArrowRight className="text-white mt-4" />
              </div>
            </motion.div>
          ))}
        </div>

        <Dialog 
          open={!!selectedDesign} 
          onOpenChange={(open) => !open && setSelectedDesign(null)}
        >
          <DialogContent className="max-w-5xl w-full bg-background p-0">
            <AnimatePresence>
              {selectedDesign && (
                <div className="relative">
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                  >
                    <X size={24} />
                  </button>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <div className="aspect-square w-full">
                      <img
                        src={selectedDesign.image_url}
                        alt={selectedDesign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-6 bg-background">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            {selectedDesign.title}
                          </h2>
                          <p className="text-muted-foreground mb-4">
                            {selectedDesign.description}
                          </p>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {selectedDesign.category}
                            </span>
                            {selectedDesign.available ? (
                              <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">
                                Available
                              </span>
                            ) : (
                              <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end mt-4 md:mt-0">
                          <p className="text-2xl font-bold mb-2">${selectedDesign.price}</p>
                          <Button 
                            onClick={() => handleBookDesign(selectedDesign)}
                            disabled={!selectedDesign.available}
                            className="flex items-center gap-2"
                          >
                            <ShoppingCart size={18} />
                            Book This Design
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>

        <CustomTattooForm
          isOpen={isBookingFormOpen}
          onClose={handleBookingFormClose}
          onBack={handleBookingFormBack}
          onSubmit={handleBookingFormSubmit}
          flashDesign={selectedDesign}
          startAtStep={4}
        />
      </div>
    </div>
  );
};

export default FlashDesigns; 