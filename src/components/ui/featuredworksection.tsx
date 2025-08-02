import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabase } from '@/hooks/use-supabase';
import { PortfolioItem } from '@/lib/types';
import { motion } from "framer-motion";

// Local featured work images from public folder
const LOCAL_FEATURED_IMAGES = [
  {
    id: 2001,
    title: 'Featured Tattoo 1',
    description: 'Stunning custom tattoo artwork',
    image_url: '/images/home/h1.jpeg',
    featured: true,
    category: 'custom',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2002,
    title: 'Featured Tattoo 2',
    description: 'Bold and beautiful design',
    image_url: '/images/home/h2.jpeg',
    featured: true,
    category: 'traditional',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2003,
    title: 'Featured Tattoo 3',
    description: 'Intricate detailed work',
    image_url: '/images/home/h3.jpeg',
    featured: true,
    category: 'fine-line',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2004,
    title: 'Featured Tattoo 4',
    description: 'Modern minimalist design',
    image_url: '/images/home/h4.jpeg',
    featured: true,
    category: 'minimalist',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2005,
    title: 'Featured Tattoo 5',
    description: 'Colorful vibrant artwork',
    image_url: '/images/home/h5.jpeg',
    featured: true,
    category: 'color',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2006,
    title: 'Featured Tattoo 6',
    description: 'Unique artistic expression',
    image_url: '/images/home/h6.jpeg',
    featured: true,
    category: 'artistic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const FeaturedWorkSection = () => {
  const [selectedWork, setSelectedWork] = useState<PortfolioItem | null>(null);
  const [featuredWorks, setFeaturedWorks] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useLocalFallback, setUseLocalFallback] = useState(false);
  const { getFeaturedWorks } = useSupabase();

  useEffect(() => {
    const fetchFeaturedWorks = async () => {
      try {
        // Try to fetch from Supabase first
        const supabaseItems = await getFeaturedWorks();
        
        if (supabaseItems && supabaseItems.length > 0) {
          // Create a map to avoid duplicates based on title
          const combinedItems = new Map<string, PortfolioItem>();
          
          // Add Supabase items first
          supabaseItems.forEach(item => {
            combinedItems.set(item.title, item);
          });
          
          // Add local items (they won't override Supabase items with same title)
          LOCAL_FEATURED_IMAGES.forEach(item => {
            if (!combinedItems.has(item.title)) {
              combinedItems.set(item.title, item as PortfolioItem);
            }
          });
          
          setFeaturedWorks(Array.from(combinedItems.values()));
          setUseLocalFallback(false);
        } else {
          // If Supabase fails or returns no items, use local images
          setFeaturedWorks(LOCAL_FEATURED_IMAGES as PortfolioItem[]);
          setUseLocalFallback(true);
        }
      } catch (error) {
        console.error('Error fetching featured works from Supabase, using local fallback:', error);
        // Fallback to local images if Supabase fails
        setFeaturedWorks(LOCAL_FEATURED_IMAGES as PortfolioItem[]);
        setUseLocalFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedWorks();
  }, [getFeaturedWorks]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-background flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-primary border-r-primary rounded-full"
        />
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
          Featured Artworks
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {featuredWorks.map((work, index) => (
            <div
              key={work.id}
              className="group relative aspect-[3/4] rounded-xl border border-black/[0.1] bg-[#FFF0F5] dark:bg-background dark:border-white/[0.2] hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col">
                <h3 className="text-xl font-semibold text-black dark:text-foreground mb-4 relative z-10">
                  {work.title}
                </h3>
                
                <div className="relative flex-grow w-full h-full">
                  <div className="absolute inset-0">
                    <img 
                      src={work.image_url} 
                      alt={work.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        // Fallback to local image if the URL fails to load
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('/images/home/')) {
                          const localImage = LOCAL_FEATURED_IMAGES.find(img => img.title === work.title);
                          if (localImage) {
                            target.src = localImage.image_url;
                          }
                        }
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" 
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between relative z-10">
                  <span className="text-sm text-black/70 dark:text-muted-foreground">
                    Click to view details
                  </span>
                  <span className="text-sm font-medium text-black dark:text-foreground">
                    →
                  </span>
                </div>
              </div>
              
              {/* Clickable overlay */}
              <button
                onClick={() => setSelectedWork(work)}
                className="absolute inset-0 w-full h-full cursor-pointer z-20"
                aria-label={`View ${work.title}`}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12 relative z-30">
          <Link
            to="/portfolio"
            className="inline-flex items-center text-base sm:text-lg font-medium text-black hover:text-tattoo-blue dark:text-foreground dark:hover:text-tattoo-blue transition-colors"
          >
            View Full Portfolio
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>

        <Dialog 
          open={!!selectedWork} 
          onOpenChange={() => setSelectedWork(null)}
        >
          <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] w-auto h-auto bg-[#FFF0F5] p-0 rounded-lg overflow-hidden">
            <div className="relative flex items-center justify-center min-h-[50vh] sm:min-h-[80vh]">
              <button
                onClick={() => setSelectedWork(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              >
                <X size={24} />
              </button>
              {selectedWork && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={selectedWork.image_url}
                    alt={selectedWork.title}
                    className="max-w-full max-h-[80vh] object-contain"
                    style={{ margin: 'auto' }}
                    onError={(e) => {
                      // Fallback to local image if the URL fails to load
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('/images/home/')) {
                        const localImage = LOCAL_FEATURED_IMAGES.find(img => img.title === selectedWork.title);
                        if (localImage) {
                          target.src = localImage.image_url;
                        }
                      }
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {selectedWork.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default FeaturedWorkSection;