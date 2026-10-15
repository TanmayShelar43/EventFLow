
import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000/api";

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

export default function BookingModal({ event, onClose }) {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadInventory() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE}/inventory/${event.id}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load tickets");
        }

        if (!active) return;

        setInventory(data);

        const firstAvailableZone = data.zones?.find(
          (zone) => Number(zone.available_tickets) > 0
        );

        if (firstAvailableZone) {
          setSelectedZoneId(String(firstAvailableZone.id));
        }
      } catch (err) {
        if (active) setError(err.message || "Unable to load inventory");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInventory();

    return () => {
      active = false;
    };
  }, [event.id]);

  const isSeatMode = inventory?.mode === "seats";

  const selectedZone = useMemo(
    () =>
      inventory?.zones?.find(
        (zone) => String(zone.id) === selectedZoneId
      ),
    [inventory, selectedZoneId]
  );

  const selectedSeatObjects = useMemo(() => {
    if (!inventory) return [];

    return inventory.seats.filter((seat) =>
      selectedSeats.includes(Number(seat.id))
    );
  }, [inventory, selectedSeats]);

  const total = isSeatMode
    ? selectedSeatObjects.reduce(
        (sum, seat) => sum + Number(seat.price),
        0
      )
    : Number(selectedZone?.price || 0) * quantity;

  const toggleSeat = (seat) => {
    if (seat.status !== "available" || submitting) return;

    const id = Number(seat.id);

    setSelectedSeats((current) => {
      if (current.includes(id)) {
        return current.filter((seatId) => seatId !== id);
      }

      if (current.length >= 10) {
        setError("You can select a maximum of 10 seats per booking.");
        return current;
      }

      setError("");
      return [...current, id];
    });
  };

  const handleZoneChange = (zoneId) => {
    setSelectedZoneId(zoneId);
    setQuantity(1);
    setError("");
  };

  const handleBooking = async () => {
    if (isSeatMode && selectedSeats.length === 0) {
      setError("Please select at least one available seat.");
      return;
    }

    if (
      !isSeatMode &&
      (!selectedZone || Number(selectedZone.available_tickets) < quantity)
    ) {
      setError("Please select an available ticket zone and quantity.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const body = isSeatMode
        ? {
            eventId: Number(event.id),
            seatIds: selectedSeats,
          }
        : {
            eventId: Number(event.id),
            zoneId: Number(selectedZoneId),
            quantity,
          };

      const response = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Booking failed. Please try again.");
      }

      setBookingResult(data.booking);
    } catch (err) {
      setError(err.message || "Unable to complete your booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const seatsByRow = useMemo(() => {
    if (!inventory?.seats) return {};

    return inventory.seats.reduce((rows, seat) => {
      if (!rows[seat.row_label]) rows[seat.row_label] = [];
      rows[seat.row_label].push(seat);
      return rows;
    }, {});
  }, [inventory]);

  const rowLabels = Object.keys(seatsByRow).sort(
    (a, b) => a.localeCompare(b, undefined, { numeric: true })
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Book tickets for ${event.title}`}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#E2DDD5] bg-[#FAF8F5] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#E2DDD5] bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5]">
              EventFlow · Ticket booking
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-[#121316] sm:text-2xl">
              {event.title}
            </h2>
            <p className="mt-1 text-sm text-[#575861]">
              {event.venue || "Venue TBD"}
              {event.city ? `, ${event.city}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close booking"
            className="rounded-full border border-[#E2DDD5] bg-white px-3 py-2 text-lg text-[#121316] hover:bg-[#F4EFEA] disabled:opacity-50"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading && (
            <div className="py-16 text-center text-sm text-[#575861]">
              Loading live ticket availability...
            </div>
          )}

          {!loading && error && !inventory && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="ml-2 font-bold underline"
              >
                Reload
              </button>
            </div>
          )}

          {!loading && inventory && !bookingResult && (
            <>
              {isSeatMode ? (
                <section>
                  <div className="mb-5 text-center">
                    <div className="mx-auto mb-3 h-2 w-3/4 rounded-full bg-gradient-to-r from-indigo-200 via-[#4F46E5] to-indigo-200 shadow-sm" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#575861]">
                      Stage / Screen
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#575861]">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm border border-[#D6D3D1] bg-white" />
                      Available
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-[#4F46E5]" />
                      Selected
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-[#D6D3D1]" />
                      Booked
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm border border-amber-400 bg-amber-100" />
                      Premium
                    </span>
                  </div>

                  <div className="mt-7 space-y-4">
                    {rowLabels.map((rowLabel) => (
                      <div
                        key={rowLabel}
                        className="flex items-center justify-center gap-2 sm:gap-4"
                      >
                        <span className="w-5 text-xs font-extrabold text-[#575861]">
                          {rowLabel}
                        </span>

                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                          {seatsByRow[rowLabel]
                            .sort(
                              (a, b) =>
                                Number(a.seat_number) -
                                Number(b.seat_number)
                            )
                            .map((seat) => {
                              const selected = selectedSeats.includes(
                                Number(seat.id)
                              );
                              const unavailable = seat.status !== "available";
                              const premium = seat.seat_type === "premium";

                              return (
                                <button
                                  key={seat.id}
                                  type="button"
                                  title={`${rowLabel}${seat.seat_number} · ${formatINR(seat.price)} · ${unavailable ? "Booked" : premium ? "Premium" : "Regular"}`}
                                  aria-pressed={selected}
                                  aria-label={`Row ${rowLabel}, seat ${seat.seat_number}, ${unavailable ? "booked" : selected ? "selected" : "available"}`}
                                  disabled={unavailable || submitting}
                                  onClick={() => toggleSeat(seat)}
                                  className={`flex h-8 w-8 items-center justify-center rounded-t-lg rounded-b-sm border text-[10px] font-bold transition sm:h-9 sm:w-9 sm:text-xs ${
                                    unavailable
                                      ? "cursor-not-allowed border-[#D6D3D1] bg-[#D6D3D1] text-[#78716C]"
                                      : selected
                                      ? "border-[#4F46E5] bg-[#4F46E5] text-white ring-2 ring-indigo-200"
                                      : premium
                                      ? "border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200"
                                      : "border-[#D6D3D1] bg-white text-[#121316] hover:border-[#4F46E5] hover:bg-indigo-50"
                                  }`}
                                >
                                  {seat.seat_number}
                                </button>
                              );
                            })}
                        </div>

                        <span className="w-5 text-right text-xs text-[#8E8F99]">
                          {rowLabel}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl bg-white p-4">
                    <p className="text-sm font-bold text-[#121316]">
                      Selected seats
                    </p>
                    <p className="mt-1 text-sm text-[#575861]">
                      {selectedSeatObjects.length
                        ? selectedSeatObjects
                            .map((seat) => `${seat.row_label}${seat.seat_number}`)
                            .join(", ")
                        : "Choose your seats from the map above."}
                    </p>
                    <p className="mt-2 text-xs text-[#8E8F99]">
                      Premium seats are priced separately.
                    </p>
                  </div>
                </section>
              ) : (
                <section>
                  <h3 className="text-lg font-extrabold text-[#121316]">
                    Choose your ticket zone
                  </h3>
                  <p className="mt-1 text-sm text-[#575861]">
                    Select a zone and the number of tickets you need.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {inventory.zones.map((zone) => {
                      const selected = String(zone.id) === selectedZoneId;
                      const soldOut = Number(zone.available_tickets) < 1;

                      return (
                        <button
                          type="button"
                          key={zone.id}
                          disabled={soldOut || submitting}
                          onClick={() => handleZoneChange(String(zone.id))}
                          className={`rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-[#4F46E5] bg-indigo-50 ring-2 ring-indigo-100"
                              : "border-[#E2DDD5] bg-white hover:border-[#4F46E5]"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          <span className="text-sm font-extrabold text-[#121316]">
                            {zone.name}
                          </span>
                          <span className="mt-3 block text-xl font-extrabold text-[#4F46E5]">
                            {formatINR(zone.price)}
                          </span>
                          <span className="mt-2 block text-xs text-[#575861]">
                            {soldOut
                              ? "Sold out"
                              : `${zone.available_tickets} tickets available`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedZone && (
                    <div className="mt-6 rounded-2xl border border-[#E2DDD5] bg-white p-5">
                      <label
                        htmlFor="ticket-quantity"
                        className="block text-sm font-bold text-[#121316]"
                      >
                        Number of tickets
                      </label>
                      <div className="mt-3 flex items-center gap-4">
                        <button
                          type="button"
                          disabled={quantity <= 1 || submitting}
                          onClick={() => setQuantity((q) => q - 1)}
                          className="h-10 w-10 rounded-full border border-[#E2DDD5] text-lg font-bold disabled:opacity-40"
                        >
                          −
                        </button>

                        <span
                          id="ticket-quantity"
                          className="min-w-8 text-center text-lg font-extrabold"
                        >
                          {quantity}
                        </span>

                        <button
                          type="button"
                          disabled={
                            quantity >=
                              Math.min(10, Number(selectedZone.available_tickets)) ||
                            submitting
                          }
                          onClick={() => setQuantity((q) => q + 1)}
                          className="h-10 w-10 rounded-full border border-[#E2DDD5] text-lg font-bold disabled:opacity-40"
                        >
                          +
                        </button>
                        <span className="text-xs text-[#8E8F99]">
                          Maximum 10 tickets per booking
                        </span>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {error && (
                <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </p>
              )}
            </>
          )}

          {bookingResult && (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
                ✓
              </div>
              <h3 className="mt-5 text-2xl font-extrabold text-[#121316]">
                Booking confirmed!
              </h3>
              <p className="mt-2 text-sm text-[#575861]">
                Your ticket booking has been saved successfully.
              </p>
              <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#E2DDD5] bg-white p-5 text-left">
                <p className="text-xs text-[#8E8F99]">Booking ID</p>
                <p className="mt-1 font-extrabold text-[#121316]">
                  #{bookingResult.booking_id}
                </p>
                <p className="mt-4 text-xs text-[#8E8F99]">Total amount</p>
                <p className="mt-1 text-2xl font-extrabold text-[#4F46E5]">
                  {formatINR(bookingResult.total_amount)}
                </p>
                <p className="mt-3 text-xs text-[#575861]">
                  Tickets: {bookingResult.ticket_count}
                </p>
              </div>
            </div>
          )}
        </div>

        {!loading && inventory && (
          <footer className="border-t border-[#E2DDD5] bg-white p-4 sm:p-5">
            {!bookingResult ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-[#8E8F99]">
                    Total amount · INR
                  </p>
                  <p className="text-2xl font-extrabold text-[#121316]">
                    {formatINR(total)}
                  </p>
                  <p className="text-xs text-[#575861]">
                    {isSeatMode
                      ? `${selectedSeats.length} seat(s) selected`
                      : `${quantity} ticket(s)${selectedZone ? ` · ${selectedZone.name}` : ""}`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={
                    submitting ||
                    (isSeatMode
                      ? selectedSeats.length === 0
                      : !selectedZone ||
                        Number(selectedZone.available_tickets) < quantity)
                  }
                  className="rounded-full bg-[#4F46E5] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Confirming..." : "Confirm booking"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white hover:bg-[#4338CA]"
              >
                Done
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
