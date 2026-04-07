import React, { lazy, Suspense, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Lazy load all booking page components
const BookingForm = lazy(() => import('../components/BookingForm'));
const PopularRoutes = lazy(() => import('../components/PopularRoutes'));
const PricingTable = lazy(() => import('../components/PricingTable'));

// Loading skeleton
const SectionLoader = () => (
    <div className="py-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-india-blue-200 border-t-india-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium animate-pulse">Loading...</p>
        </div>
    </div>
);

const BookingPage = React.memo(() => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Read package info from URL query params (set by TourPackages "Book Now")
    const pkgName  = searchParams.get('package');
    const pkgPrice = searchParams.get('price');
    const pkgEmoji = searchParams.get('emoji');
    const pkgLoc   = searchParams.get('location');

    const packageInfo = pkgName
        ? {
              name:     pkgName,
              price:    pkgPrice ? parseFloat(pkgPrice) : null,
              emoji:    pkgEmoji || '📦',
              location: pkgLoc   || '',
          }
        : null;

    return (
        <div>
            {/* Page Header */}
            <section className="py-24 bg-gradient-to-br from-india-blue-900 via-india-blue-700 to-india-saffron-600 relative overflow-hidden z-0">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[5] text-center text-white">
                    {packageInfo ? (
                        <>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/30">
                                📦 Package Booking
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-4">
                                {packageInfo.emoji} {packageInfo.name}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                                {packageInfo.price
                                    ? `Fixed package price ₹${packageInfo.price.toLocaleString('en-IN')}`
                                    : 'Fill your details to get a custom quote'}
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-5xl md:text-6xl font-bold mb-4">Book Your Ride</h1>
                            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                                Fast, reliable &amp; transparent cab booking across India
                            </p>
                        </>
                    )}
                </div>
            </section>

            <Suspense fallback={<SectionLoader />}>
                <BookingForm packageInfo={packageInfo} />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <PopularRoutes />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
                <PricingTable />
            </Suspense>
        </div>
    );
});

export default BookingPage;
