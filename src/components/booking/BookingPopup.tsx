import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type BookingOption = "custom" | "flash" | null;

interface BookingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (option: BookingOption) => void;
}

export const BookingPopup = ({ isOpen, onClose, onOptionSelect }: BookingPopupProps) => {
  const navigate = useNavigate();
  
  // Add debugging
  const handleOptionClick = (option: BookingOption) => {
    console.log("Option clicked in popup:", option);
    
    if (option === "flash") {
      // Close the popup
      onClose();
      // Navigate to flash designs page
      navigate("/flash-designs");
    } else {
      onOptionSelect(option);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 md:p-8"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <Card className="max-w-2xl mx-auto border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Book Your Tattoo</CardTitle>
                <CardDescription>Choose an option to get started</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              <Button 
                variant="outline" 
                className="h-auto py-8 flex flex-col gap-2 hover:border-primary"
                onClick={() => handleOptionClick("custom")}
              >
                <span className="text-lg font-semibold">Request a Custom Tattoo</span>
                <span className="text-sm text-muted-foreground">Work with our artists to create a unique design</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-8 flex flex-col gap-2 hover:border-primary"
                onClick={() => handleOptionClick("flash")}
              >
                <span className="text-lg font-semibold">Shop Flash Designs</span>
                <span className="text-sm text-muted-foreground">Browse our collection of ready-to-ink designs</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 