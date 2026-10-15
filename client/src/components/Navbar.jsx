
import React, { useState, useEffect } from 'react';

export default function Navbar({
  onSearchClick,
  user,
  authLoading,
  onAuthClick,
  onLogout,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-[#EBE7E0] shadow-sm py-3.5'
          : 'bg-[#FAF8F5] py-5 border-b border-transparent'
      }`}
    >
      <div className="container-desktop flex items-center justify-between gap-3">
        <a href="#hero" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#6366F1] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            EF
          </div>

          <span className="text-xl font-bold tracking-tight text-[#121316]">
            Event<span className="text-[#4F46E5]">Flow</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[#575861]">
          <a href="#hero" className="hover:text-[#121316]">Discover</a>
          <a href="#categories" className="hover:text-[#121316]">Categories</a>
          <a href="#all-events" className="hover:text-[#121316]">Featured</a>
          <a href="#all-events" className="hover:text-[#121316]">All Events</a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
           className="px-3 py-2 text-sm font-semibold text-[#4F46E5] bg-white border border-[#4F46E5] rounded-full hover:bg-indigo-50 shadow-sm"
          >
            Search
          </button>

          <a
            href="#all-events"
            className="px-4 py-2.5 text-sm font-semibold text-[#4F46E5] bg-white border border-[#4F46E5] rounded-full hover:bg-indigo-50"
          >
            Explore Events
          </a>

          {!authLoading && (
            user ? (
              <div className="flex items-center gap-2">
                <span
                  className="hidden lg:inline text-sm font-semibold text-[#575861] max-w-32 truncate"
                  title={user.name}
                >
                  Hi, {user.name.split(' ')[0]}
                </span>

                <button
                  onClick={onLogout}
                  className="px-4 py-2.5 text-sm font-semibold text-[#4F46E5] border border-[#4F46E5] rounded-full hover:bg-indigo-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAuthClick('login')}
                  className="px-4 py-2.5 text-sm font-semibold text-[#4F46E5] bg-white border border-[#4F46E5] rounded-full hover:bg-indigo-50"
                >
                  Login
                </button>

                <button
                  onClick={() => onAuthClick('signup')}
                  className="px-4 py-2.5 text-sm font-semibold text-[#4F46E5] bg-white border border-[#4F46E5] rounded-full hover:bg-indigo-50"
                >
                  Sign up
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
