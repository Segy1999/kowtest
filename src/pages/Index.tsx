import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Particles } from "@/components/ui/particles";
import ShootingStar from "@/components/ui/shooting-star";
import Typewriter from "typewriter-effect";
import FeaturedWorkSection from '@/components/ui/featuredworksection';
import { useBooking } from "@/contexts/BookingContext";

const Index = () => {
  const { openBookingFlow } = useBooking();
  
  const featuredWorks = [
    { id: 1, image: "/images/home/h1.jpeg", alt: "Featured Tattoo 1" },
    { id: 2, image: "/images/home/h2.jpeg", alt: "Featured Tattoo 2" },
    { id: 3, image: "/images/home/h3.jpeg", alt: "Featured Tattoo 3" },
    { id: 4, image: "/images/home/h4.jpeg", alt: "Featured Tattoo 4" },
    { id: 5, image: "/images/home/h5.jpeg", alt: "Featured Tattoo 5" },
    { id: 6, image: "/images/home/h6.jpeg", alt: "Featured Tattoo 6" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black text-white">
        <Particles
          className="absolute inset-0"
          quantity={1000}
          staticity={50}
          ease={50}
          color="#ffffff"
        />
        <ShootingStar />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-20"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-doto mb-6">
            <Typewriter
              options={{
                strings: ["KowTattys"],
                autoStart: true,
                loop: true,
                cursor: "|",
                delay: 100,
              }}
            />
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Where Art Meets Skin
          </p>
          <button
            onClick={openBookingFlow}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-full hover:bg-opacity-90 transition-colors"
          >
            Book Now
            <ArrowRight className="ml-2" size={20} />
          </button>
        </motion.div>
      </section>

      {/* Featured Work Section */}
      <FeaturedWorkSection />

      {/* About Section */}
      <section className="relative z-10 py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Crafting Your Perfect Tattoo
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              With years of experience and a passion for artistic excellence, we bring your ideas to life through stunning, permanent art.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-full hover:bg-opacity-90 transition-colors"
            >
              Get in Touch
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;