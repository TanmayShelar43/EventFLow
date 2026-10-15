
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/bookings";

const money = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const dateLabel = (date) => {
  if (!date) return "Date to be announced";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Date to be announced";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

export default function MyBookings({ onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchBookings() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load bookings.");
        }

        if (!cancelled) setBookings(data.bookings || []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-[75vh] bg-[#0c0c10] px-4 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={onBack}
          className="mb-7 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <span>←</span> Back to events
        </button>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
              Your EventFlow account
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              My Bookings
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Your tickets, event details and booking history.
            </p>
          </div>

          {!loading && (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300">
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center text-gray-400">
            Loading your bookings...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-white/10 px-5 py-2 text-sm hover:bg-white/15"
            >
              Refresh page
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-400/10 text-3xl">
              🎟️
            </div>

            <h2 className="text-xl font-bold">No bookings yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
              Your next great experience is waiting. Explore events and book
              your first ticket.
            </p>

            <button
              onClick={onBack}
              className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500"
            >
              Explore events
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {bookings.map((booking) => {
              const event = booking.event;
              const items = booking.items || [];

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#15151b] transition hover:border-violet-400/30"
                >
                  <div className="grid sm:grid-cols-[190px_1fr]">
                    <div className="relative min-h-44 overflow-hidden bg-gradient-to-br from-violet-950 via-[#24203b] to-[#15151b]">
                      {event?.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl">
                          🎟️
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                      <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium">
                        {event?.category || "Event"}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold">
                            {event?.title || "Event details unavailable"}
                          </h2>
                          <p className="mt-2 text-sm text-gray-400">
                            {event?.venue || "Venue unavailable"}
                            {event?.city ? `, ${event.city}` : ""}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                            booking.status === "confirmed"
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : booking.status === "cancelled"
                              ? "border-red-400/20 bg-red-400/10 text-red-300"
                              : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
                        <div>
                          <p className="text-xs text-gray-500">Event date</p>
                          <p className="mt-1 text-sm font-medium">
                            {dateLabel(event?.event_date)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Tickets</p>
                          <p className="mt-1 text-sm font-medium">
                            {booking.ticket_count ?? 0}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Total amount</p>
                          <p className="mt-1 text-sm font-bold text-violet-300">
                            {money(booking.total_amount)}
                          </p>
                        </div>
                      </div>

                      {items.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {items.map((item) => {
                            const label = item.seat
                              ? `Row ${item.seat.row_label}, Seat ${item.seat.seat_number}`
                              : item.zone?.name
                              ? `${item.zone.name} × ${item.quantity}`
                              : `${item.quantity} ticket(s)`;

                            return (
                              <span
                                key={item.id}
                                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-300"
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <p className="text-xs text-gray-500">
                          Booking ID: #{booking.id}
                        </p>

                        <p className="text-xs text-gray-500">
                          Booked on {dateLabel(booking.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
