import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo showText={false} className="w-12 h-12" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Virtual Museums
              </a>
              <Link to="/map" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Heritage Map
              </Link>
              {/* <a href="#" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Live Tours
              </a> */}
              <Link to="/customer" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Live Tours
              </Link>
              <a href="#" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Education
              </a>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <select className="text-sm bg-background border border-border rounded-md px-2 py-1 text-foreground">
              <option>English</option>
              <option>አማርኛ</option>
              <option>Afaan Oromoo</option>
            </select>
            <Link
              to="/auth"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-foreground hover:text-primary p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              <a href="#" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
                Virtual Museums
              </a>
              <Link to="/map" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
                Heritage Map
              </Link>
              <a href="#" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
                Live Tours
              </a>
              <a href="#" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
                Education
              </a>
              <div className="flex items-center justify-between px-3 py-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <select className="text-sm bg-background border border-border rounded-md px-2 py-1 text-foreground">
                  <option>English</option>
                  <option>አማርኛ</option>
                  <option>Afaan Oromoo</option>
                </select>
              </div>
              <Link
                to="/auth"
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors mx-3 block text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

