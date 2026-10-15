import React from 'react';

export default function Hero({ searchSearchTerm, setSearchTerm, searchCity, setSearchCity, onSearchSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <section id="hero" className="pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      <div className="container-desktop">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse"></span>
          Live Curated Experiences
        </div>

        {/* Editorial Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Headline & Search Bar */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#121316] tracking-tight leading-[1.15]">
              Your Next <span className="font-serif-italic text-[#4F46E5] font-normal">Unforgettable</span> Moment Starts Here
            </h1>

            <p className="text-lg text-[#575861] max-w-xl font-normal leading-relaxed">
              Discover concerts, stand-up comedy, hands-on masterclasses, and art exhibitions happening right around you.
            </p>

            {/* Premium Integrated Search Form */}
            <form 
              onSubmit={handleSubmit}
              className="p-2.5 bg-white rounded-2xl md:rounded-full border border-[#E2DDD5] shadow-lg flex flex-col md:flex-row items-stretch md:items-center gap-2 mt-8"
            >
              {/* Event Search Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-[#EBE7E0]">
                <svg className="w-5 h-5 text-[#8E8F99] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input 
                  type="text"
                  placeholder="Search events, artists, keywords..."
                  value={searchSearchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-[#121316] placeholder-[#8E8F99] text-sm font-medium focus:outline-none"
                />
              </div>

              {/* City Filter Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <svg className="w-5 h-5 text-[#8E8F99] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <input 
                  type="text"
                  placeholder="Location / City..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-[#121316] placeholder-[#8E8F99] text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="px-8 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-xl md:rounded-full shadow-md transition-all duration-200 shrink-0"
              >
                Find Events
              </button>
            </form>

            {/* Stat Counters */}
            <div className="pt-4 flex items-center gap-8 border-t border-[#EBE7E0]">
              <div>
                <p className="text-2xl font-bold text-[#121316]">500+</p>
                <p className="text-xs text-[#8E8F99] font-medium">Curated Events</p>
              </div>
              <div className="w-px h-8 bg-[#EBE7E0]"></div>
              <div>
                <p className="text-2xl font-bold text-[#121316]">40+</p>
                <p className="text-xs text-[#8E8F99] font-medium">Cities Covered</p>
              </div>
              <div className="w-px h-8 bg-[#EBE7E0]"></div>
              <div>
                <p className="text-2xl font-bold text-[#121316]">99.4%</p>
                <p className="text-xs text-[#8E8F99] font-medium">Satisfied Attendees</p>
              </div>
            </div>
          </div>

          {/* Hero Feature Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E2DDD5]">
              <img 
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80" 
                alt="Live Concert Highlight" 
                className="w-full h-[460px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F43F5E] text-white uppercase tracking-wider">Spotlight</span>
                <h3 className="text-xl font-bold mt-2">Neon Symphony World Tour</h3>
                <p className="text-xs text-slate-200 mt-1 flex items-center gap-2">
                  <span>📍 Grand Arena Stadium</span>
                  <span>•</span>
                  <span>🎟️ From $85</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}