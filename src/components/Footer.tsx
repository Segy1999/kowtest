import { Facebook, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t mt-20 relative z-30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Kow Tattys</h3>
            <p className="text-muted-foreground">
              Creating unique and meaningful tattoo experiences since 2020.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-muted-foreground hover:text-foreground">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-muted-foreground hover:text-foreground">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/policy" className="text-muted-foreground hover:text-foreground">
                  Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">              
              <a href="https://www.instagram.com/kowtattys/" className="text-muted-foreground hover:text-foreground">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="mailto:kowtattys@gmail.com" className="text-muted-foreground hover:text-foreground">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kow Tattys. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;