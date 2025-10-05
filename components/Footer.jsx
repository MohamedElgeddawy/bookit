import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="py-6 bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {year} Bookit. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
