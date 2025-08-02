import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {useEffect} from 'react';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Policy from "./pages/Policy";
import Contact from "./pages/Contact";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import AdminSetup from "./pages/admin/setup";
import MyBookings from "./pages/MyBookings";
import { BookingProvider } from "@/contexts/BookingContext";
import FlashDesigns from "./pages/FlashDesigns";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BookingProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/setup" element={<AdminSetup />} />
                <Route path="/flash-designs" element={<FlashDesigns />} />
                <Route path="/my-bookings" element={<MyBookings />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BookingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;