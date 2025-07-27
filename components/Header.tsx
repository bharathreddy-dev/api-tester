"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

// Define the type for navigation items
interface NavItem {
  name: string;
  href: string;
}

// Navigation data for the header
const navItems: NavItem[] = [
  { name: 'Home', href: '#hero' },
  { name: 'API Tester', href: '#api-handler' },
  { name: 'Features', href: '#features' },
  { name: 'Testimonials', href: '#testimonials' },
];

// A separate component for the contact modal dialog
const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Prevents modal from closing when clicking inside the content
  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className="relative w-full max-w-lg p-8 mx-4 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl text-white transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
        onClick={handleModalContentClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 id="modal-title" className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Get Started</h2>
        <p className="text-gray-400 mb-6">Let's connect. Fill out the form below and we'll get back to you shortly.</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Your message..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

// The main Header component
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (isModalOpen || isMenuOpen) ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isModalOpen, isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const openModal = () => {
    setIsModalOpen(true);
    closeMenu();
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <style jsx global>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="#hero" className="flex items-center space-x-2" onClick={closeMenu} aria-label="APIForge Home">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                <path d="M13.4142 2.58579C14.1953 1.80474 15.4616 1.80474 16.2426 2.58579L21.4142 7.75736C22.1953 8.53841 22.1953 9.80474 21.4142 10.5858L16.2426 15.7574C15.4616 16.5384 14.1953 16.5384 13.4142 15.7574L8.24264 10.5858C7.46159 9.80474 7.46159 8.53841 8.24264 7.75736L13.4142 2.58579Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5858 21.4142C9.80474 22.1953 8.53841 22.1953 7.75736 21.4142L2.58579 16.2426C1.80474 15.4616 1.80474 14.1953 2.58579 13.4142L7.75736 8.24264C8.53841 7.46159 9.80474 7.46159 10.5858 8.24264L15.7574 13.4142C16.5384 14.1953 16.5384 15.4616 15.7574 16.2426L10.5858 21.4142Z" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-white">APIForge</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  {item.name}
                </Link>
              ))}
              {/* This link from the original list is now the button */}
              <Link href="#cta" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Get Started</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={openModal}
                className="hidden md:inline-block px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300"
              >
                Contact Sales
              </button>
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-label="Toggle menu"
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`md:hidden absolute top-20 left-0 w-full bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-[150%]'}`}>
            <div className="px-2 pt-2 pb-8 space-y-1 sm:px-3 flex flex-col items-center">
              {[...navItems, {name: "Get Started", href:"#cta"}].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-3 rounded-md text-base font-medium w-full text-center"
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={openModal}
                className="w-full max-w-xs mt-4 px-5 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Contact Sales
              </button>
            </div>
        </div>
      </header>
      
      <ContactModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Header;