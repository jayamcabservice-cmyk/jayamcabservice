import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaCar, FaUsers, FaExchangeAlt, FaWhatsapp, FaPhoneAlt, FaSuitcaseRolling, FaRoute, FaSearch, FaChevronDown } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useGsapReveal from '../hooks/useGsapReveal';

// ===== Custom Dropdown Component =====
const CityDropdown = ({ label, icon, iconBg, iconColor, value, onChange, cities, placeholder, disabledValues = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = cities.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedCity = cities.find(c => c.name === value);

    return (
        <div ref={dropdownRef} className="relative">
            <label className="flex items-center text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2">
                <span className={`w-5 h-5 ${iconBg} rounded-full flex items-center justify-center mr-2`}>
                    {icon}
                </span>
                {label}
            </label>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
                className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-left font-medium transition-all flex items-center justify-between cursor-pointer ${isOpen
                    ? 'border-india-blue-500 ring-2 ring-india-blue-500/10 bg-white'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
            >
                {selectedCity ? (
                    <span className="flex items-center gap-2 text-gray-800">
                        <span>{selectedCity.emoji}</span>
                        <span>{selectedCity.name}</span>
                    </span>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
                <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                    >
                        {/* Search */}
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search city..."
                                    autoFocus
                                    className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:bg-white border border-transparent focus:border-india-blue-200 transition-all"
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="max-h-48 overflow-y-auto py-1">
                            {filtered.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-400 text-center">No cities found</div>
                            ) : (
                                filtered.map((city) => (
                                    <button
                                        key={city.name}
                                        type="button"
                                        disabled={disabledValues.includes(city.name)}
                                        onClick={() => {
                                            onChange(city.name);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors text-sm ${disabledValues.includes(city.name)
                                            ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                            : value === city.name
                                                ? 'bg-india-blue-50 text-india-blue-700 font-semibold cursor-pointer'
                                                : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                                            }`}
                                    >
                                        <span className="text-lg">{city.emoji}</span>
                                        <div>
                                            <div className="font-medium">{city.name}</div>
                                            <div className="text-[10px] text-gray-400">{city.state}</div>
                                        </div>
                                        {disabledValues.includes(city.name) ? (
                                            <span className="ml-auto text-red-400" title="Cannot select same city for pickup and drop">
                                                🚫
                                            </span>
                                        ) : value === city.name && (
                                            <svg className="w-4 h-4 text-india-blue-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ===== Custom Passenger Dropdown Component =====
const PaxDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20];

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-full">
            <label className="flex items-center text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2">
                <span className="w-5 h-5 bg-india-blue-100 rounded-full flex items-center justify-center mr-2">
                    <FaUsers className="text-india-blue-500 text-[10px]" />
                </span>
                Pax
            </label>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-[46px] px-3 bg-gray-50 border rounded-xl text-left font-medium transition-all flex items-center justify-between cursor-pointer text-sm ${isOpen
                    ? 'border-india-blue-500 ring-2 ring-india-blue-500/10 bg-white'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
            >
                <span className="text-gray-800">{value} {value == 1 ? 'Person' : 'People'}</span>
                <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-[180px] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                    >
                        <div className="max-h-48 overflow-y-auto py-1 grid grid-cols-2 gap-1 p-2">
                            {options.map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => {
                                        onChange(num);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full py-2 rounded-lg text-center transition-colors text-sm font-medium ${value == num
                                        ? 'bg-india-blue-500 text-white shadow-md'
                                        : 'bg-gray-50 text-gray-700 hover:bg-india-blue-50'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ===== Main Component =====
const BookingForm = () => {
    const [tripType, setTripType] = useState('oneWay');
    const [formData, setFormData] = useState({
        pickup: '',
        destination: '',
        date: '',
        returnDate: '',
        cabType: '',
        passengers: '1',
    });

    const headingRef = useGsapReveal('fadeUp', { duration: 0.8 });
    const formRef = useGsapReveal('scaleIn', { delay: 0.2 });

    const cabTypes = [
        { value: 'hatchback', label: 'Hatchback', icon: '🚗', price: '₹9', seats: '4 seats', color: '#10B981' },
        { value: 'sedan', label: 'Sedan', icon: '🚙', price: '₹12', seats: '4 seats', color: '#3B82F6', popular: true },
        { value: 'suv', label: 'SUV', icon: '🚙', price: '₹16', seats: '6-7 seats', color: '#8B5CF6' },
        { value: 'tempo', label: 'Tempo', icon: '🚐', price: '₹25', seats: '12-17', color: '#F59E0B' },
        { value: 'luxury', label: 'Coach', icon: '🚌', price: '₹40', seats: '20-35', color: '#EC4899' },
    ];

    const cities = [
        { name: 'Mumbai', state: 'Maharashtra', emoji: '🏙️' },
        { name: 'Delhi', state: 'Delhi NCR', emoji: '🕌' },
        { name: 'Goa', state: 'Goa', emoji: '🏖️' },
        { name: 'Jaipur', state: 'Rajasthan', emoji: '🏰' },
        { name: 'Manali', state: 'Himachal Pradesh', emoji: '🏔️' },
        { name: 'Shimla', state: 'Himachal Pradesh', emoji: '❄️' },
        { name: 'Ooty', state: 'Tamil Nadu', emoji: '🌿' },
        { name: 'Kerala', state: 'Kerala', emoji: '🌴' },
        { name: 'Udaipur', state: 'Rajasthan', emoji: '🏛️' },
        { name: 'Varanasi', state: 'Uttar Pradesh', emoji: '🕉️' },
        { name: 'Agra', state: 'Uttar Pradesh', emoji: '🕌' },
        { name: 'Kashmir', state: 'J&K', emoji: '🏔️' },
        { name: 'Bangalore', state: 'Karnataka', emoji: '💻' },
        { name: 'Pune', state: 'Maharashtra', emoji: '🏙️' },
        { name: 'Hyderabad', state: 'Telangana', emoji: '🕌' },
        { name: 'Chennai', state: 'Tamil Nadu', emoji: '🏖️' },
        { name: 'Kolkata', state: 'West Bengal', emoji: '🌉' },
        { name: 'Mysore', state: 'Karnataka', emoji: '🏰' },
        { name: 'Rishikesh', state: 'Uttarakhand', emoji: '🧘' },
        { name: 'Lonavala', state: 'Maharashtra', emoji: '⛰️' },
    ];

    const tripTabs = [
        { value: 'oneWay', label: 'One Way', icon: <FaRoute className="text-xs" />, desc: 'A to B' },
        { value: 'roundTrip', label: 'Round Trip', icon: <FaExchangeAlt className="text-xs" />, desc: 'A ↔ B' },
        { value: 'local', label: 'Local Rental', icon: <FaSuitcaseRolling className="text-xs" />, desc: 'City tours' },
    ];

    // Form Validation - Must have all required fields and different locations before enabling Get Quote
    const isFormValid = formData.pickup !== '' &&
        formData.destination !== '' &&
        formData.pickup !== formData.destination &&
        formData.date !== '' &&
        formData.cabType !== '';

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isFormValid) return;

        const tripLabel = tripType === 'oneWay' ? 'One Way' : tripType === 'roundTrip' ? 'Round Trip' : 'Local Rental';
        const selectedCab = cabTypes.find(c => c.value === formData.cabType);
        const cabLabel = selectedCab ? `${selectedCab.label} (${selectedCab.price}/km)` : 'Not selected';

        const message = `🚗 *New Booking Enquiry*\n\n` +
            `*Trip Type:* ${tripLabel}\n` +
            `*Pickup:* ${formData.pickup}\n` +
            `*Destination:* ${formData.destination}\n` +
            `*Date:* ${formData.date}\n` +
            (tripType === 'roundTrip' && formData.returnDate ? `*Return Date:* ${formData.returnDate}\n` : '') +
            `*Vehicle:* ${cabLabel}\n` +
            `*Passengers:* ${formData.passengers}\n\n` +
            `Please share the best quote for this trip. Thank you!`;

        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/917972732871?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Also trigger phone call — use window.open so browsers don't block it
        setTimeout(() => {
            window.open('tel:+917972732871', '_self');
        }, 1000);
    };

    const swapLocations = () => {
        setFormData(prev => ({
            ...prev,
            pickup: prev.destination,
            destination: prev.pickup,
        }));
    };

    return (
        <section id="booking" className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div ref={headingRef} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-india-blue-50 text-india-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-india-blue-100">
                        <FaCar className="text-xs" /> Quick Booking
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-india-blue-800 mb-3">
                        Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-india-saffron-500 to-india-saffron-600">Perfect Ride</span>
                    </h2>
                    <p className="text-base text-gray-500 max-w-lg mx-auto">
                        Get instant quotes for outstation & local trips across India
                    </p>
                </div>

                {/* Form Card */}
                <div ref={formRef}>
                    <form
                        onSubmit={handleSubmit}
                        className="relative bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] p-6 md:p-8 border border-gray-200"
                    >
                        {/* ===== TRIP TYPE SELECTOR ===== */}
                        <div className="grid grid-cols-3 gap-3 mb-8 max-w-lg mx-auto">
                            {tripTabs.map((tab) => (
                                <motion.button
                                    key={tab.value}
                                    type="button"
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setTripType(tab.value)}
                                    className={`relative py-3 px-2 rounded-2xl text-center transition-all duration-300 border-2 ${tripType === tab.value
                                        ? 'border-india-blue-500 bg-india-blue-50 shadow-md shadow-india-blue-500/10'
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                                        }`}
                                >
                                    {tripType === tab.value && (
                                        <motion.div
                                            layoutId="tripIndicator"
                                            className="absolute top-1.5 right-1.5 w-2 h-2 bg-india-blue-500 rounded-full"
                                        />
                                    )}
                                    <div className={`flex items-center justify-center gap-1.5 mb-0.5 font-bold text-sm ${tripType === tab.value ? 'text-india-blue-700' : 'text-gray-600'
                                        }`}>
                                        {tab.icon} {tab.label}
                                    </div>
                                    <div className="text-[10px] text-gray-400">{tab.desc}</div>
                                </motion.button>
                            ))}
                        </div>

                        {/* ===== ALL FIELDS IN ONE GRID ===== */}
                        <div className="flex flex-col xl:flex-row gap-3 items-end">
                            {/* Pickup City */}
                            <div className="w-full xl:w-[22%] relative z-30">
                                <CityDropdown
                                    label="Pickup"
                                    icon={<FaMapMarkerAlt className="text-green-500 text-[10px]" />}
                                    iconBg="bg-green-100"
                                    iconColor="text-green-500"
                                    value={formData.pickup}
                                    onChange={(val) => setFormData(prev => ({ ...prev, pickup: val }))}
                                    cities={cities}
                                    placeholder="City..."
                                    disabledValues={formData.destination ? [formData.destination] : []}
                                />
                            </div>

                            {/* Swap Button — aligned to bottom of inputs */}
                            <div className="flex justify-center xl:w-[6%]">
                                <div>
                                    {/* Invisible label spacer */}
                                    <div className="h-[22px] mb-2 hidden xl:block" />
                                    <motion.button
                                        type="button"
                                        whileHover={{ rotate: 180, scale: 1.15 }}
                                        whileTap={{ scale: 0.85 }}
                                        onClick={swapLocations}
                                        className="w-[46px] h-[46px] bg-gradient-to-br from-india-blue-50 to-india-blue-100 text-india-blue-600 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-india-blue-200"
                                    >
                                        <FaExchangeAlt className="text-sm" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="w-full xl:w-[22%] relative z-20">
                                <CityDropdown
                                    label="Drop"
                                    icon={<FaMapMarkerAlt className="text-red-500 text-[10px]" />}
                                    iconBg="bg-red-100"
                                    iconColor="text-red-500"
                                    value={formData.destination}
                                    onChange={(val) => setFormData(prev => ({ ...prev, destination: val }))}
                                    cities={cities}
                                    placeholder="City..."
                                    disabledValues={formData.pickup ? [formData.pickup] : []}
                                />
                            </div>

                            {/* Travel Date */}
                            <div className="w-full sm:w-1/2 xl:w-[15%]">
                                <label className="flex items-center text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2">
                                    <span className="w-5 h-5 bg-india-saffron-100 rounded-full flex items-center justify-center mr-2">
                                        <FaCalendarAlt className="text-india-saffron-500 text-[10px]" />
                                    </span>
                                    Date
                                </label>
                                <div className="relative">
                                    <DatePicker
                                        selected={formData.date ? new Date(formData.date) : null}
                                        onChange={(date) => setFormData(prev => ({ ...prev, date: date ? date.toISOString().split('T')[0] : '' }))}
                                        dateFormat="dd MMM yy"
                                        minDate={new Date()}
                                        placeholderText="Add date..."
                                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-india-blue-500 focus:ring-2 focus:ring-india-blue-500/10 transition-all font-medium text-gray-800 cursor-pointer text-sm"
                                        wrapperClassName="w-full"
                                    />
                                    <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
                                </div>
                            </div>

                            {/* Passengers */}
                            <div className="w-full sm:w-1/2 xl:w-[13%]">
                                <PaxDropdown
                                    value={formData.passengers}
                                    onChange={(val) => setFormData(prev => ({ ...prev, passengers: val }))}
                                />
                            </div>

                            {/* Get Quote — aligned to bottom */}
                            <div className="w-full xl:w-[22%]">
                                <div>
                                    {/* Invisible label spacer */}
                                    <div className="h-[22px] mb-2 hidden xl:block" />
                                    <motion.button
                                        type="submit"
                                        disabled={!isFormValid}
                                        whileHover={isFormValid ? { scale: 1.02, boxShadow: "0 15px 35px rgba(37, 211, 102, 0.3)" } : {}}
                                        whileTap={isFormValid ? { scale: 0.97 } : {}}
                                        className={`w-full h-[46px] font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-300 ${isFormValid
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl cursor-pointer'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                                            }`}
                                    >
                                        <FaWhatsapp className={isFormValid ? 'text-lg' : 'text-base opacity-60'} />
                                        <FaPhoneAlt className={isFormValid ? 'text-[10px]' : 'text-[10px] opacity-60'} />
                                        Get Quote
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-6 border-t border-gray-100" />

                        {/* ===== VEHICLE TYPE CARDS ===== */}
                        <div>
                            <p className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-4 flex items-center">
                                <span className="w-5 h-5 bg-india-blue-100 rounded-full flex items-center justify-center mr-2">
                                    <FaCar className="text-india-blue-500 text-[10px]" />
                                </span>
                                Choose Your Ride
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {cabTypes.map((cab) => (
                                    <motion.button
                                        key={cab.value}
                                        type="button"
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => setFormData(prev => ({ ...prev, cabType: cab.value }))}
                                        className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-300 ${formData.cabType === cab.value
                                            ? 'border-india-blue-500 bg-india-blue-50/50 shadow-lg shadow-india-blue-500/10'
                                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        {cab.popular && (
                                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-india-saffron-500 to-india-saffron-600 text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                                                Popular
                                            </div>
                                        )}
                                        {formData.cabType === cab.value && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-india-blue-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="text-3xl mb-1.5">{cab.icon}</div>
                                        <div className="font-bold text-gray-800 text-sm">{cab.label}</div>
                                        <div className="mt-1">
                                            <span className="text-xl font-black" style={{ color: cab.color }}>{cab.price}</span>
                                            <span className="text-gray-400 text-[10px]">/km</span>
                                        </div>
                                        <div className="text-gray-400 text-[10px] mt-0.5">{cab.seats}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1">🔒 Secure Booking</span>
                            <span className="flex items-center gap-1">✅ Verified Drivers</span>
                            <span className="flex items-center gap-1">💰 No Hidden Charges</span>
                            <span className="flex items-center gap-1">📞 24/7 Support</span>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default BookingForm;
