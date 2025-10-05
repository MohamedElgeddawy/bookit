'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import logo from '@/assets/images/logo.svg';
import {
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaBuilding,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import destroySession from '@/app/actions/destroySession';
import { useAuth } from '@/context/authContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthenticated, setIsAuthenticated, user, isLoading } = useAuth();

  const handleLogout = async () => {
    const { success, error } = await destroySession();

    if (success) {
      setIsAuthenticated(false);
      router.push('/login');
    } else {
      toast.error(error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-900">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                className="h-12 w-12"
                src={logo}
                alt="Bookit"
                priority={true}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Rooms
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      href="/bookings"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Bookings
                    </Link>
                    <Link
                      href="/rooms/add"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Add Room
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Right Side Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-2">
              <ThemeToggle />
              {!isLoading && (
                <>
                  {!isAuthenticated && (
                    <>
                      <Link
                        href="/login"
                        className="mr-3 text-gray-800 hover:text-gray-600 transition-colors"
                      >
                        <FaSignInAlt className="inline mr-1" /> Login
                      </Link>
                      <Link
                        href="/register"
                        className="mr-3 text-gray-800 hover:text-gray-600 transition-colors"
                      >
                        <FaUser className="inline mr-1" /> Register
                      </Link>
                    </>
                  )}

                  {isAuthenticated && (
                    <>
                      <Link
                        href="/rooms/my"
                        className="mr-3 text-gray-800 hover:text-gray-600 transition-colors"
                      >
                        <FaBuilding className="inline mr-1" /> My Rooms
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="mx-3 text-gray-800 hover:text-gray-600 transition-colors"
                      >
                        <FaSignOutAlt className="inline mr-1" /> Sign Out
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-2">
              <ThemeToggle />
            </div>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Rooms
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/bookings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Bookings
                </Link>
                <Link
                  href="/rooms/add"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add Room
                </Link>
                <Link
                  href="/rooms/my"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaBuilding className="inline mr-2" /> My Rooms
                </Link>
              </>
            )}

            {!isLoading && (
              <>
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaSignInAlt className="inline mr-2" /> Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaUser className="inline mr-2" /> Register
                    </Link>
                  </>
                )}

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Sign Out
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
