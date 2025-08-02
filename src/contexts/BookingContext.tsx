import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { BookingPopup } from "@/components/booking/BookingPopup";
import { CustomTattooForm, CustomTattooFormData } from "@/components/booking/CustomTattooForm";
import { toast } from "sonner";
import { useSupabase } from "@/hooks/use-supabase";

type BookingOption = "custom" | "flash" | null;
type BookingStep = "initial" | "custom-form" | "flash-gallery" | null;

interface BookingContextType {
  openBookingFlow: () => void;
  closeBookingFlow: () => void;
  currentStep: BookingStep;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<BookingStep>(null);
  const { createBooking, uploadImage } = useSupabase();
  
  // Add debugging logs
  useEffect(() => {
    console.log("Booking state changed:", { isOpen, currentStep });
  }, [isOpen, currentStep]);

  const openBookingFlow = () => {
    console.log("Opening booking flow");
    setIsOpen(true);
    setCurrentStep("initial");
  };

  const closeBookingFlow = () => {
    console.log("Closing booking flow");
    setIsOpen(false);
    setCurrentStep(null);
  };

  const handleOptionSelect = (option: BookingOption) => {
    console.log("Option selected:", option);
    if (option === "custom") {
      setCurrentStep("custom-form");
    } else if (option === "flash") {
      setCurrentStep("flash-gallery");
      // We'll implement the flash gallery later
      toast.info("Flash gallery coming soon! This feature is under development.");
    }
  };

  const uploadReferencePhotos = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      // Create a clean filename
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
      const timestamp = Date.now();
      const path = `${timestamp}-${cleanFileName}`;
      
      const url = await uploadImage(file, path);
      if (!url) {
        throw new Error(`Failed to upload ${file.name}`);
      }
      return url;
    });

    return Promise.all(uploadPromises);
  };

  const handleCustomFormSubmit = async (data: CustomTattooFormData) => {
    try {
      console.log("Form submitted:", data);
      
      // Show loading toast
      const loadingToast = toast.loading("Uploading photos and submitting your request...");
      
      // Upload reference photos first
      let referencePhotos: string[] = [];
      if (data.referenceImages.length > 0) {
        try {
          referencePhotos = await uploadReferencePhotos(data.referenceImages);
        } catch (error) {
          console.error('Error uploading photos:', error);
          toast.error("Failed to upload some photos, but we'll still submit your request.");
        }
      }
      
      // Format the data for Supabase
      const bookingData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        pronouns: data.pronouns,
        is_custom: true,
        tattoo_idea: data.tattooIdea,
        tattoo_size: data.tattooSize,
        tattoo_placement: data.tattooPlacement,
        reference_photos: referencePhotos,
        availability: data.availability,
        is_over_18: data.isOver18,
        allergies: data.allergies,
        flash_design_id: null,
        status: 'pending' as const,
        special_requests: null,
        admin_notes: null
      };
      
      // Submit to Supabase
      await createBooking(bookingData);
    
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Your custom tattoo request has been submitted! We'll contact you soon to discuss details.", {
        duration: 5000,
      });
      
      closeBookingFlow();
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error("There was an error submitting your booking. Please try again.");
    }
  };

  const handleBackToOptions = () => {
    console.log("Going back to options");
    setCurrentStep("initial");
  };

  return (
    <BookingContext.Provider
      value={{
        openBookingFlow,
        closeBookingFlow,
        currentStep,
      }}
    >
      {children}
      <BookingPopup 
        isOpen={isOpen && currentStep === "initial"} 
        onClose={closeBookingFlow}
        onOptionSelect={handleOptionSelect}
      />
      <CustomTattooForm
        isOpen={isOpen && currentStep === "custom-form"}
        onClose={closeBookingFlow}
        onSubmit={handleCustomFormSubmit}
        onBack={handleBackToOptions}
      />
      {/* We'll add the flash gallery component here later */}
    </BookingContext.Provider>
  );
}; 