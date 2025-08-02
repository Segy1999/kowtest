import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch"
import { useBooking } from "@/contexts/BookingContext";
import { useUser } from '@supabase/auth-helpers-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const { openBookingFlow } = useBooking();
  const user = useUser();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
        updateTheme(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    updateTheme(isDark);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark;
    setIsDark(!isDark);
    updateTheme(!newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Portfolio", path: "/portfolio" },
    { title: "Book Now", action: openBookingFlow },
    { title: "Policy", path: "/policy" },
    { title: "Contact", path: "/contact" },
    ...(user ? [{ title: "My Bookings", path: "/my-bookings" }] : []),
  ];

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-doto text-4xl font-bold">
            KowTattys
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              item.action ? (
                <button
                  key={item.title}
                  onClick={item.action}
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.title}
                </button>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.title}
                </Link>
              )
            ))}
            {/* Theme Toggle Switch */}
            <div className="flex items-center space-x-2">
              <Sun size={16} className="text-foreground/80" />
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-slate-800"
              />
              <Moon size={16} className="text-foreground/80" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                item.action ? (
                  <button
                    key={item.title}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                )
              ))}
              {/* Mobile Theme Toggle */}
              <div className="flex items-center space-x-2 px-3 py-2">
                <Sun size={16} className="text-foreground/80" />
                <Switch
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-slate-800"
                />
                <Moon size={16} className="text-foreground/80" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;