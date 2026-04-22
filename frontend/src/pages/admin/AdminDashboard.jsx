import React, { useState, useEffect, useMemo } from 'react';
import { Package, Car, CalendarCheck, TrendingUp, Loader2, BarChart2, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
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
                const amt = b.packagePrice || b.estimatedPrice || Number(b.price) || 0;
                return sum + Number(amt);
            }
            return sum;
        }, 0);
    }, [bookings]);

    // ── Recharts Data Aggregations ──

    const formatShortDate = (dateVal) => {
        if (!dateVal) return 'Unknown';
        const d = new Date(dateVal._seconds ? dateVal._seconds * 1000 : dateVal);
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const timeSeriesData = useMemo(() => {
        if (!bookings.length) return [];
        const grouped = {};
        
        // Sort chronologically
        const sortedBookings = [...bookings].sort((a, b) => {
            const dA = new Date(a.createdAt?._seconds ? a.createdAt._seconds * 1000 : a.createdAt || 0);
            const dB = new Date(b.createdAt?._seconds ? b.createdAt._seconds * 1000 : b.createdAt || 0);
            return dA - dB;
        });

        sortedBookings.forEach(b => {
            const dateStr = formatShortDate(b.createdAt);
            if (!grouped[dateStr]) {
                grouped[dateStr] = { date: dateStr, revenue: 0, queries: 0 };
            }
            grouped[dateStr].queries += 1;
            
            if (b.status === 'completed' || b.status === 'confirmed') {
                const amt = Number(b.packagePrice) || Number(b.estimatedPrice) || Number(b.price) || 0;
                grouped[dateStr].revenue += amt;
            }
        });

        // Show last 14 days
        return Object.values(grouped).slice(-14);
    }, [bookings]);

    const categoryData = useMemo(() => {
        let rides = 0, packages = 0;
        bookings.forEach(b => {
            if (b.type === 'package') packages++;
            else rides++;
        });
        return [
            { name: 'Ride Enquiries', value: rides },
            { name: 'Package Enquiries', value: packages }
        ];
    }, [bookings]);
    
    // Aesthetic colors for pie chart
    const CATEGORY_COLORS = ['#3B82F6', '#F59E0B'];

    const statusData = useMemo(() => {
        const counts = { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 };
        bookings.forEach(b => {
            let st = (b.status || 'pending').toLowerCase();
            if (st === 'pending') counts.Pending++;
            else if (st === 'confirmed') counts.Confirmed++;
            else if (st === 'completed') counts.Completed++;
            else if (st === 'cancelled') counts.Cancelled++;
            else counts.Pending++;
        });
        return [
            { name: 'Pending', count: counts.Pending, fill: '#FBBF24' },
            { name: 'Confirmed', count: counts.Confirmed, fill: '#10B981' },
            { name: 'Completed', count: counts.Completed, fill: '#3B82F6' },
            { name: 'Cancelled', count: counts.Cancelled, fill: '#EF4444' },
        ];
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

            {/* ── Real-Time Graphical Analytics Dashboard Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
                
                {/* Main Temporal Line Chart (Volume & Revenue) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                        <Activity className="text-india-blue-600" size={20} />
                        <h3 className="text-lg font-bold text-gray-800">Booking Volume Trend</h3>
                        <span className="ml-auto text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6B7280'}} tickLine={false} axisLine={false} />
                                <YAxis tick={{fontSize: 12, fill: '#6B7280'}} tickLine={false} axisLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value, name) => [value, name === 'queries' ? 'Enquiries' : name]}
                                />
                                <Area type="monotone" dataKey="queries" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Pie & Bar Segmented Breakdown */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    
                    {/* Pie Chart: Booking Categories */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-3">
                            <PieChartIcon className="text-india-saffron-500" size={18} />
                            <h3 className="text-base font-bold text-gray-800">Booking Types</h3>
                        </div>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '14px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart: Stage Pipeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                            <BarChart2 className="text-purple-500" size={18} />
                            <h3 className="text-base font-bold text-gray-800">Sales Pipeline</h3>
                        </div>
                        <div className="h-[140px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" tick={{fontSize: 11, fill: '#4B5563', fontWeight: 500}} tickLine={false} axisLine={false} width={70} />
                                    <RechartsTooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '13px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Recent Booking Enquiries</h3>
                    <Link to="/admin/bookings" className="text-sm font-medium text-india-blue-600 hover:text-india-blue-800">
                        View All
                    </Link>
                </div>
                <div className="w-full">
                    <table className="w-full text-left border-collapse flex flex-col lg:table">
                        <thead className="hidden lg:table-header-group">
                            <tr className="bg-gray-50 text-gray-500 text-xs sm:text-sm uppercase tracking-wider">
                                <th className="py-4 px-6 font-medium">Customer</th>
                                <th className="py-4 px-6 font-medium">Trip Details</th>
                                <th className="py-4 px-6 font-medium">Date</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 lg:divide-gray-100 text-sm text-gray-700 flex flex-col lg:table-row-group">
                            {recentBookings.length === 0 ? (
                                <tr className="block lg:table-row py-8 text-center">
                                    <td colSpan="4" className="py-8 text-center text-gray-500 block lg:table-cell">No bookings found</td>
                                </tr>
                            ) : recentBookings.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors flex flex-col lg:table-row p-4 pb-5 lg:p-0 relative border-b border-gray-100 lg:border-b-0">
                                    <td className="py-1.5 lg:py-4 px-0 lg:px-6 font-medium block lg:table-cell">{b.customerName || 'N/A'}</td>
                                    <td className="py-1.5 lg:py-4 px-0 lg:px-6 block lg:table-cell">
                                        {b.type === 'package' ? (
                                            <span className="text-india-blue-700 font-medium">📦 {b.packageName}</span>
                                        ) : (
                                            <span>🚗 {b.pickup} <span className="text-gray-400">to</span> {b.destination}</span>
                                        )}
                                    </td>
                                    <td className="py-1.5 lg:py-4 px-0 lg:px-6 text-gray-500 block lg:table-cell">
                                        {new Date(b.createdAt?._seconds ? b.createdAt._seconds * 1000 : b.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="py-2 lg:py-4 px-0 lg:px-6 block lg:table-cell absolute top-4 right-4 lg:static">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${
                                            b.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                                            b.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                            b.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                            'bg-yellow-100 text-yellow-800 border-yellow-200'
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
