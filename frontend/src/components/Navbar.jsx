"use client";
import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { FaPhoneAlt, FaTimes, FaBars, FaHome, FaBox, FaCar, FaCalendarAlt, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

const navItems = [
    { name: "Home",      link: "/",        icon: <FaHome /> },
    { name: "Packages",  link: "/packages", icon: <FaBox /> },
    { name: "Vehicles",  link: "/vehicles", icon: <FaCar /> },
    { name: "Book Ride", link: "/booking",  icon: <FaCalendarAlt /> },
    { name: "About",     link: "/about",    icon: <FaInfoCircle /> },
    { name: "Contact",   link: "/contact",  icon: <FaEnvelope /> },
];

/* ──────────────────────────────────────────────
   LOGO
────────────────────────────────────────────── */
export const NavbarLogo = ({ visible, onClick }) => (
    <Link 
        to="/" 
        onClick={(e) => {
            window.scrollTo(0, 0);
            if (onClick) onClick(e);
        }} 
        className="relative z-20 flex items-center gap-0.5 shrink-0 select-none"
    >
        <span
            style={{ color: visible ? "#1e3a8a" : "#ffffff" }}
            className="font-black text-xl sm:text-2xl tracking-tight transition-colors duration-300"
        >
            JAYAM
        </span>
        <span className="text-india-saffron-500 font-black text-xl sm:text-2xl tracking-tight">
            &nbsp;Travels
        </span>
    </Link>
);

/* ──────────────────────────────────────────────
   DESKTOP NAVBAR
────────────────────────────────────────────── */
export const Navbar = ({ children, className }) => {
    const ref = useRef(null);
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setVisible(latest > 80);
    });

    return (
        <div
            ref={ref}
            className={cn("fixed inset-x-0 top-0 z-50 w-full transition-all duration-300", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child, { visible })
                    : child
            )}
        </div>
    );
};

export const NavBody = ({ children, className, visible }) => (
    <div
        style={{
            width: visible ? '92%' : '100%',
            maxWidth: visible ? '1100px' : '100%',
            marginTop: visible ? '10px' : '0px',
            borderRadius: visible ? '9999px' : '0px',
            paddingTop: visible ? '10px' : '18px',
            paddingBottom: visible ? '10px' : '18px',
            paddingLeft: visible ? '24px' : '32px',
            paddingRight: visible ? '24px' : '32px',
            backgroundColor: visible ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0)',
            boxShadow: visible ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
        }}
        className={cn(
            "relative z-[60] mx-auto hidden lg:flex flex-row items-center justify-between self-start transition-all duration-300 ease-in-out",
            className,
        )}
    >
        {React.Children.map(children, (child) =>
            React.isValidElement(child)
                ? React.cloneElement(child, { visible })
                : child
        )}
    </div>
);

export const NavItems = ({ items, className, onItemClick, visible }) => {
    const [hovered, setHovered] = useState(null);
    const location = useLocation();

    return (
        <div
            onMouseLeave={() => setHovered(null)}
            className={cn("hidden flex-1 flex-row items-center justify-center gap-0 text-sm font-medium lg:flex", className)}
        >
            {items.map((item, idx) => {
                const isActive = location.pathname === item.link;
                return (
                    <Link
                        key={`link-${idx}`}
                        onMouseEnter={() => setHovered(idx)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={(e) => {
                            window.scrollTo(0, 0);
                            if (onItemClick) onItemClick(e);
                        }}
                        to={item.link}
                        style={{
                            color: hovered === idx || isActive
                                ? "#f97316"
                                : visible ? "#1f2937" : "#ffffff",
                        }}
                        className="relative px-3 py-2 font-semibold transition-colors duration-200 whitespace-nowrap"
                    >
                        <span className="relative z-20">{item.name}</span>
                        <span
                            style={{
                                transform: (hovered === idx || isActive) ? "scaleX(1)" : "scaleX(0)",
                                backgroundColor: "#f97316",
                            }}
                            className="absolute bottom-0 left-0 h-0.5 w-full origin-left transition-transform duration-300 rounded-full"
                        />
                    </Link>
                );
            })}
        </div>
    );
};

/* ──────────────────────────────────────────────
   MOBILE BOTTOM-SHEET NAVBAR
────────────────────────────────────────────── */
const MobileNavbar = ({ visible }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Close on route change
    useEffect(() => { setIsOpen(false); }, [location.pathname]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Mobile top bar — Logo + Hamburger */}
            <div
                style={{
                    backgroundColor: visible ? 'rgba(255,255,255,0.97)' : 'rgba(0,0,0,0.15)',
                    backdropFilter: visible ? 'none' : 'blur(6px)',
                    WebkitBackdropFilter: visible ? 'none' : 'blur(6px)',
                    boxShadow: visible ? '0 2px 16px rgba(0,0,0,0.10)' : 'none',
                    paddingTop: visible ? '10px' : '14px',
                    paddingBottom: visible ? '10px' : '14px',
                }}
                className="lg:hidden flex items-center justify-between px-5 transition-all duration-300"
            >
                <NavbarLogo visible={visible} />

                {/* Hamburger */}
                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90"
                    style={{
                        backgroundColor: visible ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.18)',
                    }}
                >
                    <FaBars style={{ color: visible ? '#1f2937' : '#ffffff' }} size={18} />
                </button>
            </div>

            {/* Backdrop */}
            <div
                onClick={() => setIsOpen(false)}
                className="lg:hidden fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                style={{
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                }}
            />

            {/* Bottom Sheet */}
            <div
                className="lg:hidden fixed bottom-0 left-0 right-0 z-[80] bg-white transition-transform duration-300 ease-out"
                style={{
                    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
                    maxHeight: '85vh',
                }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-200 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                    <NavbarLogo visible={true} />
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-90 transition-all"
                    >
                        <FaTimes size={15} className="text-gray-500" />
                    </button>
                </div>

                {/* Nav grid — 2 columns, app-icon style */}
                <nav className="px-4 py-4 grid grid-cols-2 gap-3">
                    {navItems.map((item, idx) => {
                        const isActive = location.pathname === item.link;
                        return (
                            <Link
                                key={`sheet-link-${idx}`}
                                to={item.link}
                                onClick={() => {
                                    window.scrollTo(0, 0);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95",
                                    isActive
                                        ? "bg-india-blue-600 text-white shadow-md shadow-india-blue-500/25"
                                        : "bg-gray-50 text-gray-700 hover:bg-india-blue-50 hover:text-india-blue-700"
                                )}
                            >
                                <span className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-xl text-sm flex-shrink-0",
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "bg-white text-india-blue-500 shadow-sm"
                                )}>
                                    {item.icon}
                                </span>
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom safe area padding */}
                <div style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)', minHeight: '16px' }} />
            </div>
        </>
    );
};


/* ──────────────────────────────────────────────
   COMPLETE NAVBAR (Desktop + Mobile)
────────────────────────────────────────────── */
const NavbarDemo = () => {
    return (
        <div className="w-full">
            <Navbar>
                {/* Desktop — hidden on mobile via lg:flex */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <a
                        href="tel:+917030571513"
                        className="call-blink relative flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 shrink-0"
                        aria-label="Call us now"
                    >
                        <FaPhoneAlt className="text-xs" />
                        <span>Call Now</span>
                    </a>
                </NavBody>

                {/* Mobile Drawer — visible prop auto-injected by Navbar via cloneElement */}
                <MobileNavbar />
            </Navbar>
        </div>
    );
};


export default NavbarDemo;
export { MobileNavbar };
