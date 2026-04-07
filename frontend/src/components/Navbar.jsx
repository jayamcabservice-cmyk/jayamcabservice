"use client";
import React, { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { FaPhoneAlt } from 'react-icons/fa';

/**
 * Main Navbar Component
 * Fixed top navigation with scroll-based styling changes
 */
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

/**
 * Desktop Navigation Body
 * Transforms from transparent full-width to white rounded pill on scroll
 */
export const NavBody = ({ children, className, visible }) => {
    return (
        <div
            style={{
                width: visible ? '90%' : '100%',
                maxWidth: visible ? '960px' : '100%',
                marginTop: visible ? '12px' : '0px',
                borderRadius: visible ? '9999px' : '0px',
                paddingTop: visible ? '10px' : '18px',
                paddingBottom: visible ? '10px' : '18px',
                paddingLeft: visible ? '24px' : '32px',
                paddingRight: visible ? '24px' : '32px',
                backgroundColor: visible ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0)',
                boxShadow: visible ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
            }}
            className={cn(
                "relative z-[60] mx-auto hidden flex-row items-center justify-between self-start lg:flex transition-all duration-350 ease-in-out",
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
};

/**
 * Navigation Items (Desktop)
 * Hover effects with smooth transitions
 */
export const NavItems = ({ items, className, onItemClick, visible }) => {
    const [hovered, setHovered] = useState(null);

    return (
        <div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "hidden flex-1 flex-row items-center justify-center gap-0 text-sm font-medium lg:flex",
                className,
            )}
        >
            {items.map((item, idx) => (
                <Link
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={onItemClick}
                    to={item.link}
                    style={{
                        color: hovered === idx
                            ? "#f97316"
                            : visible ? "#1f2937" : "#ffffff",
                    }}
                    className="relative px-3 py-2 font-semibold transition-colors duration-200 whitespace-nowrap"
                    key={`link-${idx}`}
                >
                    <span className="relative z-20">{item.name}</span>
                    <span
                        style={{
                            transform: hovered === idx ? "scaleX(1)" : "scaleX(0)",
                            backgroundColor: "#f97316",
                        }}
                        className="absolute bottom-0 left-0 h-0.5 w-full origin-left transition-transform duration-300 rounded-full"
                    />
                </Link>
            ))}
        </div>
    );
};

/**
 * Mobile Navigation Container
 */
export const MobileNav = ({ children, className, visible }) => {
    return (
        <div
            style={{
                backgroundColor: visible ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0)',
                boxShadow: visible ? '0 4px 20px rgba(0,0,0,0.10)' : 'none',
                paddingTop: visible ? '10px' : '14px',
                paddingBottom: visible ? '10px' : '14px',
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full flex-col items-center justify-between px-4 lg:hidden transition-all duration-300 ease-in-out",
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
};

/**
 * Mobile Navigation Header
 */
export const MobileNavHeader = ({ children, className }) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};

/**
 * Mobile Navigation Menu (Dropdown)
 */
export const MobileNavMenu = ({ children, className, isOpen, onClose }) => {
    return (
        <>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-300"
                        onClick={onClose}
                    />
                    <div
                        className={cn(
                            "absolute left-0 right-0 top-full mt-2 z-50 flex w-full max-h-[80vh] overflow-y-auto flex-col items-start justify-start gap-4 rounded-2xl bg-white px-6 py-8 shadow-xl animate-in slide-in-from-top-4 duration-300 lg:hidden",
                            className,
                        )}
                    >
                        {children}
                    </div>
                </>
            )}
        </>
    );
};

/**
 * Mobile Menu Toggle Button
 */
export const MobileNavToggle = ({ isOpen, onClick, visible }) => {
    return (
        <button
            onClick={onClick}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
            {isOpen ? (
                <IconX style={{ color: visible ? "#1f2937" : "#ffffff" }} size={28} />
            ) : (
                <IconMenu2 style={{ color: visible ? "#1f2937" : "#ffffff" }} size={28} />
            )}
        </button>
    );
};

/**
 * Logo Component
 */
export const NavbarLogo = ({ visible }) => {
    return (
        <Link
            to="/"
            className="relative z-20 mr-2 sm:mr-4 flex items-center space-x-1 px-2 py-1 shrink-0"
        >
            <span
                style={{ color: visible ? "#1e3a8a" : "#ffffff" }}
                className="font-bold text-base sm:text-lg transition-colors duration-300"
            >
                JAYAM
            </span>
            <span className="text-india-saffron-500 font-bold text-base sm:text-lg"> Travels</span>
        </Link>
    );
};

/**
 * Navigation Button Component
 */
export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    visible,
    ...props
}) => {
    const baseStyles =
        "px-3 sm:px-4 py-2 rounded-full whitespace-nowrap shrink-0 text-xs sm:text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary: visible
            ? "bg-india-blue-700 text-white shadow-md hover:bg-india-blue-800"
            : "bg-white text-gray-900 shadow-md hover:bg-gray-100",
        secondary: visible
            ? "bg-transparent text-gray-800"
            : "bg-transparent text-white",
        dark: "bg-black text-white shadow-md",
        gradient:
            "bg-gradient-to-b from-blue-500 to-blue-700 text-white",
    };

    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Tag>
    );
};

/**
 * Complete Navbar Demo with all navigation items
 * Ready to use component for your app
 */
const NavbarDemo = () => {
    const navItems = [
        { name: "Home",     link: "/" },
        { name: "Packages", link: "/packages" },
        { name: "Vehicles", link: "/vehicles" },
        { name: "Book Ride",link: "/booking" },
        { name: "About",    link: "/about" },
        { name: "Contact",  link: "/contact" },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="w-full">
            <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    {/* Call Now CTA — right side, desktop only */}
                    <a
                        href="tel:+917972732871"
                        className="call-btn-glow relative flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 shrink-0"
                        aria-label="Call us now"
                    >
                        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25 pointer-events-none" />
                        <FaPhoneAlt className="animate-wiggle text-xs relative z-10" />
                        <span className="relative z-10">Call Now</span>
                    </a>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <Link
                                key={`mobile-link-${idx}`}
                                to={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300 text-lg font-medium py-2 hover:text-india-blue-600 transition-colors w-full"
                            >
                                <span className="block">{item.name}</span>
                            </Link>
                        ))}
                        {/* No call button in mobile menu — floating call button handles it */}
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
};

export default NavbarDemo;
