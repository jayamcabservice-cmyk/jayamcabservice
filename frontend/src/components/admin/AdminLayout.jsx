import React, { useState, Suspense } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    Car,
    CalendarCheck,
    Menu,
    X,
    LogOut,
    ExternalLink
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear auth tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminPhone');
        // Clear PIN verification
        sessionStorage.removeItem('adminPinVerified');
        
        // Redirect to login page
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Tour Packages', path: '/admin/packages', icon: <Map size={20} /> },
        { name: 'Vehicles', path: '/admin/vehicles', icon: <Car size={20} /> },
        { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-50 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:inset-auto flex flex-col`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-4 sm:px-6 border-b border-gray-100 shrink-0">
                    <span className="text-base sm:text-xl font-bold">
                        <span className="text-india-blue-700">JAYAM</span>
                        <span className="text-india-saffron-500 text-xs sm:text-base block sm:inline ml-0 sm:ml-1">Travels Admin</span>
                    </span>
                    <button
                        className="ml-auto lg:hidden text-gray-500 hover:text-gray-700 p-2"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-4 sm:py-6 px-3 sm:px-4 space-y-1">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4 px-2">
                        Menu
                    </div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/admin' && location.pathname.startsWith(item.path));
                
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-base ${isActive
                                    ? 'bg-india-blue-50 text-india-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className={`${isActive ? 'text-india-blue-600' : 'text-gray-400'}`}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </div>

                {/* Footer Sidebar */}
                <div className="p-3 sm:p-4 border-t border-gray-100 shrink-0">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium text-base"
                    >
                        <ExternalLink size={18} className="text-gray-400 shrink-0" />
                        <span>View Live Site</span>
                    </a>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-base"
                    >
                        <LogOut size={18} className="text-red-400 shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 border-b border-gray-200 bg-white shrink-0">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            className="text-gray-500 hover:text-gray-700 lg:hidden p-2 rounded-md hover:bg-gray-100"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <Menu size={22} />
                        </button>
                        <h1 className="text-base sm:text-lg font-semibold text-gray-800 hidden xs:block truncate max-w-[200px] sm:max-w-none">
                            {navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Admin Panel'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-india-blue-100 text-india-blue-700 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                                A
                            </div>
                            <div className="hidden md:block">
                                <p className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Admin User</p>
                                <p className="text-xs text-gray-500">JAYAM Travels Owner</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content View */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
                    <Suspense fallback={
                        <div className="flex h-full items-center justify-center">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-india-blue-200 border-t-india-blue-600 rounded-full animate-spin"></div>
                        </div>
                    }>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
