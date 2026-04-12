import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for JAYAM Cab Service — Nashik
 * 
 * Features:
 * - Dynamic per-page title & meta description
 * - Canonical URL handling
 * - Open Graph (Facebook) tags
 * - Twitter Card tags
 * - JSON-LD LocalBusiness schema (Nashik cab service)
 * - JSON-LD WebSite schema with SearchAction
 * - Geo meta tags for Nashik, Maharashtra
 * - Robots directive
 * - Local SEO keywords
 */

const SITE_NAME = 'JAYAM Cab Service';
const SITE_URL = 'https://www.jayamcabservice.com';
const DEFAULT_TITLE = 'Best Cab Service in Nashik | Car Rental & Taxi Booking — JAYAM Travels';
const DEFAULT_DESCRIPTION =
    'Book affordable cab service in Nashik. Car rental, taxi to Pune, Shirdi, Mumbai & outstation trips across Maharashtra. 24/7 support. Call +91 70305 71513';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.jpeg`;
const PHONE = '+917030571513';
const EMAIL = 'jayamcabservice@gmail.com';

// Nashik geo coordinates
const GEO = {
    latitude: '20.0063',
    longitude: '73.7810',
    region: 'IN-MH',
    placename: 'Nashik',
};

// LocalBusiness JSON-LD (appears on every page)
const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'JAYAM Cab Service',
    alternateName: 'JAYAM Travels',
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: DEFAULT_IMAGE,
    priceRange: '₹9 - ₹40 per km',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Online Payment',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Hirawadi',
        addressLocality: 'Nashik',
        addressRegion: 'Maharashtra',
        postalCode: '422003',
        addressCountry: 'IN',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: GEO.latitude,
        longitude: GEO.longitude,
    },
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '20:00',
        },
    ],
    areaServed: [
        { '@type': 'City', name: 'Nashik' },
        { '@type': 'City', name: 'Pune' },
        { '@type': 'City', name: 'Mumbai' },
        { '@type': 'City', name: 'Shirdi' },
        { '@type': 'State', name: 'Maharashtra' },
    ],
    serviceType: [
        'Car Rental',
        'Taxi Service',
        'Cab Booking',
        'Outstation Cab',
        'Local Sightseeing',
        'Airport Transfer',
    ],
    sameAs: [
        // Add real social media URLs here when available
    ],
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '500',
        bestRating: '5',
    },
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
    },
    potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/booking?package={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
};

const SEO = ({
    title,
    description,
    keywords,
    image,
    url = '/',
    type = 'website',
    noindex = false,
    schema, // Additional page-specific JSON-LD
}) => {
    const metaTitle = title || DEFAULT_TITLE;
    const metaDescription = description || DEFAULT_DESCRIPTION;
    const metaImage = image
        ? image.startsWith('http')
            ? image
            : `${SITE_URL}${image}`
        : DEFAULT_IMAGE;
    const metaUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
    const metaKeywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;

    return (
        <Helmet>
            {/* ── Primary Meta Tags ── */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            {metaKeywords && <meta name="keywords" content={metaKeywords} />}
            <meta
                name="robots"
                content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
            />

            {/* ── Canonical URL ── */}
            <link rel="canonical" href={metaUrl} />

            {/* ── Geo Meta Tags (Nashik, Maharashtra) ── */}
            <meta name="geo.region" content={GEO.region} />
            <meta name="geo.placename" content={GEO.placename} />
            <meta name="geo.position" content={`${GEO.latitude};${GEO.longitude}`} />
            <meta name="ICBM" content={`${GEO.latitude}, ${GEO.longitude}`} />

            {/* ── Open Graph / Facebook ── */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="en_IN" />

            {/* ── Twitter Card ── */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={metaUrl} />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* ── JSON-LD: LocalBusiness (on every page) ── */}
            <script type="application/ld+json">
                {JSON.stringify(localBusinessSchema)}
            </script>

            {/* ── JSON-LD: WebSite (on every page) ── */}
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>

            {/* ── Additional page-specific schema ── */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
