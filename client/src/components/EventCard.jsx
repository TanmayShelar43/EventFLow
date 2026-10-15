
import React from 'react';

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80";

export default function EventCard({
  event,
  featured = false,
  onBookClick,
}) {
  const {
    id,
    title,
    category,
    venue,
    city,
    available_seats,
    image_url,
  } = event;

  // Match frontend properties with Supabase column names
  const date = event.event_date ?? event.date;
  const ticketPrice = event.price ?? event.ticket_price;

  const displayImage = image_url || DEFAULT_IMAGE;

  const isSoldOut =
    available_seats !== undefined &&
    available_seats !== null &&
    Number(available_seats) <= 0;

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') {
      return 'Free';
    }

    const amount = Number(price);

    if (!Number.isFinite(amount) || amount <= 0) {
      return 'Free';
    }

    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBD';

    const d = new Date(dateStr);

    if (Number.isNaN(d.getTime())) {
      return 'Date TBD';
    }

    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  };

  // Featured event card
  if (featured) {
    return (
      <div className="group bg-white rounded-2xl border border-[#E2DDD5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-0">
        <div className="md:col-span-7 relative h-64 md:h-auto overflow-hidden">
          <img
            src={displayImage}
            alt={title || 'Event'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {category && (
            <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#121316] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {category}
            </span>
          )}
        </div>

        <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4F46E5] mb-2 uppercase tracking-wide">
              <span>📅 {formatDate(date)}</span>
            </div>

            <h3 className="text-2xl font-bold text-[#121316] group-hover:text-[#4F46E5] transition-colors line-clamp-2">
              {title}
            </h3>

            <p className="text-sm text-[#575861] mt-3 flex items-center gap-1.5">
              <span>
                📍 {venue || 'Venue TBD'}
                {city ? `, ${city}` : ''}
              </span>
            </p>

            {isSoldOut && (
              <p className="mt-3 text-xs font-bold text-rose-600">
                Sold Out
              </p>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-[#EBE7E0] flex items-center justify-between gap-3">
            <div>
              <span className="text-xs text-[#8E8F99] block">
                Starting from
              </span>

              <span className="text-2xl font-extrabold text-[#121316]">
                {formatPrice(ticketPrice)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onBookClick?.(event)}
              disabled={isSoldOut}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-full transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSoldOut ? 'Sold Out' : 'View Details'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular event card
  return (
    <div className="group bg-white rounded-2xl border border-[#E2DDD5] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative h-48 overflow-hidden bg-[#F4EFEA]">
          <img
            src={displayImage}
            alt={title || 'Event'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#121316] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              {category}
            </span>
          )}

          {available_seats !== undefined &&
            available_seats !== null && (
              <span
                className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isSoldOut
                    ? 'bg-rose-100 text-rose-700'
                    : Number(available_seats) < 15
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-900/80 text-white backdrop-blur-sm'
                }`}
              >
                {isSoldOut
                  ? 'Sold Out'
                  : `${available_seats} tickets left`}
              </span>
            )}
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold text-[#4F46E5] mb-1">
            {formatDate(date)}
          </p>

          <h4 className="text-base font-bold text-[#121316] group-hover:text-[#4F46E5] transition-colors line-clamp-1">
            {title}
          </h4>

          <p className="text-xs text-[#575861] mt-2 line-clamp-1">
            📍 {venue || 'Venue TBD'}
            {city ? `, ${city}` : ''}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-[#EBE7E0]/60 flex items-center justify-between mt-auto">
        <div>
          <span className="text-[10px] text-[#8E8F99] block">
            Tickets from
          </span>

          <span className="text-lg font-bold text-[#121316]">
            {formatPrice(ticketPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onBookClick?.(event)}
          disabled={isSoldOut}
          className="px-4 py-1.5 text-xs font-semibold text-[#121316] bg-[#FAF8F5] border border-[#E2DDD5] rounded-full hover:bg-[#4F46E5] hover:text-white hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSoldOut ? 'Sold Out' : 'Book'}
        </button>
      </div>
    </div>
  );
}
