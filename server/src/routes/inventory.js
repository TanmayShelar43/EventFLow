
const express = require("express");
const supabaseAdmin = require("../config/supabaseAdmin");

const router = express.Router();

// GET /api/inventory/:eventId
router.get("/:eventId", async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);

    if (!Number.isSafeInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    // Check that the event exists
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("id, title, category, venue, city, event_date, price, total_seats, available_seats")
      .eq("id", eventId)
      .maybeSingle();

    if (eventError) throw eventError;

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Fetch seat-by-seat inventory
    const { data: seats, error: seatsError } = await supabaseAdmin
      .from("event_seats")
      .select("id, row_label, seat_number, seat_type, price, status")
      .eq("event_id", eventId)
      .order("row_label", { ascending: true })
      .order("seat_number", { ascending: true });

    if (seatsError) throw seatsError;

    // Fetch zone-based inventory
    const { data: zones, error: zonesError } = await supabaseAdmin
      .from("event_zones")
      .select("id, name, price, capacity, available_tickets")
      .eq("event_id", eventId)
      .order("price", { ascending: true });

    if (zonesError) throw zonesError;

    return res.json({
      success: true,
      event,
      mode: seats.length > 0 ? "seats" : "zones",
      seats,
      zones,
    });
  } catch (error) {
    console.error("Inventory fetch error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load event inventory",
    });
  }
});

module.exports = router;
