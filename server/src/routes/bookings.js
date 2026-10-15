
const express = require("express");
const supabaseAdmin = require("../config/supabaseAdmin");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();



router.get("/", requireAuth, async (req, res) => {
  try {
    const { data: bookings, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("id, event_id, status, total_amount, created_at")
      .eq("user_id", req.userId)
      .order("created_at", { ascending: false });

    if (bookingError) throw bookingError;

    if (!bookings || bookings.length === 0) {
      return res.json({ success: true, bookings: [] });
    }

    const bookingIds = bookings.map((b) => b.id);
    const eventIds = [...new Set(bookings.map((b) => b.event_id))];

    const [
      { data: events, error: eventsError },
      { data: items, error: itemsError },
    ] = await Promise.all([
      supabaseAdmin
        .from("events")
        .select("id, title, category, venue, city, event_date, image_url")
        .in("id", eventIds),

      supabaseAdmin
        .from("booking_items")
        .select("id, booking_id, seat_id, zone_id, quantity, unit_price")
        .in("booking_id", bookingIds),
    ]);

    if (eventsError) throw eventsError;
    if (itemsError) throw itemsError;

    const seatIds = [
      ...new Set((items || []).map((i) => i.seat_id).filter(Boolean)),
    ];
    const zoneIds = [
      ...new Set((items || []).map((i) => i.zone_id).filter(Boolean)),
    ];

    let seats = [];
    let zones = [];

    if (seatIds.length) {
      const result = await supabaseAdmin
        .from("event_seats")
        .select("id, row_label, seat_number")
        .in("id", seatIds);

      if (result.error) throw result.error;
      seats = result.data || [];
    }

    if (zoneIds.length) {
      const result = await supabaseAdmin
        .from("event_zones")
        .select("id, name")
        .in("id", zoneIds);

      if (result.error) throw result.error;
      zones = result.data || [];
    }

    const eventMap = new Map((events || []).map((e) => [String(e.id), e]));
    const seatMap = new Map((seats || []).map((s) => [String(s.id), s]));
    const zoneMap = new Map((zones || []).map((z) => [String(z.id), z]));

    const result = bookings.map((booking) => {
      const bookingItems = (items || [])
        .filter((item) => String(item.booking_id) === String(booking.id))
        .map((item) => ({
          ...item,
          seat: item.seat_id
            ? seatMap.get(String(item.seat_id)) || null
            : null,
          zone: item.zone_id
            ? zoneMap.get(String(item.zone_id)) || null
            : null,
        }));

      return {
        ...booking,
        event: eventMap.get(String(booking.event_id)) || null,
        items: bookingItems,
        ticket_count: bookingItems.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        ),
      };
    });

    return res.json({ success: true, bookings: result });
  } catch (error) {
    console.error("Fetch bookings error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load your bookings.",
    });
  }
});

// POST /api/bookings
// Body for cinema: { eventId: 12, seatIds: [101, 102] }
// Body for concert: { eventId: 12, zoneId: 5, quantity: 2 }
router.post("/", requireAuth, async (req, res) => {
  try {
    const { eventId, seatIds, zoneId, quantity } = req.body;
    const userId = Number(req.userId);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid user session. Please log in again.",
      });
    }

    if (
      !Number.isSafeInteger(eventId) ||
      eventId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid eventId is required",
      });
    }

    const isSeatBooking = Array.isArray(seatIds);
    const isZoneBooking = zoneId !== undefined && zoneId !== null;

    if (isSeatBooking === isZoneBooking) {
      return res.status(400).json({
        success: false,
        message: "Provide either seatIds or zoneId and quantity",
      });
    }

    let parsedSeatIds = null;
    let parsedZoneId = null;
    let parsedQuantity = null;

    if (isSeatBooking) {
      if (
        seatIds.length < 1 ||
        seatIds.length > 10 ||
        !seatIds.every(
          (id) => Number.isSafeInteger(id) && id > 0
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Select between 1 and 10 valid seats",
        });
      }

      if (new Set(seatIds).size !== seatIds.length) {
        return res.status(400).json({
          success: false,
          message: "Duplicate seats were selected",
        });
      }

      parsedSeatIds = seatIds;
    } else {
      if (
        !Number.isSafeInteger(zoneId) ||
        zoneId <= 0 ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
      ) {
        return res.status(400).json({
          success: false,
          message: "Provide a valid zoneId and quantity between 1 and 10",
        });
      }

      parsedZoneId = zoneId;
      parsedQuantity = quantity;
    }

    const { data, error } = await supabaseAdmin.rpc(
      "create_event_booking",
      {
        p_user_id: userId,
        p_event_id: eventId,
        p_seat_ids: parsedSeatIds,
        p_zone_id: parsedZoneId,
        p_zone_quantity: parsedQuantity,
      }
    );

    if (error) {
      const message = error.message || "";

      if (
        /already booked|no longer available|not enough|invalid|not found|duplicate seats|select seats|choose between/i.test(
          message
        )
      ) {
        return res.status(409).json({
          success: false,
          message: "Those tickets are unavailable. Refresh and try again.",
        });
      }

      console.error("Booking database error:", error.code);

      return res.status(500).json({
        success: false,
        message: "Unable to complete booking",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Booking confirmed",
      booking: data,
    });
  } catch (error) {
    console.error("Booking error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while booking",
    });
  }
});

module.exports = router;
