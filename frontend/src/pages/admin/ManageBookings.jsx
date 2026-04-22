import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, CheckCircle, XCircle, Loader2, Trash2, Package, Car, Download } from 'lucide-react';
import { fetchBookings, updateBookingStatus, deleteBooking, apiCache } from '../../services/api';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useDataSync } from '../../hooks/useDataSync';

const ManageBookings = () => {
    const [bookings, setBookings] = useState(apiCache.bookings || []);
    const [loading, setLoading] = useState(!apiCache.bookings);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'ride' | 'package'
    const [confirmId, setConfirmId] = useState(null);

    const load = (silent = false) => {
        if (!silent && !apiCache.bookings) setLoading(true);
        fetchBookings()
            .then(data => {
                const arr = Array.isArray(data) ? data : (data?.bookings || []);
                apiCache.bookings = arr;
                setBookings(arr);
                if (!silent && !apiCache.bookings) setLoading(false);
                else setLoading(false);
            })
            .catch(() => {
                if (!silent) setLoading(false);
            });
    };

    useEffect(() => { load(); }, []);

    // ── Real-time sync via WebSocket ──
    useDataSync(() => load(true), 'bookings');

    const handleStatus = async (id, status) => {
        await updateBookingStatus(id, status);
        const next = bookings.map(b => b.id === id ? { ...b, status } : b);
        apiCache.bookings = next;
        setBookings(next);
    };

    const handleDelete = (id) => setConfirmId(id);
    const confirmDelete = async () => {
        await deleteBooking(confirmId);
        const next = bookings.filter(b => b.id !== confirmId);
        apiCache.bookings = next;
        setBookings(next);
        setConfirmId(null);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    // Format price for display
    const formatPrice = (b) => {
        if (b.type === 'package' && b.packagePrice) {
            return { label: `₹${Number(b.packagePrice).toLocaleString('en-IN')}`, sub: 'Fixed', color: 'text-india-blue-700' };
        }
        if (b.estimatedPrice) {
            return { label: `~₹${Number(b.estimatedPrice).toLocaleString('en-IN')}`, sub: b.estimatedKm ? `${b.estimatedKm} km` : 'Est.', color: 'text-green-700' };
        }
        return null;
    };

    const filtered = bookings
        .filter(b =>
            filterType === 'all' ? true : (b.type || 'ride') === filterType
        )
        .filter(b =>
            b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.phone?.includes(searchTerm) ||
            b.pickup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const counts = {
        all: bookings.length,
        ride: bookings.filter(b => (b.type || 'ride') === 'ride').length,
        package: bookings.filter(b => b.type === 'package').length,
    };

    const handleDownloadStats = () => {
        if (!filtered || filtered.length === 0) return;

        const headers = [
            'ID',
            'Type',
            'Customer Name',
            'Phone',
            'Email',
            'Pickup/Package Name',
            'Destination',
            'Travel Date',
            'Vehicle/Trip Type',
            'Passengers',
            'Est. Price',
            'Status'
        ].join(',');

        const csvRows = filtered.map(b => {
            const isPackage = b.type === 'package';
            const pickupOrPackage = isPackage ? (b.packageName || '') : (b.pickup || '');
            const destination = isPackage ? '' : (b.destination || '');
            const vehicleOrTrip = isPackage ? '' : `${b.vehicleType || ''} ${b.tripType ? `(${b.tripType})` : ''}`;
            const price = isPackage ? (b.packagePrice || '') : (b.estimatedPrice || '');

            const escape = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;

            return [
                escape(b.id),
                escape(b.type || 'ride'),
                escape(b.customerName),
                escape(b.phone),
                escape(b.email),
                escape(pickupOrPackage),
                escape(destination),
                escape(b.travelDate),
                escape(vehicleOrTrip),
                escape(b.passengers),
                escape(price),
                escape(b.status),
                escape(b.message)
            ].join(',');
        });

        const csvString = [headers, ...csvRows].join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filterName = filterType === 'all' ? 'all' : filterType;
        link.setAttribute('download', `jayam_cabs_bookings_${filterName}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Booking Enquiries</h2>
                    <p className="text-sm text-gray-500 mt-1">Review and manage incoming customer requests</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { key: 'all', label: 'All', count: counts.all },
                        { key: 'ride', label: '🚗 Rides', count: counts.ride },
                        { key: 'package', label: '📦 Pkgs', count: counts.package },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setFilterType(tab.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterType === tab.key ? 'bg-india-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                    <button
                        onClick={handleDownloadStats}
                        disabled={filtered.length === 0}
                        className="ml-auto sm:ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        title="Download as CSV"
                    >
                        <Download size={14} /> Download Stats
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search by name, phone, route or package..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-blue-400 rounded-lg" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                    </div>
                ) : (
                    <div className="w-full">
                        <table className="w-full text-left border-collapse flex flex-col lg:table">
                            <thead className="hidden lg:table-header-group">
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="py-4 px-6 font-medium">Customer</th>
                                    <th className="py-4 px-6 font-medium">Trip / Package</th>
                                    <th className="py-4 px-6 font-medium">Price</th>
                                    <th className="py-4 px-6 font-medium">Status</th>
                                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 lg:divide-gray-100 text-sm text-gray-700 flex flex-col lg:table-row-group">
                                {filtered.length === 0 ? (
                                    <tr className="block lg:table-row text-center py-12">
                                        <td colSpan="5" className="py-12 text-center text-gray-400 block lg:table-cell">
                                            No bookings found.
                                        </td>
                                    </tr>
                                ) : filtered.map(b => {
                                    const isPackage = b.type === 'package';
                                    const price = formatPrice(b);

                                    return (
                                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors flex flex-col lg:table-row p-4 pb-5 lg:p-0 relative">
                                            {/* Customer */}
                                            <td className="py-1.5 lg:py-4 px-0 lg:px-6 block lg:table-cell">
                                                <div className="font-medium text-gray-900">{b.customerName}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{b.phone}</div>
                                                {b.email && <div className="text-xs text-gray-400">{b.email}</div>}
                                                {/* Type badge */}
                                                <div className="mt-1.5">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${isPackage ? 'bg-india-blue-50 text-india-blue-700 border-india-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                        {isPackage ? <Package size={9} /> : <Car size={9} />}
                                                        {isPackage ? 'Package' : 'Ride'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Trip Details */}
                                            <td className="py-2 lg:py-4 px-0 lg:px-6 block lg:table-cell">
                                                {isPackage ? (
                                                    <>
                                                        <div className="font-semibold text-india-blue-800">
                                                            {b.packageEmoji || '📦'} {b.packageName}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                            <Calendar size={11} /> {b.travelDate}
                                                            <span className="ml-2">👥 {b.passengers}</span>
                                                        </div>
                                                        {b.message && <div className="text-xs text-gray-400 mt-1 italic">"{b.message}"</div>}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                                                            <MapPin size={13} className="text-gray-400 shrink-0" />
                                                            {b.pickup} → {b.destination}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                                                            {b.travelDate && <span className="flex items-center gap-1"><Calendar size={11} />{b.travelDate}</span>}
                                                            {b.vehicleType && <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] capitalize">{b.vehicleType}</span>}
                                                            {b.tripType && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">{b.tripType === 'oneWay' ? 'One Way' : b.tripType === 'roundTrip' ? 'Round Trip' : 'Local'}</span>}
                                                            <span>👥 {b.passengers}</span>
                                                        </div>
                                                        {b.message && <div className="text-xs text-gray-400 mt-1 italic">"{b.message}"</div>}
                                                    </>
                                                )}
                                            </td>

                                            {/* Price */}
                                            <td className="py-1.5 lg:py-4 px-0 lg:px-6 block lg:table-cell">
                                                {price ? (
                                                    <div>
                                                        <div className={`font-bold text-base ${price.color}`}>{price.label}</div>
                                                        <div className="text-gray-400 text-[10px]">{price.sub}</div>
                                                        {!isPackage && b.estimatedKm && b.pricePerKm && (
                                                            <div className="text-[10px] text-gray-400">₹{b.pricePerKm}/km</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300 text-xs">—</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="py-2 lg:py-4 px-0 lg:px-6 block lg:table-cell absolute top-4 right-4 lg:static">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClass(b.status)}`}>
                                                    {b.status?.charAt(0).toUpperCase() + b.status?.slice(1) || 'Pending'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="pt-4 lg:pt-0 pb-1 lg:pb-0 px-0 lg:py-4 lg:px-6 block lg:table-cell border-t border-gray-100 mt-2 lg:border-t-0 lg:mt-0 lg:text-right">
                                                <div className="flex items-center justify-start lg:justify-end gap-3 lg:gap-2">
                                                    {b.status !== 'confirmed' && (
                                                        <button onClick={() => handleStatus(b.id, 'confirmed')}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 border border-green-200 rounded-md text-xs font-medium flex items-center gap-1">
                                                            <CheckCircle size={13} /> Confirm
                                                        </button>
                                                    )}
                                                    {b.status !== 'cancelled' && (
                                                        <button onClick={() => handleStatus(b.id, 'cancelled')}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-md text-xs font-medium flex items-center gap-1">
                                                            <XCircle size={13} /> Cancel
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDelete(b.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={confirmId !== null}
                title="Delete Booking?"
                message="This booking enquiry will be permanently deleted and cannot be recovered."
                confirmLabel="Delete Booking"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setConfirmId(null)}
            />
        </div>
    );
};

export default ManageBookings;
