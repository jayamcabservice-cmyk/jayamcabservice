import React from 'react';
import Vehicles from '../components/Vehicles';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const VehiclesPage = React.memo(() => {
    return (
        <div>
            <SEO
                title="Rental Cars & Taxi Fleet in Nashik | Sedan, SUV, Tempo — JAYAM Travels"
                description="Choose from our fleet of well-maintained cars in Nashik. Hatchback, Sedan, SUV, Tempo Traveller & Bus rental. Transparent pricing ₹9/km onwards."
                keywords={[
                    'car rental nashik', 'sedan rental nashik', 'suv hire nashik',
                    'tempo traveller nashik', 'innova on rent nashik', 'bus rental nashik',
                    'luxury car rental nashik', 'nashik cab with driver', 'wedding car rental nashik',
                ]}
                url="/vehicles"
            />
            {/* Page Header */}
            <section className="py-20 bg-gradient-to-br from-india-saffron-600 via-india-saffron-500 to-india-blue-600 relative overflow-hidden z-0">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[5]">
                    <motion.div
                        className="text-center text-white"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Our Vehicle Fleet in Nashik
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
                            Well-maintained, comfortable vehicles for every journey — starting ₹9/km
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vehicles Component */}
            <Vehicles />
        </div>
    );
});

export default VehiclesPage;

