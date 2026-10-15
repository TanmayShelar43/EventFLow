
import React, { useState, useEffect, useCallback } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import EventSection from './components/EventSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import MyBookings from './components/MyBookings';

const API_BASE = 'http://localhost:5000/api';
const EVENTS_URL = `${API_BASE}/events`;

export default function App() {
  // Events
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [cityTerm, setCityTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  // Authentication
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Booking
  const [bookingEvent, setBookingEvent] = useState(null);
  const [pendingBookingEvent, setPendingBookingEvent] = useState(null);


  const [showMyBookings, setShowMyBookings] = useState(false);

  // Restore the existing login session
  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (active && response.ok && data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Unable to restore session:', err);
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  // Login or signup
  const handleAuthSubmit = async ({ name, email, password, mode }) => {
    const endpoint = mode === 'signup' ? 'signup' : 'login';

    const body =
      mode === 'signup'
        ? { name, email, password }
        : { email, password };

    const response = await fetch(`${API_BASE}/auth/${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    setUser(data.user);
    setAuthModalOpen(false);

    // Continue booking after the user logs in successfully
    if (pendingBookingEvent) {
      setBookingEvent(pendingBookingEvent);
      setPendingBookingEvent(null);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }

      setUser(null);
      setBookingEvent(null);
      setPendingBookingEvent(null);
    } catch (err) {
      console.error('Logout failed:', err);
      window.alert(err.message || 'Unable to log out. Please try again.');
    }
  };

  // Fetch events from the backend
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(EVENTS_URL);

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      const eventList = Array.isArray(data)
        ? data
        : data.events || [];

      setEvents(eventList);
      setFilteredEvents(eventList);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err.message || 'Error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Search and filter events
  const applyFilters = useCallback(() => {
    let result = [...events];

    if (activeCategory) {
      result = result.filter(
        (event) =>
          event.category &&
          event.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();

      result = result.filter(
        (event) =>
          (event.title && event.title.toLowerCase().includes(query)) ||
          (event.venue && event.venue.toLowerCase().includes(query)) ||
          (event.category && event.category.toLowerCase().includes(query))
      );
    }

    if (cityTerm.trim()) {
      const query = cityTerm.trim().toLowerCase();

      result = result.filter(
        (event) =>
          event.city && event.city.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(result);
  }, [events, activeCategory, searchTerm, cityTerm]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Scroll to event listing after search
  const handleSearchSubmit = () => {
    document
      .getElementById('all-events')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  // Open booking, requesting login first if necessary
  const handleBookClick = (event) => {
    if (authLoading) {
      window.alert('Please wait while we check your login session.');
      return;
    }

    if (!user) {
      setPendingBookingEvent(event);
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    setBookingEvent(event);
  };

  // Open login/signup modal from the navbar
  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // Close authentication modal
  const handleAuthClose = () => {
    setAuthModalOpen(false);
    setPendingBookingEvent(null);
  };

  
return (
  <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#121316]">
    <Navbar
      onSearchClick={handleSearchSubmit}
      user={user}
      authLoading={authLoading}
      onAuthClick={handleAuthClick}
      onLogout={handleLogout}
    />

    {user && (
      <div className="border-b border-black/5 bg-[#FAF8F5] px-4 py-3 text-right">
        <button
          onClick={() => setShowMyBookings(true)}
          className="rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-800 transition hover:bg-violet-500/20"
        >
          My Bookings
        </button>
      </div>
    )}

    {showMyBookings ? (
      <MyBookings
        onBack={() => setShowMyBookings(false)}
      />
    ) : (
      <>
        <main className="flex-grow">
          <Hero
            searchSearchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchCity={cityTerm}
            setSearchCity={setCityTerm}
            onSearchSubmit={handleSearchSubmit}
          />

          <CategorySection
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <EventSection
            events={filteredEvents}
            loading={loading}
            error={error}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onBookClick={handleBookClick}
          />
        </main>

        <Footer />
      </>
    )}

    {authModalOpen && (
      <AuthModal
        initialMode={authMode}
        onClose={handleAuthClose}
        onSubmit={handleAuthSubmit}
      />
    )}

    {bookingEvent && user && (
      <BookingModal
        event={bookingEvent}
        onClose={() => setBookingEvent(null)}
      />
    )}
  </div>
);

}
