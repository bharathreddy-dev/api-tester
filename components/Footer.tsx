"use client";

import React, { useState, FormEvent, Fragment } from 'react';
import Link from 'next/link';
import { X, Mail, User, MessageSquare } from 'lucide-react';

// A simple SVG for the brand logo
const BrandLogo = () => (
    <svg width="32" height="32" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.75 108.5L5 67L41.75 25.5H102.5V5L130 32.5V101.5L102.5 129V108.5H41.75Z" fill="url(#paint0_linear_1_2)" stroke="url(#paint1_linear_1_2)" strokeWidth="4"/>
        <path d="M44.5 105.75L8.25 67L44.5 28.25H99.75V8.25L126.75 35.25V98.75L99.75 125.75V105.75H44.5Z" stroke="black" strokeOpacity="0.1" strokeWidth="1"/>
        <path d="M62 55.5L78.5 72M78.5 55.5L62 72" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="5" y1="67" x2="130" y2="67" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9"/>
                <stop offset="1" stopColor="#22d3ee"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="67.5" y1="5" x2="67.5" y2="129" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9" stopOpacity="0.5"/>
                <stop offset="1" stopColor="#0ea5e9"/>
            </linearGradient>
        </defs>
    </svg>
);


const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.602.75Zm-1.28,12.36h1.44L3.02 2.16H1.61Z"/>
    </svg>
);

interface NavItem {
    name: string;
    href: string;
}

const navItems: NavItem[] = [
    { name: 'Home', href: '#hero' },
    { name: 'API Tester', href: '#api-handler' },
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Get Started', href: '#cta' },
];

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    if (!isOpen) return null;

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Randomly succeed or fail for demo purposes
        if (Math.random() > 0.2) {
            setStatus('success');
        } else {
            setStatus('error');
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-md transform rounded-2xl bg-slate-800/80 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-lg transition-all">
                <div className="p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>

                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <h3 className="text-2xl font-bold text-sky-400 mb-2">Thank You!</h3>
                            <p className="text-slate-300">Your message has been sent. We'll get back to you shortly.</p>
                        </div>
                    ) : (
                        <Fragment>
                             <h2 id="modal-title" className="text-2xl font-bold text-center mb-1">Get In Touch</h2>
                             <p className="text-center text-slate-400 mb-6">Let's build something great together.</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input type="text" placeholder="Your Name" required className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-3 pl-10 pr-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all" />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input type="email" placeholder="Your Email" required className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-3 pl-10 pr-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all" />
                                </div>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-4 text-slate-400" size={20} />
                                    <textarea placeholder="Your Message" required rows={4} className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-3 pl-10 pr-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all resize-none"></textarea>
                                </div>
                                {status === 'error' && <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>}
                                <button type="submit" disabled={status === 'submitting'} className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center">
                                    {status === 'submitting' ? (
                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Send Message'}
                                </button>
                            </form>
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Footer() {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <>
            <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        <div className="col-span-2 lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <BrandLogo />
                                <span className="text-white text-xl font-bold">API-Forge</span>
                            </div>
                            <p className="text-sm max-w-xs">
                                A modern, Postman-style API client for seamless request handling and testing, right in your browser.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="bg-sky-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                >
                                    Contact Us
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Navigation</h3>
                            <ul className="mt-4 space-y-3">
                                {navItems.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-base hover:text-sky-400 transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Legal</h3>
                            <ul className="mt-4 space-y-3">
                                <li>
                                    <Link href="#" className="text-base hover:text-sky-400 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base hover:text-sky-400 transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Follow Us</h3>
                            <div className="flex mt-4 space-x-5">
                                <Link href="#" className="text-slate-400 hover:text-sky-400 transition-colors" aria-label="GitHub">
                                    <GithubIcon />
                                </Link>
                                <Link href="#" className="text-slate-400 hover:text-sky-400 transition-colors" aria-label="Twitter">
                                    <TwitterIcon />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-sm text-center sm:text-left">
                            &copy; {new Date().getFullYear()} API-Forge. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
            <ContactModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}