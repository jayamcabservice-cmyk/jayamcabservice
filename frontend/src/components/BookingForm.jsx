import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaCar, FaUsers, FaExchangeAlt, FaWhatsapp, FaPhoneAlt, FaSuitcaseRolling, FaRoute, FaSearch, FaChevronDown, FaUser, FaBox } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useIntersectionReveal from '../hooks/useIntersectionReveal';
import { submitBooking } from '../services/api';
import { useNavigate } from 'react-router-dom';

// ─── Distance Table (approx km between Maharashtra cities) ───────────────────
const DISTANCES = {
    'Nashik-Mumbai': 170,       'Nashik-Pune': 210,         'Nashik-Shirdi': 90,
    'Nashik-Aurangabad': 180,   'Nashik-Bhandardara': 65,   'Nashik-Igatpuri': 55,
    'Nashik-Trimbakeshwar': 28, 'Nashik-Lonavala': 245,     'Nashik-Kolad': 165,
    'Nashik-Ratnagiri': 320,    'Nashik-Bhimashankar': 170, 'Nashik-Alibaug': 220,
    'Mumbai-Pune': 150,         'Mumbai-Lonavala': 83,      'Mumbai-Khandala': 85,
    'Mumbai-Alibaug': 100,      'Mumbai-Shirdi': 240,        'Mumbai-Aurangabad': 335,
    'Mumbai-Mahabaleshwar': 265,'Mumbai-Panchgani': 240,    'Mumbai-Ratnagiri': 330,
    'Mumbai-Kolad': 120,        'Mumbai-Murud-Janjira': 165,'Mumbai-Raigad': 140,
    'Mumbai-Bhandardara': 160,  'Mumbai-Bhimashankar': 210, 'Mumbai-Trimbakeshwar': 195,
    'Mumbai-Igatpuri': 130,     'Mumbai-Ajanta': 400,        'Mumbai-Ellora': 370,
    'Pune-Lonavala': 65,        'Pune-Khandala': 67,         'Pune-Mahabaleshwar': 120,
    'Pune-Panchgani': 100,      'Pune-Shirdi': 200,          'Pune-Ratnagiri': 290,
    'Pune-Kolad': 100,          'Pune-Bhimashankar': 110,    'Pune-Alibaug': 145,
    'Pune-Aurangabad': 235,     'Pune-Ajanta': 320,          'Pune-Ellora': 250,
    'Aurangabad-Ajanta': 100,   'Aurangabad-Ellora': 30,
};

function getDistance(from, to) {
    if (!from || !to || from === to) return null;
    return DISTANCES[`${from}-${to}`] || DISTANCES[`${to}-${from}`] || null;
}

