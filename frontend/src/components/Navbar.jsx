import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-primary-600 text-white'
        : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-semibold text-lg text-gray-800 hidden sm:block">
              Consultation Recording Manager
            </span>
            <span className="font-semibold text-lg text-gray-800 sm:hidden">
              CRM
            </span>
          </Link>

          <div className="flex gap-2">
            <Link to="/" className={linkClass('/')}>
              Dashboard
            </Link>
            <Link to="/upload" className={linkClass('/upload')}>
              Upload
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;