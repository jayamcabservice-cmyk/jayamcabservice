import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Loader2, Users, Briefcase, Eye, EyeOff } from 'lucide-react';
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../services/api';
import { broadcastUpdate } from '../../hooks/useDataSync';
import ImageUpload from '../../components/admin/ImageUpload';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY_FORM = {
    name: '', 
    type: 'car', 
    model: '',
    seating: '',
    luggage: '',
    pricePerKm: '',
    pricePerDay: '',
    description: '', 
    imageUrl: null,
    category: 'standard', 
    status: 'available'
};

const ManageVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [confirmId, setConfirmId] = useState(null);
    const [statusConfirm, setStatusConfirm] = useState(null); // { id, name, currentStatus }

    // Form is valid when name, pricePerKm, and an image are provided
    const isFormValid = form.name?.trim() && form.pricePerKm?.trim() && form.imageUrl;

    const load = async () => {
        setLoading(true);
        try {
            const data = await fetchVehicles();
            setVehicles(data.vehicles || []);
        } catch (error) {
            console.error('Failed to load vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setShowModal(true); };
    const openEdit = (v) => { 
        setForm({ 
            ...v,
            imageUrl: v.imageUrl || v.image || null,
            pricePerKm: v.pricePerKm || '',
            pricePerDay: v.pricePerDay?.toString() || '',
            model: v.model || '',
            seating: v.seating || '',
            luggage: v.luggage || '',
        }); 
        setEditItem(v); 
        setShowModal(true); 
    };
    const closeModal = () => { setShowModal(false); setEditItem(null); };

    // Extract clean URL strings from imageUrl (may be object from upload or plain string from URL mode)
    const resolveImageFields = (imageUrlField) => {
        if (!imageUrlField) return { imageUrl: '', thumbnailUrl: '', publicId: null };
        if (typeof imageUrlField === 'string') {
            return { imageUrl: imageUrlField, thumbnailUrl: imageUrlField, publicId: null };
        }
        return {
            imageUrl: imageUrlField.imageUrl || '',
            thumbnailUrl: imageUrlField.thumbnailUrl || imageUrlField.imageUrl || '',
            publicId: imageUrlField.publicId || null,
        };
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { imageUrl, thumbnailUrl, publicId } = resolveImageFields(form.imageUrl);

            const vehicleData = {
                name: form.name,
                type: form.type,
                model: form.model || '',
                seating: form.seating || '',
                luggage: form.luggage || '',
                pricePerKm: form.pricePerKm || '',
                pricePerDay: parseFloat(form.pricePerDay) || 0,
                description: form.description || '',
                imageUrl,
                thumbnailUrl,
                publicId,
                category: form.category,
                status: form.status,
            };

            if (editItem) {
                await updateVehicle(editItem.id, vehicleData);
            } else {
                await createVehicle(vehicleData);
            }
            await load();
            closeModal();
        } catch (error) {
            console.error('Failed to save vehicle:', error);
            alert('Failed to save vehicle. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id) => setConfirmId(id);
    const confirmDelete = async () => {
        await deleteVehicle(confirmId);
        setVehicles(v => v.filter(x => x.id !== confirmId));
        setConfirmId(null);
    };

    const handleToggleStatus = (v) => {
        setStatusConfirm({ id: v.id, name: v.name, currentStatus: v.status });
    };
    const confirmToggleStatus = () => {
        if (!statusConfirm) return;
        const { id, currentStatus } = statusConfirm;
        const newStatus = currentStatus === 'available' ? 'hidden' : 'available';

        // ── Optimistic update: close dialog & flip state instantly ──
        setStatusConfirm(null);
        setVehicles(vs => vs.map(v => v.id === id ? { ...v, status: newStatus } : v));

        // ── Background API call ──
        updateVehicle(id, { status: newStatus })
            .then(() => broadcastUpdate('vehicles'))   // notify other tabs
            .catch(() => {
                // Rollback on failure
                setVehicles(vs => vs.map(v => v.id === id ? { ...v, status: currentStatus } : v));
            });
    };

    const filtered = vehicles.filter(v =>
        v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Fleet Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your vehicles and pricing</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                    <Plus size={18} /> Add New Vehicle
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search vehicles or categories..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-blue-400 rounded-lg" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="py-4 px-6 font-medium">Vehicle</th>
                                    <th className="py-4 px-6 font-medium">Capacity</th>
                                    <th className="py-4 px-6 font-medium">Rate</th>
                                    <th className="py-4 px-6 font-medium">Status</th>
                                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="5" className="py-12 text-center text-gray-400">No vehicles found.</td></tr>
                                ) : filtered.map(v => (
                                    <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={v.imageUrl || v.thumbnailUrl || v.image}
                                                        alt={v.name}
                                                        className="h-full w-full object-cover"
                                                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64x48?text=No+Img'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{v.name}</div>
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">{v.model}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-3">
                                                <span className="flex items-center gap-1 text-gray-600" title="Seating"><Users size={14} className="text-gray-400" /> {v.seating}</span>
                                                <span className="flex items-center gap-1 text-gray-600" title="Luggage"><Briefcase size={14} className="text-gray-400" /> {v.luggage}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6"><div className="font-semibold text-gray-900">{v.pricePerKm}</div></td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                v.status === 'available'
                                                    ? 'bg-green-100 text-green-800 border-green-200'
                                                    : 'bg-gray-100 text-gray-500 border-gray-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    v.status === 'available' ? 'bg-green-500' : 'bg-gray-400'
                                                }`} />
                                                {v.status === 'available' ? 'Live' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(v)}
                                                    className={`p-2 rounded-md transition-colors ${
                                                        v.status === 'available'
                                                            ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                                                            : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                                                    }`}
                                                    title={v.status === 'available' ? 'Hide vehicle' : 'Go Live'}
                                                >
                                                    {v.status === 'available' ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                <button onClick={() => openEdit(v)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md"><Edit2 size={18} /></button>
                                                <button onClick={() => handleDelete(v.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">{editItem ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { label: 'Vehicle Name', key: 'name', placeholder: 'e.g. Innova Crysta', required: true },
                                { label: 'Model', key: 'model', placeholder: 'e.g. 6-7 Seater SUV' },
                                { label: 'Seating', key: 'seating', placeholder: 'e.g. 6-7 Passengers' },
                                { label: 'Luggage', key: 'luggage', placeholder: 'e.g. 4-5 Bags' },
                                { label: 'Price Per Km', key: 'pricePerKm', placeholder: 'e.g. ₹16-20/km', required: true },
                            ].map(({ label, key, placeholder, required }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                                    </label>
                                    <input type="text" value={form[key] || ''} placeholder={placeholder}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
                                </div>
                            ))}
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vehicle Image<span className="text-red-500 ml-0.5">*</span>
                                </label>
                                <ImageUpload
                                    value={form.imageUrl}
                                    onChange={val => setForm(f => ({ ...f, imageUrl: val }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400">
                                    {['standard', 'small', 'family', 'group', 'large', 'luxury'].map(c => (
                                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400">
                                    <option value="available">Available</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 pt-0">
                            <button onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !isFormValid}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors
                                    ${isFormValid && !saving
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                {saving && <Loader2 size={16} className="animate-spin" />}
                                {editItem ? 'Save Changes' : 'Add Vehicle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={confirmId !== null}
                title="Remove Vehicle?"
                message="This vehicle will be permanently removed from the fleet."
                confirmLabel="Remove Vehicle"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setConfirmId(null)}
            />

            {/* Hide / Live confirmation dialog */}
            <ConfirmDialog
                open={statusConfirm !== null}
                title={statusConfirm?.currentStatus === 'available' ? 'Hide Vehicle?' : 'Go Live?'}
                message={
                    statusConfirm?.currentStatus === 'available'
                        ? `"${statusConfirm?.name}" will be hidden from the public fleet listing. You can make it live again anytime.`
                        : `"${statusConfirm?.name}" will be published and visible to all visitors on the website.`
                }
                confirmLabel={statusConfirm?.currentStatus === 'available' ? 'Yes, Hide It' : '🚀 Go Live'}
                variant={statusConfirm?.currentStatus === 'available' ? 'warning' : 'success'}
                onConfirm={confirmToggleStatus}
                onCancel={() => setStatusConfirm(null)}
            />
        </div>
    );
};

export default ManageVehicles;
