const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    },
});

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://travel-kqnc.onrender.com',
        /\.onrender\.com$/,
    ],
    credentials: true,
}));
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(uploadsDir));

// ─── UPLOAD ROUTE ───────────────────────────────────────────────────────────

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const host = req.get('host');
    const protocol = req.protocol;
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl, filename: req.file.filename });
});


// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) console.error('DB connection error:', err.message);
    else console.log('✅ Connected to SQLite');
});

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        destinations TEXT,
        duration TEXT,
        price TEXT,
        image TEXT,
        category TEXT,
        emoji TEXT,
        status TEXT DEFAULT 'active'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        model TEXT,
        seating TEXT,
        luggage TEXT,
        image TEXT,
        pricePerKm TEXT,
        category TEXT,
        status TEXT DEFAULT 'available'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        pickup TEXT,
        destination TEXT,
        travel_date TEXT,
        vehicle_type TEXT,
        passengers INTEGER,
        message TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed packages if empty
    db.get('SELECT COUNT(*) as count FROM packages', (err, row) => {
        if (!err && row.count === 0) {
            const packages = [
                ['Golden Triangle Tour', 'Delhi – Agra – Jaipur', '5 Days / 4 Nights', '₹15,999', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop', 'heritage', '🏛️'],
                ['Kerala Backwaters Tour', 'Munnar – Alleppey – Kochi', '6 Days / 5 Nights', '₹18,999', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2048&auto=format&fit=crop', 'beach', '🏝️'],
                ['Kashmir Paradise Tour', 'Srinagar – Gulmarg – Pahalgam', '5 Days / 4 Nights', '₹22,999', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2787&auto=format&fit=crop', 'mountain', '🏔️'],
                ['Himachal Adventure Tour', 'Manali – Kasol – Shimla', '6 Days / 5 Nights', '₹17,499', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop', 'adventure', '🏔️'],
                ['Goa Beach Holiday', 'North & South Goa', '4 Days / 3 Nights', '₹12,999', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070&auto=format&fit=crop', 'beach', '🏖️'],
                ['Rajasthan Royal Tour', 'Jaipur – Udaipur – Jodhpur', '7 Days / 6 Nights', '₹24,999', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop', 'heritage', '🏰️'],
            ];
            const stmt = db.prepare('INSERT INTO packages (name, destinations, duration, price, image, category, emoji) VALUES (?, ?, ?, ?, ?, ?, ?)');
            packages.forEach(p => stmt.run(p));
            stmt.finalize();
            console.log('✅ Seeded packages');
        }
    });

    // Seed vehicles if empty
    db.get('SELECT COUNT(*) as count FROM vehicles', (err, row) => {
        if (!err && row.count === 0) {
            const vehicles = [
                ['Sedan', 'Swift Dzire / Etios', '4 Passengers', '2-3 Bags', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800', '₹12-14/km', 'small'],
                ['SUV', 'Innova Crysta / Ertiga', '6-7 Passengers', '4-5 Bags', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800', '₹16-20/km', 'family'],
                ['Tempo Traveller', '12-17 Seater', '12-17 Passengers', '10-12 Bags', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800', '₹25-30/km', 'group'],
                ['Luxury Coach', '20-35 Seater AC Bus', '20-35 Passengers', '15-20 Bags', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800', '₹40-50/km', 'large'],
            ];
            const stmt = db.prepare('INSERT INTO vehicles (name, model, seating, luggage, image, pricePerKm, category) VALUES (?, ?, ?, ?, ?, ?, ?)');
            vehicles.forEach(v => stmt.run(v));
            stmt.finalize();
            console.log('✅ Seeded vehicles');
        }
    });
});

// ─── PACKAGES ROUTES ────────────────────────────────────────────────────────

app.get('/api/packages', (req, res) => {
    db.all('SELECT * FROM packages ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/packages', (req, res) => {
    const { name, destinations, duration, price, image, category, emoji } = req.body;
    db.run(
        'INSERT INTO packages (name, destinations, duration, price, image, category, emoji) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, destinations, duration, price, image, category, emoji || '🗺️'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, destinations, duration, price, image, category, emoji: emoji || '🗺️', status: 'active' });
        }
    );
});

app.put('/api/packages/:id', (req, res) => {
    const { name, destinations, duration, price, image, category, emoji, status } = req.body;
    db.run(
        'UPDATE packages SET name=?, destinations=?, duration=?, price=?, image=?, category=?, emoji=?, status=? WHERE id=?',
        [name, destinations, duration, price, image, category, emoji, status, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.delete('/api/packages/:id', (req, res) => {
    db.run('DELETE FROM packages WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ─── VEHICLES ROUTES ────────────────────────────────────────────────────────

app.get('/api/vehicles', (req, res) => {
    db.all('SELECT * FROM vehicles ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/vehicles', (req, res) => {
    const { name, model, seating, luggage, image, pricePerKm, category } = req.body;
    db.run(
        'INSERT INTO vehicles (name, model, seating, luggage, image, pricePerKm, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, model, seating, luggage, image, pricePerKm, category],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, model, seating, luggage, image, pricePerKm, category, status: 'available' });
        }
    );
});

app.put('/api/vehicles/:id', (req, res) => {
    const { name, model, seating, luggage, image, pricePerKm, category, status } = req.body;
    db.run(
        'UPDATE vehicles SET name=?, model=?, seating=?, luggage=?, image=?, pricePerKm=?, category=?, status=? WHERE id=?',
        [name, model, seating, luggage, image, pricePerKm, category, status, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.delete('/api/vehicles/:id', (req, res) => {
    db.run('DELETE FROM vehicles WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ─── BOOKINGS ROUTES ────────────────────────────────────────────────────────

app.get('/api/bookings', (req, res) => {
    db.all('SELECT * FROM bookings ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/bookings', (req, res) => {
    const { customer_name, phone, email, pickup, destination, travel_date, vehicle_type, passengers, message } = req.body;
    db.run(
        'INSERT INTO bookings (customer_name, phone, email, pickup, destination, travel_date, vehicle_type, passengers, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [customer_name, phone, email, pickup, destination, travel_date, vehicle_type, passengers, message],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Booking submitted successfully!' });
        }
    );
});

app.put('/api/bookings/:id/status', (req, res) => {
    const { status } = req.body;
    db.run('UPDATE bookings SET status=? WHERE id=?', [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/bookings/:id', (req, res) => {
    db.run('DELETE FROM bookings WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
