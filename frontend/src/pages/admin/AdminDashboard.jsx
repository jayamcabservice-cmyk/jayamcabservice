import React from 'react';
import { Package, Car, CalendarCheck, TrendingUp } from 'lucide-react';

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
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Packages"
                    value="12"
                    icon={<Package size={24} className="text-india-blue-600" />}
                    color="bg-india-blue-50"
                />
                <StatCard
                    title="Active Vehicles"
                    value="45"
                    icon={<Car size={24} className="text-green-600" />}
                    color="bg-green-50"
                />
                <StatCard
                    title="Recent Bookings"
                    value="128"
                    icon={<CalendarCheck size={24} className="text-india-saffron-600" />}
                    color="bg-india-saffron-50"
                />
                <StatCard
                    title="Revenue (This Month)"
                    value="₹4.2L"
                    icon={<TrendingUp size={24} className="text-purple-600" />}
                    color="bg-purple-50"
                />
            </div>

            {/* Recent Activity Table (Mock) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Recent Booking Enquiries</h3>
                    <button className="text-sm font-medium text-india-blue-600 hover:text-india-blue-800">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="py-4 px-6 font-medium">Customer</th>
                                <th className="py-4 px-6 font-medium">Trip</th>
                                <th className="py-4 px-6 font-medium">Date</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-medium">Rahul Sharma</td>
                                    <td className="py-4 px-6">Mumbai to Pune (Sedan)</td>
                                    <td className="py-4 px-6 text-gray-500">Oct 24, 2024</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pending
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