// ─── CityDropdown ─────────────────────────────────────────────────────────────
const CityDropdown = ({ label, value, onChange, cities, placeholder, disabledValues = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false); setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    const selectedCity = cities.find(c => c.name === value);

    return (
        <div ref={dropdownRef} className="relative w-full">
            <label className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2 block">{label}</label>
            <button type="button" onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
                className={`w-full px-4 py-[10px] bg-gray-50 border rounded-xl text-left font-medium transition-all flex items-center justify-between cursor-pointer h-[46px] ${isOpen ? 'border-india-blue-500 ring-2 ring-india-blue-500/10 bg-white' : 'border-gray-200 hover:border-gray-300'}`}>
                {selectedCity
                    ? <span className="flex items-center gap-2 text-gray-800 truncate"><span>{selectedCity.emoji}</span><span className="truncate">{selectedCity.name}</span></span>
                    : <span className="text-gray-400 truncate">{placeholder}</span>}
                <FaChevronDown className={`text-gray-400 text-xs flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search city..." autoFocus
                                className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:bg-white border border-transparent focus:border-india-blue-200 transition-all" />
                        </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto py-1">
                        {filtered.length === 0
                            ? <div className="px-4 py-3 text-sm text-gray-400 text-center">No cities found</div>
                            : filtered.map(city => (
                                <button key={city.name} type="button"
                                    disabled={disabledValues.includes(city.name)}
                                    onClick={() => { onChange(city.name); setIsOpen(false); setSearch(''); }}
                                    className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors text-sm ${disabledValues.includes(city.name) ? 'opacity-50 cursor-not-allowed bg-gray-50' : value === city.name ? 'bg-india-blue-50 text-india-blue-700 font-semibold cursor-pointer' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'}`}>
                                    <span className="text-lg">{city.emoji}</span>
                                    <div>
                                        <div className="font-medium">{city.name}</div>
                                        <div className="text-[10px] text-gray-400">{city.state}</div>
                                    </div>
                                    {disabledValues.includes(city.name)
                                        ? <span className="ml-auto text-red-400" title="Cannot select same city">🚫</span>
                                        : value === city.name && <svg className="w-4 h-4 text-india-blue-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── PaxDropdown ──────────────────────────────────────────────────────────────
const PaxDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20];

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-full">
            <label className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2 block">Pax</label>
            <button type="button" onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-[46px] px-3 bg-gray-50 border rounded-xl text-left font-medium transition-all flex items-center justify-between cursor-pointer text-sm ${isOpen ? 'border-india-blue-500 ring-2 ring-india-blue-500/10 bg-white' : 'border-gray-200 hover:border-gray-300'}`}>
                <span className="text-gray-800">{value} {value == 1 ? 'Person' : 'People'}</span>
                <FaChevronDown className={`text-gray-400 text-xs flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-[180px] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="max-h-48 overflow-y-auto py-1 grid grid-cols-2 gap-1 p-2">
                        {options.map(num => (
                            <button key={num} type="button"
                                onClick={() => { onChange(num); setIsOpen(false); }}
                                className={`w-full py-2 rounded-lg text-center transition-colors text-sm font-medium ${value == num ? 'bg-india-blue-500 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-india-blue-50'}`}>
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Confirmation Modal ───────────────────────────────────────────────────────
const ConfirmModal = ({ open, data, onConfirm, onCancel, submitting }) => {
    if (!open) return null;
    const isPackage = data.type === 'package';

    return (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                {/* Header */}
                <div className={`px-6 py-5 ${isPackage ? 'bg-gradient-to-r from-india-blue-600 to-india-blue-700' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                    <div className="text-3xl mb-1">{isPackage ? (data.packageEmoji || '📦') : '🚗'}</div>
                    <h3 className="text-xl font-bold text-white">Confirm Your Enquiry</h3>
                    <p className="text-white/70 text-sm mt-0.5">Review details before sending</p>
                </div>

                {/* Details */}
                <div className="px-6 py-5 space-y-3">
                    <Row label="Name" value={data.customerName} />
                    <Row label="Phone" value={data.phone} />
                    {isPackage ? (
                        <>
                            <Row label="Package" value={`${data.packageEmoji || '📦'} ${data.packageName}`} highlight />
                            {data.packagePrice && <Row label="Package Price" value={`₹${Number(data.packagePrice).toLocaleString('en-IN')} (fixed)`} highlight />}
                        </>
                    ) : (
                        <>
                            <Row label="Route" value={`${data.pickup} → ${data.destination}`} />
                            <Row label="Vehicle" value={data.vehicleLabel} />
                            {data.estimatedKm && (
                                <Row label="Est. Distance" value={`~${data.estimatedKm} km`} />
                            )}
                            {data.estimatedPrice && (
                                <Row label="Est. Price" value={`~₹${data.estimatedPrice.toLocaleString('en-IN')}`} highlight />
                            )}
                        </>
                    )}
                    <Row label="Date" value={data.travelDate} />
                    <Row label="Passengers" value={`${data.passengers} ${data.passengers == 1 ? 'Person' : 'People'}`} />
                    {data.tripType && !isPackage && <Row label="Trip Type" value={data.tripType === 'oneWay' ? 'One Way' : data.tripType === 'roundTrip' ? 'Round Trip' : 'Local Rental'} />}
                </div>

                <div className="px-6 pb-4 bg-amber-50 border-t border-amber-100">
                    <p className="text-xs text-amber-700 pt-3">
                        ⚠️ Only submit a real enquiry. Fake/test submissions waste the team's time.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 pb-6 pt-4">
                    <button onClick={onCancel} disabled={submitting}
                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
                        ← Not Ready
                    </button>
                    <button onClick={onConfirm} disabled={submitting}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors ${isPackage ? 'bg-india-blue-600 hover:bg-india-blue-700' : 'bg-green-500 hover:bg-green-600'} disabled:opacity-60`}>
                        {submitting
                            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending...</>
                            : <><FaWhatsapp className="text-base" /> Yes, Send Enquiry</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const Row = ({ label, value, highlight }) => (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
        <span className={`text-sm font-semibold ${highlight ? 'text-india-blue-700' : 'text-gray-800'}`}>{value}</span>
    </div>
);

// ─── Main BookingForm Component ────────────────────────────────────────────────
const BookingForm = ({ packageInfo = null }) => {
    const navigate = useNavigate();
    const isPackageMode = !!packageInfo;

    const [tripType, setTripType] = useState('oneWay');
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        email: '',
        pickup: '',
        destination: '',
        date: '',
        returnDate: '',
        cabType: '',
        passengers: 1,
        message: '',
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const headingRef = useIntersectionReveal('fadeUp', { duration: 0.8 });
    const formRef = useIntersectionReveal('scaleIn', { delay: 0.2 });

    const cabTypes = [
        { value: 'hatchback', label: 'Hatchback', icon: '🚗', pricePerKm: 9,  seats: '4 seats',  color: '#10B981' },
        { value: 'sedan',     label: 'Sedan',     icon: '🚙', pricePerKm: 12, seats: '4 seats',  color: '#3B82F6', popular: true },
        { value: 'suv',       label: 'SUV',       icon: '🚙', pricePerKm: 16, seats: '6-7 seats',color: '#8B5CF6' },
        { value: 'tempo',     label: 'Tempo',     icon: '🚐', pricePerKm: 25, seats: '12-17',    color: '#F59E0B' },
        { value: 'luxury',    label: 'Coach',     icon: '🚌', pricePerKm: 40, seats: '20-35',    color: '#EC4899' },
    ];

    const cities = [
        { name: 'Nashik',          state: 'Maharashtra', emoji: '🍇' },
        { name: 'Pune',            state: 'Maharashtra', emoji: '🏙️' },
        { name: 'Mumbai',          state: 'Maharashtra', emoji: '🌆' },
        { name: 'Lonavala',        state: 'Maharashtra', emoji: '⛰️' },
        { name: 'Khandala',        state: 'Maharashtra', emoji: '🏞️' },
        { name: 'Mahabaleshwar',   state: 'Maharashtra', emoji: '🍓' },
        { name: 'Panchgani',       state: 'Maharashtra', emoji: '🏔️' },
        { name: 'Alibaug',         state: 'Maharashtra', emoji: '🏖️' },
        { name: 'Murud-Janjira',   state: 'Maharashtra', emoji: '🏰' },
        { name: 'Shirdi',          state: 'Maharashtra', emoji: '🕉️' },
        { name: 'Aurangabad',      state: 'Maharashtra', emoji: '🏛️' },
        { name: 'Ajanta',          state: 'Maharashtra', emoji: '🎨' },
        { name: 'Ellora',          state: 'Maharashtra', emoji: '⛏️' },
        { name: 'Kolad',           state: 'Maharashtra', emoji: '🚣' },
        { name: 'Bhandardara',     state: 'Maharashtra', emoji: '⭐' },
        { name: 'Igatpuri',        state: 'Maharashtra', emoji: '🧘' },
        { name: 'Trimbakeshwar',   state: 'Maharashtra', emoji: '🛕' },
        { name: 'Bhimashankar',    state: 'Maharashtra', emoji: '🐂' },
        { name: 'Raigad',          state: 'Maharashtra', emoji: '🏯' },
        { name: 'Ratnagiri',       state: 'Maharashtra', emoji: '🥥' },
    ];

    const tripTabs = [
        { value: 'oneWay',    label: 'One Way',      icon: <FaRoute className="text-xs" />,       desc: 'A to B' },
        { value: 'roundTrip', label: 'Round Trip',   icon: <FaExchangeAlt className="text-xs" />, desc: 'A ↔ B' },
        { value: 'local',     label: 'Local Rental', icon: <FaSuitcaseRolling className="text-xs" />, desc: 'City tours' },
    ];

    // ── Live price calculation ──
    const selectedCab = cabTypes.find(c => c.value === formData.cabType);
    const estimatedKm = !isPackageMode && formData.pickup && formData.destination
        ? getDistance(formData.pickup, formData.destination) : null;
    const estimatedPrice = selectedCab && estimatedKm
        ? estimatedKm * selectedCab.pricePerKm * (tripType === 'roundTrip' ? 2 : 1)
        : null;

    // ── Form validation ──
    const isFormValid = isPackageMode
        ? formData.customerName.trim() && formData.phone.trim().length >= 10 && formData.date
        : formData.customerName.trim() && formData.phone.trim().length >= 10 &&
          formData.pickup && formData.destination && formData.pickup !== formData.destination &&
          formData.date && formData.cabType;

    // ── Show confirmation modal ──
    const handleGetQuote = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        setShowConfirm(true);
    };

    // ── Build the confirm modal data object ──
    const confirmData = {
        type:         isPackageMode ? 'package' : 'ride',
        customerName: formData.customerName,
        phone:        formData.phone,
        travelDate:   formData.date ?
            new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
        passengers:   formData.passengers,
        tripType:     tripType,
        // Package-specific
        packageName:  packageInfo?.name,
        packagePrice: packageInfo?.price,
        packageEmoji: packageInfo?.emoji,
        // Ride-specific
        pickup:        formData.pickup,
        destination:   formData.destination,
        vehicleLabel:  selectedCab ? `${selectedCab.label} (₹${selectedCab.pricePerKm}/km)` : '',
        estimatedKm,
        estimatedPrice,
    };

    // ── Submit: save to DB + open WhatsApp ──
    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            const tripLabel = tripType === 'oneWay' ? 'One Way' : tripType === 'roundTrip' ? 'Round Trip' : 'Local Rental';

            // Save to Firestore
            await submitBooking({
                type:           confirmData.type,
                customerName:   formData.customerName,
                phone:          formData.phone,
                email:          formData.email || null,
                travelDate:     formData.date,
                passengers:     formData.passengers,
                message:        formData.message || '',
                // Ride
                tripType,
                pickup:         formData.pickup || null,
                destination:    formData.destination || null,
                vehicleType:    formData.cabType || null,
                pricePerKm:     selectedCab?.pricePerKm || null,
                estimatedKm:    estimatedKm || null,
                estimatedPrice: estimatedPrice || null,
                // Package
                packageName:    packageInfo?.name || null,
                packagePrice:   packageInfo?.price || null,
            });

            // Build WhatsApp message
            let msg = `🚗 *New Booking Enquiry*\n\n`;
            msg += `*Name:* ${formData.customerName}\n`;
            msg += `*Phone:* ${formData.phone}\n`;
            if (isPackageMode) {
                msg += `*Type:* 📦 Package Booking\n`;
                msg += `*Package:* ${packageInfo.emoji} ${packageInfo.name}\n`;
                if (packageInfo.price) msg += `*Price:* ₹${packageInfo.price.toLocaleString('en-IN')} (fixed)\n`;
            } else {
                msg += `*Type:* 🚗 Ride Booking (${tripLabel})\n`;
                msg += `*Route:* ${formData.pickup} → ${formData.destination}\n`;
                msg += `*Vehicle:* ${selectedCab?.label} (₹${selectedCab?.pricePerKm}/km)\n`;
                if (estimatedKm) msg += `*Est. Distance:* ~${estimatedKm} km\n`;
                if (estimatedPrice) msg += `*Est. Price:* ~₹${estimatedPrice.toLocaleString('en-IN')}\n`;
            }
            msg += `*Date:* ${confirmData.travelDate}\n`;
            msg += `*Passengers:* ${formData.passengers}\n`;
            if (formData.message) msg += `*Note:* ${formData.message}\n`;
            msg += `\nPlease confirm availability. Thank you!`;

            setShowConfirm(false);
            setSubmitted(true);

            window.open(`https://wa.me/917972732871?text=${encodeURIComponent(msg)}`, '_blank');
        } catch (err) {
            console.error('Booking submit failed:', err);
            alert('Failed to submit booking. Please try WhatsApp directly.');
        } finally {
            setSubmitting(false);
        }
    };

    const swapLocations = () => {
        setFormData(prev => ({ ...prev, pickup: prev.destination, destination: prev.pickup }));
    };

    // ── Success screen ────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-xl mx-auto px-4 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">✅</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Enquiry Sent!</h2>
                    <p className="text-gray-500 mb-6">
                        Your booking request has been saved and sent via WhatsApp. Our team will contact you shortly at <strong>{formData.phone}</strong>.
                    </p>
                    <button onClick={() => isPackageMode ? navigate('/packages') : setSubmitted(false)}
                        className="px-6 py-3 bg-india-blue-600 text-white font-semibold rounded-full hover:bg-india-blue-700 transition-colors">
                        {isPackageMode ? 'Back to Tour Packages' : 'Make Another Booking'}
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section id="booking" className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                {!isPackageMode && (
                    <div ref={headingRef} className="text-center mb-10 sm:mb-12">
                        <div className="inline-flex items-center gap-2 bg-india-blue-50 text-india-blue-600 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 border border-india-blue-100">
                            <FaCar className="text-xs" /> Quick Booking
                        </div>
                        <h2 className="text-3xl xs:text-4xl md:text-5xl font-bold text-india-blue-800 mb-3 px-2">
                            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-india-saffron-500 to-india-saffron-600">Perfect Ride</span>
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto px-3">
                            Get instant quotes for outstation &amp; local trips across India
                        </p>
                    </div>
                )}

                {/* Package Banner */}
                {isPackageMode && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-5 bg-india-blue-50 border border-india-blue-200 rounded-2xl flex items-center gap-4 shadow-sm">
                        <span className="text-4xl">{packageInfo.emoji}</span>
                        <div className="flex-1">
                            <div className="text-xs font-bold uppercase tracking-widest text-india-blue-500 mb-0.5">
                                📦 Package Selected
                            </div>
                            <div className="text-xl font-bold text-india-blue-900">{packageInfo.name}</div>
                            {packageInfo.location && <div className="text-sm text-gray-500 mt-0.5">📍 {packageInfo.location}</div>}
                        </div>
                        {packageInfo.price && (
                            <div className="text-right shrink-0">
                                <div className="text-xs text-gray-400">Fixed Price</div>
                                <div className="text-2xl font-black text-india-saffron-600">
                                    ₹{packageInfo.price.toLocaleString('en-IN')}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Form Card */}
                <div ref={formRef}>
                    <form onSubmit={handleGetQuote}
                        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] p-4 sm:p-6 md:p-8 border border-gray-200">

                        {/* Trip Type — only for ride mode */}
                        {!isPackageMode && (
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8 max-w-lg mx-auto">
                                {tripTabs.map(tab => (
                                    <motion.button key={tab.value} type="button" whileTap={{ scale: 0.96 }}
                                        onClick={() => setTripType(tab.value)}
                                        className={`relative py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl sm:rounded-2xl text-center transition-all duration-300 border-2 ${tripType === tab.value ? 'border-india-blue-500 bg-india-blue-50 shadow-md shadow-india-blue-500/10' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                                        {tripType === tab.value && (
                                            <motion.div layoutId="tripIndicator" className="absolute top-1.5 right-1.5 w-2 h-2 bg-india-blue-500 rounded-full" />
                                        )}
                                        <div className={`flex items-center justify-center gap-1 sm:gap-1.5 mb-0.5 font-bold text-xs sm:text-sm ${tripType === tab.value ? 'text-india-blue-700' : 'text-gray-600'}`}>
                                            {tab.icon} {tab.label}
                                        </div>
                                        <div className="text-[10px] text-gray-400">{tab.desc}</div>
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {/* ── Common fields row ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            {/* Customer Name */}
                            <div>
                                <label className="flex items-center text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2">
                                    <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                                        <FaUser className="text-purple-500 text-[10px]" />
                                    </span>
                                    Full Name *
                                </label>
                                <input type="text" value={formData.customerName}
                                    onChange={e => setFormData(p => ({ ...p, customerName: e.target.value }))}
                                    placeholder="Your name..."
                                    className="w-full px-4 py-[10px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-india-blue-500 focus:ring-2 focus:ring-india-blue-500/10 transition-all font-medium text-gray-800 text-sm placeholder-gray-400 h-[46px]" />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2">
                                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                        <FaPhoneAlt className="text-green-500 text-[10px]" />
                                    </span>
                                    Phone Number *
                                </label>
                                <input type="tel" value={formData.phone}
                                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    className="w-full px-4 py-[10px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-india-blue-500 focus:ring-2 focus:ring-india-blue-500/10 transition-all font-medium text-gray-800 text-sm placeholder-gray-400 h-[46px]" />
                            </div>
                        </div>

                        {/* ── Ride-only fields ── */}
                        {!isPackageMode && (
                            <div className="flex flex-col lg:flex-row gap-4 items-end mb-4">
                                {/* Pickup */}
                                <div className="w-full lg:w-[22%] relative z-30">
                                    <CityDropdown label="Pickup" value={formData.pickup}
                                        onChange={val => setFormData(p => ({ ...p, pickup: val }))}
                                        cities={cities} placeholder="City..."
                                        disabledValues={formData.destination ? [formData.destination] : []} />
                                </div>

                                {/* Swap */}
                                <div className="flex justify-center lg:w-[8%]">
                                    <div className="hidden lg:block h-[22px] mb-2" />
                                    <motion.button type="button" whileHover={{ rotate: 180, scale: 1.15 }} whileTap={{ scale: 0.85 }}
                                        onClick={swapLocations}
                                        className="w-[46px] h-[46px] bg-gradient-to-br from-india-blue-50 to-india-blue-100 text-india-blue-600 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-india-blue-200">
                                        <FaExchangeAlt className="text-sm" />
                                    </motion.button>
                                </div>

                                {/* Destination */}
                                <div className="w-full lg:w-[22%] relative z-20">
                                    <CityDropdown label="Drop" value={formData.destination}
                                        onChange={val => setFormData(p => ({ ...p, destination: val }))}
                                        cities={cities} placeholder="City..."
                                        disabledValues={formData.pickup ? [formData.pickup] : []} />
                                </div>

                                {/* Date */}
                                <div className="w-full sm:w-1/2 lg:w-[20%]">
                                    <label className="flex items-center text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2">
                                        <span className="w-5 h-5 bg-india-saffron-100 rounded-full flex items-center justify-center mr-2">
                                            <FaCalendarAlt className="text-india-saffron-500 text-[10px]" />
                                        </span>
                                        Date *
                                    </label>
                                    <div className="relative">
                                        <DatePicker
                                            selected={formData.date ? new Date(formData.date) : null}
                                            onChange={date => setFormData(p => ({ ...p, date: date ? date.toISOString().split('T')[0] : '' }))}
                                            dateFormat="dd MMM yy" minDate={new Date()} placeholderText="Add date..."
                                            className="w-full px-3 py-[10px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-india-blue-500 focus:ring-2 focus:ring-india-blue-500/10 transition-all font-medium text-gray-800 cursor-pointer text-sm h-[46px]"
                                            wrapperClassName="w-full" />
                                        <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
                                    </div>
                                </div>

                                {/* Pax */}
                                <div className="w-full sm:w-1/2 lg:w-[14%]">
                                    <PaxDropdown value={formData.passengers}
                                        onChange={val => setFormData(p => ({ ...p, passengers: val }))} />
                                </div>
                            </div>
                        )}

                        {/* ── Package-only fields ── */}
                        {isPackageMode && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="flex items-center text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2">
                                        <span className="w-5 h-5 bg-india-saffron-100 rounded-full flex items-center justify-center mr-2">
                                            <FaCalendarAlt className="text-india-saffron-500 text-[10px]" />
                                        </span>
                                        Travel Date *
                                    </label>
                                    <div className="relative">
                                        <DatePicker
                                            selected={formData.date ? new Date(formData.date) : null}
                                            onChange={date => setFormData(p => ({ ...p, date: date ? date.toISOString().split('T')[0] : '' }))}
                                            dateFormat="dd MMM yy" minDate={new Date()} placeholderText="When do you want to go?"
                                            className="w-full px-3 py-[10px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-india-blue-500 text-sm h-[46px] cursor-pointer"
                                            wrapperClassName="w-full" />
                                        <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <PaxDropdown value={formData.passengers}
                                        onChange={val => setFormData(p => ({ ...p, passengers: val }))} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2 block">
                                        Special Requests (optional)
                                    </label>
                                    <textarea value={formData.message} rows={2}
                                        onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                                        placeholder="Any specific requirements, pickup point, meals preference..."
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-india-blue-500 resize-none" />
                                </div>
                            </div>
                        )}

                        {/* ── Live Price Estimate (ride mode only) ── */}
                        {!isPackageMode && estimatedPrice && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                <span className="text-2xl">💰</span>
                                <div>
                                    <div className="text-xs text-green-600 font-semibold uppercase tracking-wide">Estimated Price</div>
                                    <div className="text-xl font-black text-green-700">
                                        ~₹{estimatedPrice.toLocaleString('en-IN')}
                                        <span className="text-xs text-green-500 font-normal ml-2">
                                            ({estimatedKm} km × ₹{selectedCab.pricePerKm}/km{tripType === 'roundTrip' ? ' × 2' : ''})
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Vehicle Type Cards (ride mode only) ── */}
                        {!isPackageMode && (
                            <>
                                <div className="my-5 border-t border-gray-100" />
                                <div>
                                    <p className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-4 flex items-center">
                                        <span className="w-5 h-5 bg-india-blue-100 rounded-full flex items-center justify-center mr-2">
                                            <FaCar className="text-india-blue-500 text-[10px]" />
                                        </span>
                                        Choose Your Ride *
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {cabTypes.map(cab => (
                                            <motion.button key={cab.value} type="button"
                                                whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}
                                                onClick={() => setFormData(p => ({ ...p, cabType: cab.value }))}
                                                className={`relative p-3 sm:p-4 rounded-2xl border-2 text-center transition-all duration-300 ${formData.cabType === cab.value ? 'border-india-blue-500 bg-india-blue-50/50 shadow-lg shadow-india-blue-500/10' : 'border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:shadow-sm'}`}>
                                                {cab.popular && (
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-india-saffron-500 to-india-saffron-600 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                                                        Popular
                                                    </div>
                                                )}
                                                {formData.cabType === cab.value && (
                                                    <div className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-india-blue-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="text-2xl sm:text-3xl mb-1">{cab.icon}</div>
                                                <div className="font-bold text-gray-800 text-xs sm:text-sm">{cab.label}</div>
                                                <div className="mt-0.5 sm:mt-1">
                                                    <span className="text-base sm:text-xl font-black" style={{ color: cab.color }}>₹{cab.pricePerKm}</span>
                                                    <span className="text-gray-400 text-[9px] sm:text-[10px]">/km</span>
                                                </div>
                                                <div className="text-gray-400 text-[9px] sm:text-[10px] mt-0.5">{cab.seats}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── Submit Button ── */}
                        <div className="mt-6">
                            <motion.button type="submit" disabled={!isFormValid}
                                whileHover={isFormValid ? { scale: 1.02, boxShadow: '0 15px 35px rgba(37,211,102,0.3)' } : {}}
                                whileTap={isFormValid ? { scale: 0.97 } : {}}
                                className={`w-full h-[52px] font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-300 ${isFormValid ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'}`}>
                                <FaWhatsapp className={isFormValid ? 'text-lg' : 'text-base opacity-60'} />
                                Get Quote &amp; Send Enquiry
                            </motion.button>
                            {!isFormValid && (
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    {isPackageMode
                                        ? 'Please fill name, phone (10 digits) and travel date'
                                        : 'Fill name, phone, route, date and vehicle to continue'}
                                </p>
                            )}
                        </div>

                        {/* Trust badges */}
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-gray-400">
                            <span>🔒 Secure Booking</span>
                            <span>✅ Verified Drivers</span>
                            <span>💰 No Hidden Charges</span>
                            <span>📞 24/7 Support</span>
                        </div>
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <ConfirmModal
                        open={showConfirm}
                        data={confirmData}
                        onConfirm={handleConfirm}
                        onCancel={() => setShowConfirm(false)}
                        submitting={submitting}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default BookingForm;
