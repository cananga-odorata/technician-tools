import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import DarkModeToggle from "../DarkModeToggle";
import connectusIcon from '/public/connectedSocial-icon-notextbg.png';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = createSignal(false);
    const [isProfileOpen, setIsProfileOpen] = createSignal(false);

    return (
        <>
            <header class="bg-white shadow-md sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">

                        {/* Logo */}
                        <div class="flex-shrink-0">
                            <A href="/" class="text-2xl font-bold text-blue-600 hover:text-blue-700">
                                <img src={connectusIcon} alt='connectus' class='w-12 h-12 inline-block mr-2' />
                            </A>
                        </div>

                        {/* Desktop Navigation */}
                        <nav class="hidden md:flex space-x-8">
                            <A
                                href="/"
                                end
                                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                                activeClass="text-blue-600 bg-blue-50"
                            >
                                Home
                            </A>
                            <A
                                href="/about"
                                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                                activeClass="text-blue-600 bg-blue-50"
                            >
                                About
                            </A>
                            <A
                                href="/contact"
                                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                                activeClass="text-blue-600 bg-blue-50"
                            >
                                Contact
                            </A>
                        </nav>

                        {/* Right Side - Profile & Login */}
                        <div class="hidden md:flex items-center space-x-4">
                            {/* Search Icon */}
                            <button class="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Notification Icon */}
                            <button class="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition relative">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div class="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen())}
                                    class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                >
                                    <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen() && (
                                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                        <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </a>
                                        <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Settings
                                        </a>
                                        <hr class="my-1" />
                                        <a href="/logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            Logout
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Login Button */}
                            <A
                                href="/login"
                                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                            >
                                Login
                            </A>
                        </div>

                        {/* Mobile menu button */}
                        <div class="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen())}
                                class="text-gray-700 hover:text-gray-900 focus:outline-none"
                            >
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMenuOpen() ? (
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="">
                        <DarkModeToggle />
                    </div>
                    {/* Mobile Navigation */}
                    {isMenuOpen() && (
                        <div class="md:hidden pb-4">
                            <div class="flex flex-col space-y-2">
                                <A
                                    href="/"
                                    end
                                    class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                    activeClass="text-blue-600 bg-blue-50"
                                >
                                    Home
                                </A>
                                <A
                                    href="/about"
                                    class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                    activeClass="text-blue-600 bg-blue-50"
                                >
                                    About
                                </A>
                                <A
                                    href="/contact"
                                    class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                    activeClass="text-blue-600 bg-blue-50"
                                >
                                    Contact
                                </A>
                                <hr class="my-2" />
                                <A
                                    href="/login"
                                    class="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium text-center hover:bg-blue-700"
                                >
                                    Login
                                </A>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}