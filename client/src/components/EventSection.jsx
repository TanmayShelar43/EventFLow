import React from 'react';
import EventCard from './EventCard';

export default function EventSection({
  events,
  loading,
  error,
  activeCategory,
  setActiveCategory,
  searchTerm,
  setSearchTerm,
  onBookClick
}) {
  const featuredEvent = events.length > 0 ? events[0] : null;
  const regularEvents = events.length > 1 ? events.slice(1) : events;

  return (
    <section id="all-events" className="py-16">
      <div className="container-desktop space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EBE7E0] pb-6">
          <div>
            <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Curated Live Events</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#121316] mt-1">
              Explore All <span className="font-serif-italic text-[#4F46E5]">Events</span>
            </h2>
          </div>

          {/* Filters & Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {['All', 'Music & Concerts', 'Comedy', 'Workshops', 'Arts & Culture'].map((cat) => {
              const catKey = cat === 'All' ? '' : cat;
              const isActive = activeCategory.toLowerCase() === catKey.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(catKey)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#121316] text-white shadow-sm' 
                      : 'bg-white text-[#575861] border border-[#E2DDD5] hover:border-[#CBD5E1]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-[#575861]">Fetching live events...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto">
            <p className="text-sm font-semibold text-rose-800">Unable to load events</p>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#E2DDD5] p-8 max-w-md mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-[#121316]">No events found</h3>
            <p className="text-xs text-[#8E8F99] mt-1">Try resetting your search query or selecting a different category.</p>
            <button 
              onClick={() => { setActiveCategory(''); setSearchTerm(''); }}
              className="mt-4 px-4 py-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Featured Asymmetric Layout (When non-filtered) */}
        {!loading && !error && !activeCategory && !searchTerm && featuredEvent && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8F99]">Featured Highlight</h3>
            <EventCard
  event={featuredEvent}
  featured={true}
  onBookClick={onBookClick}
/>
          </div>
        )}

        {/* Event Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="space-y-6">
            {(!activeCategory && !searchTerm && featuredEvent) && (
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8F99] pt-4">More Upcoming Events</h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {((!activeCategory && !searchTerm) ? regularEvents : events).map((event, idx) => (
  <EventCard
    key={event.id || idx}
    event={event}
    onBookClick={onBookClick}
  />
))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}