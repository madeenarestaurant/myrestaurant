import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { reservationApi } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Reservations.css";
import { getAssetUrl } from "../config";
import trackingService from "../services/trackingService";


const reservationHall = getAssetUrl("reserve.png");
const familyImg = getAssetUrl("family.jpeg");
const partiesImg = getAssetUrl("parties.jpeg");


const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

const Reservations = () => {
  const [step, setStep] = useState(0); // 0=type, 1=contacts, 2=event, 3=success
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [occupiedSlots, setOccupiedSlots] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventDate: new Date(),
    startTime: "11:00",
    endTime: "14:00",
    guests: 20,
    notes: "",
  });

  const notify = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4500);
  };

  // Fetch occupied slots whenever date changes
  useEffect(() => {
    const dateStr = form.eventDate.toISOString().split("T")[0];
    reservationApi.getOccupiedSlots(dateStr)
      .then((res) => setOccupiedSlots(res.data))
      .catch(() => setOccupiedSlots([]));
  }, [form.eventDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const sendOtp = async () => {
    if (!form.email) return notify("Enter your email first.", true);
    setLoading(true);
    try {
      await reservationApi.sendOtp(form.email);
      setOtpSent(true);
      notify("OTP sent! Check your email.");
    } catch (e) {
      notify(e.response?.data?.message || "Failed to send OTP.", true);
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (!otp) return notify("Enter the OTP.", true);
    setLoading(true);
    try {
      await reservationApi.verifyOtp(form.email, otp, trackingService.visitorId);
      setEmailVerified(true);
      setOtpSent(false);
      notify("Email verified ✓");
    } catch (e) {
      notify(e.response?.data?.message || "Invalid OTP.", true);
    } finally { setLoading(false); }
  };

  const submit = async () => {
    if (!emailVerified) return notify("Verify your email first.", true);
    if (!form.fullName.trim()) return notify("Full name is required.", true);
    if (!form.phone.trim()) return notify("Phone number is required.", true);
    if (!form.guests || form.guests < 1) return notify("Enter number of guests.", true);
    if (!form.startTime || !form.endTime) return notify("Select start and end time.", true);
    if (form.startTime >= form.endTime) return notify("End time must be after start time.", true);

    setLoading(true);
    try {
      await reservationApi.book({
        ...form,
        type,
        eventDate: form.eventDate.toISOString().split("T")[0],
        visitorId: trackingService.visitorId
      });
      setStep(3);
    } catch (e) {
      notify(e.response?.data?.message || "Booking failed.", true);
    } finally { setLoading(false); }
  };

  // Build a human-readable occupied time summary for display
  const occupiedSummary = occupiedSlots.length
    ? occupiedSlots.map((s) => `${s.startTime}–${s.endTime}`).join(", ")
    : null;

  const inputClass =
    "w-full bg-[#0d0d0d] border border-white/8 rounded-2xl py-4 px-5 text-white placeholder-gray-600 focus:border-white/25 outline-none transition-all text-sm";
  const labelClass = "block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans overflow-x-hidden">

      {/* ── Hero ── */}
      <div className="relative w-full h-[75vh] md:h-[90vh] p-4 md:p-6">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
          <Navbar transparent={true} />
          <img
            src={reservationHall}
            alt="Reservation Hall"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[10px] tracking-[0.5em] text-gray-300 uppercase mb-3">
              Madeena Restaurant
            </motion.p>
            <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-serif tracking-widest uppercase mb-4 leading-tight">
              Reservation Hall
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-gray-400 text-sm tracking-widest">
              Celebrate your moments in luxury
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm font-medium shadow-xl border ${
              toast.isError
                ? "bg-red-950/80 border-red-800/40 text-red-300"
                : "bg-white/5 border-white/10 text-white"
            } backdrop-blur-md`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Steps ── */}
      <div className="max-w-4xl mx-auto px-5 py-12 space-y-10">
        <AnimatePresence mode="wait">

          {/* STEP 0 — Event Type */}
          {step === 0 && (
            <motion.div key="s0" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
              <p className="text-center text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-3">Step 1 of 3</p>
              <h2 className="text-center text-2xl font-serif mb-8">What's the occasion?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { id: "Family Function", label: "Family Function", desc: "Weddings · Anniversaries · Birthdays", emoji: "👨‍👩‍👧‍👦", img: familyImg },
                  { id: "Party", label: "Corporate / Party", desc: "Office events · Social gatherings", emoji: "🎉", img: partiesImg },
                ].map((o) => (
                  <button key={o.id}
                    onClick={() => { setType(o.id); setStep(1); }}
                    className="group relative text-left h-[220px] md:h-[260px] rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-500 shadow-xl">
                    {/* Background image */}
                    <img src={o.img} alt={o.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-75" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-7">
                      <span className="text-2xl mb-2">{o.emoji}</span>
                      <p className="text-xl font-serif text-white mb-1">{o.label}</p>
                      <p className="text-gray-400 text-sm mb-4">{o.desc}</p>
                      <span className="text-[10px] tracking-widest text-gray-500 uppercase group-hover:text-gray-300 transition-colors">Select →</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Contact Details */}
          {step === 1 && (
            <motion.div key="s1" variants={fadeUp} initial="hidden" animate="visible" exit="exit"
              className="bg-[#0f0f0f] rounded-[2.5rem] border border-white/5 p-8 md:p-12">
              <p className="text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-1">Step 2 of 3</p>
              <h2 className="text-2xl font-serif mb-8">Contact Details
                <span className="text-sm font-sans ml-3 text-gray-600 normal-case tracking-normal">— {type}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange}
                    className={inputClass} placeholder="Your full name" />
                </div>
                {/* Phone */}
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    className={inputClass} placeholder="+968 9000 0000" />
                </div>
                {/* Email + Verify */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Email Address</label>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      disabled={emailVerified}
                      className={`${inputClass} flex-1 ${emailVerified ? "opacity-50" : ""}`}
                      placeholder="you@example.com" />
                    {!emailVerified && (
                      <button onClick={sendOtp} disabled={loading}
                        className="w-full md:w-auto px-6 py-4 md:py-0 rounded-2xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-40 whitespace-nowrap">
                        {loading ? "…" : otpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    )}
                    {emailVerified && (
                      <div className="flex items-center justify-center px-5 py-4 md:py-0 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-widest whitespace-nowrap">
                        ✓ Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* OTP Input */}
                {otpSent && !emailVerified && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="md:col-span-2 pt-2">
                    <label className={labelClass}>Enter OTP</label>
                    <div className="flex gap-3">
                      <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                        className={`${inputClass} text-center text-2xl tracking-[0.6em] font-bold flex-1`}
                        placeholder="000000" />
                      <button onClick={verifyOtp} disabled={loading}
                        className="px-7 rounded-2xl bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all disabled:opacity-40">
                        {loading ? "…" : "Verify"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setStep(0)}
                  className="px-7 py-3.5 rounded-2xl border border-white/8 text-gray-400 text-xs uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
                  ← Back
                </button>
                {emailVerified && (
                  <button onClick={() => {
                    if (!form.fullName.trim()) return notify("Full name is required.", true);
                    if (!form.phone.trim()) return notify("Phone number is required.", true);
                    setStep(2);
                  }}
                    className="flex-1 py-3.5 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl shadow-white/5">
                    Continue to Event Details →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Event Details */}
          {step === 2 && (
            <motion.div key="s2" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
              <p className="text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-1 text-center">Step 3 of 3</p>
              <h2 className="text-2xl font-serif mb-8 text-center">Event Details</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="bg-[#0f0f0f] rounded-[2rem] border border-white/5 p-6 flex flex-col items-center">
                  <p className={`${labelClass} self-start`}>Select Event Date</p>
                  <DatePicker selected={form.eventDate} onChange={(d) => setForm((p) => ({ ...p, eventDate: d }))}
                    minDate={new Date()} inline calendarClassName="madeena-calendar" />
                  {occupiedSummary && (
                    <div className="w-full mt-4 px-4 py-3 rounded-xl bg-yellow-500/5 border border-yellow-500/15 text-yellow-400 text-xs text-center">
                      ⚠ Occupied on this day: {occupiedSummary}
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <div className="bg-[#0f0f0f] rounded-[2rem] border border-white/5 p-6 space-y-5">
                  <div>
                    <label className={labelClass}>Number of Guests</label>
                    <input name="guests" type="number" value={form.guests} onChange={handleChange}
                      className={inputClass} min={1} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Start Time</label>
                      <input name="startTime" type="time" value={form.startTime} onChange={handleChange}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>End Time</label>
                      <input name="endTime" type="time" value={form.endTime} onChange={handleChange}
                        className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Special Requests / Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Decoration preferences, dietary needs, etc." />
                  </div>

                  {/* Summary mini card */}
                  <div className="bg-black/40 rounded-2xl p-4 text-xs text-gray-400 space-y-1 border border-white/5">
                    <p><span className="text-gray-600">Name</span> · {form.fullName || "—"}</p>
                    <p><span className="text-gray-600">Date</span> · {form.eventDate.toDateString()}</p>
                    <p><span className="text-gray-600">Time</span> · {form.startTime} – {form.endTime}</p>
                    <p><span className="text-gray-600">Guests</span> · {form.guests}</p>
                    <p><span className="text-gray-600">Type</span> · {type}</p>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button onClick={() => setStep(1)}
                      className="px-7 py-3.5 rounded-2xl border border-white/8 text-gray-400 text-xs uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
                      ← Back
                    </button>
                    <button onClick={submit} disabled={loading}
                      className="flex-1 py-3.5 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl disabled:opacity-40">
                      {loading ? "Processing…" : "Confirm Reservation"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Success */}
          {step === 3 && (
            <motion.div key="s3" variants={fadeUp} initial="hidden" animate="visible"
              className="text-center py-24 bg-[#0f0f0f] rounded-[3rem] border border-white/5">
              <div className="text-5xl mb-6">🎉</div>
              <h2 className="text-3xl font-serif mb-3">Request Submitted!</h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed mb-10">
                Your reservation request for <span className="text-white">{form.eventDate.toDateString()}</span> has been sent.
                A confirmation will be emailed to <span className="text-white">{form.email}</span> once approved.
              </p>
              <button onClick={() => window.location.href = "/"}
                className="px-10 py-4 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all">
                Back to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Reservations;
