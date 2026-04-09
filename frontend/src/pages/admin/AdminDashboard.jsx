import React, { useState, useEffect, useMemo } from 'react';
import { Package, Car, CalendarCheck, TrendingUp, Loader2 } from 'lucide-react';
import { fetchBookings, fetchPackages, fetchVehicles, apiCache } from '../../services/api';
import { useDataSync } from '../../hooks/useDataSync';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
            {icon}
        </div>
    </div>
);

const AdminDashboard = () => {
    const [bookings, setBookings] = useState(apiCache.bookings || []);
    const [packagesCount, setPackagesCount] = useState(apiCache.packages?.length || 0);
    const [vehiclesCount, setVehiclesCount] = useState(apiCache.vehicles?.length || 0);
    const [loading, setLoading] = useState(!apiCache.bookings);

    const loadDashboardData = async (silent = false) => {
        try {
            if (!silent && !apiCache.bookings) setLoading(true);
            const [bData, pData, vData] = await Promise.all([
                fetchBookings({ limit: 50 }),
                fetchPackages(),
                fetchVehicles()
            ]);
            
            const bArr = Array.isArray(bData) ? bData : (bData?.bookings || []);
            const pArr = Array.isArray(pData) ? pData : (pData?.packages || []);
            const vArr = Array.isArray(vData) ? vData : (vData?.vehicles || []);
            
            apiCache.bookings = bArr;
            apiCache.packages = pArr;
            apiCache.vehicles = vArr;

            setBookings(bArr);
            setPackagesCount(pArr.length);
            setVehiclesCount(vArr.filter(v => v.status !== 'maintenance' && v.status !== 'hidden').length);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            if (!silent && !apiCache.bookings) setLoading(false);
            else setLoading(false);
        }
    };

    useEffect(() => { loadDashboardData(); }, []);

    // ── Real-time sync via WebSocket for everything ──
    useDataSync(() => loadDashboardData(true));

    const recentBookings = bookings.slice(0, 5);

    const revenue = useMemo(() => {
        return bookings.reduce((sum, b) => {
            if (b.status === 'completed' || b.status === 'confirmed') {
                const amt = b.packagePrice || b.estimatedPrice || 0;
                return sum + Number(amt);
            }
            return sum;
        }, 0);
    }, [bookings]);

    const formatCurrency = (amt) => {
        if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
        if (amt >= 1000) return `₹${(amt / 1000).toFixed(1)}K`;
        return `₹${amt}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-india-blue-600 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Packages"
                    value={packagesCount}
                    icon={<Package size={24} className="text-india-blue-600" />}
                    color="bg-india-blue-50"
                />
                <StatCard
                    title="Active Vehicles"
                    value={vehiclesCount}
                    icon={<Car size={24} className="text-green-600" />}
                    color="bg-green-50"
                />
                <StatCard
                    title="Recent Bookings"
                    value={bookings.length}
                    icon={<CalendarCheck size={24} className="text-india-saffron-600" />}
                    color="bg-india-saffron-50"
                />
                <StatCard
                    title="Revenue (Est.)"
                    value={formatCurrency(revenue)}
                    icon={<TrendingUp size={24} className="text-purple-600" />}
                    color="bg-purple-50"
                />
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Recent Booking Enquiries</h3>
                    <Link to="/admin/bookings" className="text-sm font-medium text-india-blue-600 hover:text-india-blue-800">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="py-4 px-6 font-medium">Customer</th>
                                <th className="py-4 px-6 font-medium">Trip Details</th>
                                <th className="py-4 px-6 font-medium">Date</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {recentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">No bookings found</td>
                                </tr>
                            ) : recentBookings.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-medium">{b.customerName || 'N/A'}</td>
                                    <td className="py-4 px-6">
                                        {b.type === 'package' ? (
                                            <span className="text-india-blue-700 font-medium">📦 {b.packageName}</span>
                                        ) : (
                                            <span>🚗 {b.pickup} <span className="text-gray-400">to</span> {b.destination}</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-gray-500">
                                        {new Date(b.createdAt?._seconds ? b.createdAt._seconds * 1000 : b.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {(b.status || 'pending').charAt(0).toUpperCase() + (b.status || 'pending').slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
