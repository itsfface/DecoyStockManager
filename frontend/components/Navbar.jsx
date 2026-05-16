"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/useAuthStore.js';

// Helper to extract initials for the avatar (e.g., "Sahin Mallick" -> "SM")
const getInitials = (name) => {
    if (!name) return "";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
};

export function Navbar() {
    const router = useRouter();
    const { me, user, logout } = useAuthStore();
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isMac, setIsMac] = useState(true); 
    
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Initial load for user data & OS detection
    useEffect(() => {
        me();
        setIsMac(typeof window !== "undefined" && navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);
    }, [me]);

    // Handle click outside for profile dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle CMD+K / CTRL+K to focus search safely
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsMobileSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 50);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogOut = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    return (
        <header className="h-[68px] bg-white/60 backdrop-blur-2xl border-b border-neutral-200/50 sticky top-0 z-50 w-full flex items-center transition-all duration-300">
            <div className="flex items-center justify-between w-full px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto">

                {/* Left: Mobile Menu & Brand */}
                <div className={`items-center gap-4 ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
                    <Link href="/" className="flex items-center gap-2 outline-none shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-4 focus-visible:ring-offset-white transition-all">
                        <div className="w-24 md:w-[112px] flex items-center">
                            <Image 
                                src="/logo.png"
                                width={112}
                                height={40} 
                                alt="Decoy Logo" 
                                className="object-contain"
                                priority 
                            />
                        </div>
                    </Link>
                </div>

                {/* Center: Search */}
                <div className={`flex-1 max-w-lg md:mx-10 ${isMobileSearchOpen ? 'flex w-full animate-in fade-in slide-in-from-right-4 md:slide-in-from-right-0 duration-300 ease-out' : 'hidden md:flex'}`}>
                    <div className="relative w-full flex items-center group">
                        <svg className="absolute left-3.5 w-[18px] h-[18px] text-neutral-400 group-focus-within:text-neutral-900 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search stores, SKUs..."
                            aria-label="Search"
                            className="w-full pl-10 pr-14 py-2.5 text-sm font-medium text-neutral-900 bg-neutral-100/80 hover:bg-neutral-200/50 focus:bg-white border border-transparent focus:border-neutral-300 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)] rounded-xl outline-none transition-all duration-300 placeholder:text-neutral-400 placeholder:font-normal"
                        />
                        <div className="absolute right-2 flex items-center pointer-events-none">
                            <kbd className="hidden md:flex items-center justify-center h-6 px-2 text-[11px] font-semibold text-neutral-500 border border-neutral-200/80 rounded-[6px] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] tracking-widest font-sans">
                                {isMac ? '⌘K' : 'Ctrl+K'}
                            </kbd>
                        </div>
                    </div>
                    
                    {/* Mobile Search Cancel Button */}
                    {isMobileSearchOpen && (
                        <button 
                            onClick={() => setIsMobileSearchOpen(false)}
                            className="md:hidden ml-4 text-[15px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors active:opacity-70"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {/* Right: Actions */}
                <div className={`items-center gap-1.5 md:gap-4 ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>

                    {/* Mobile Search Trigger */}
                    <button 
                        onClick={() => {
                            setIsMobileSearchOpen(true);
                            setTimeout(() => searchInputRef.current?.focus(), 50);
                        }}
                        aria-label="Open search"
                        className="md:hidden p-2 text-neutral-500 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100 outline-none active:bg-neutral-200"
                    >
                        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>

                    {/* Notifications */}
                    <button 
                        aria-label="Notifications"
                        className="relative p-2.5 text-neutral-500 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 active:bg-neutral-200"
                    >
                        <span className="absolute top-[9px] right-[10px] w-2 h-2 rounded-full bg-neutral-900 border-2 border-white shadow-sm" />
                        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                    </button>

                    <div className="w-[1px] h-6 bg-neutral-200 hidden sm:block mx-1" />

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            aria-expanded={isProfileOpen}
                            aria-haspopup="menu"
                            className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-neutral-900 text-white border border-transparent text-xs font-bold hover:bg-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 shadow-[0_2px_8px_rgba(0,0,0,0.12)] overflow-hidden shrink-0 active:scale-95"
                        >
                            {user?.fullname ? (
                                <span className="tracking-wide">{getInitials(user.fullname)}</span>
                            ) : (
                                <svg className="w-[18px] h-[18px] text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            )}
                        </button>

                        {isProfileOpen && (
                            <div 
                                role="menu"
                                className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl border border-neutral-200/60 rounded-[20px] shadow-[0_24px_54px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.04)] p-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right"
                            >
                                <div className="px-3.5 py-3.5 border-b border-neutral-100/80 mb-2">
                                    <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
                                        {user?.role || 'Guest'}
                                    </p>
                                    <p className="text-[15px] font-bold text-neutral-900 truncate tracking-tight">
                                        {user?.fullname || 'Loading...'}
                                    </p>
                                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100/80 border border-neutral-200/60 text-[11px] font-mono text-neutral-500 font-semibold">
                                            ID: {user?.employeeId || '—'}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100/80 border border-neutral-200/60 text-[11px] text-neutral-500 font-semibold truncate max-w-[140px]">
                                            {user?.store?.storeName || 'No Store'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-0.5 px-1">
                                    <Link 
                                        href="/settings" 
                                        onClick={() => setIsProfileOpen(false)} 
                                        role="menuitem"
                                        className="flex items-center px-3 py-2 text-[14px] font-medium text-neutral-600 rounded-xl hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                                    >
                                        Settings
                                    </Link>
                                    <Link 
                                        href="/support" 
                                        onClick={() => setIsProfileOpen(false)} 
                                        role="menuitem"
                                        className="flex items-center px-3 py-2 text-[14px] font-medium text-neutral-600 rounded-xl hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                                    >
                                        Support
                                    </Link>
                                </div>

                                <div className="mt-1.5 pt-1.5 border-t border-neutral-100/80 px-1">
                                    <button 
                                        onClick={handleLogOut} 
                                        role="menuitem"
                                        className="w-full flex items-center px-3 py-2 text-[14px] font-medium text-red-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}