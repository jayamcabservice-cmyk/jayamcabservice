import React, { useRef, useState } from 'react';
import { Upload, X, Image, Link, Loader2 } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/+$/, '');

/**
 * ImageUpload component
 * Props:
 *   value      — current image URL string
 *   onChange   — (url: string) => void
 */
const ImageUpload = ({ value, onChange }) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mode, setMode] = useState('upload'); // 'upload' | 'url'
    const [urlInput, setUrlInput] = useState(value?.startsWith('http') ? value : '');
    const [error, setError] = useState('');

    const uploadFile = async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
        setUploading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) { onChange(data.url); }
            else { setError(data.error || 'Upload failed.'); }
        } catch {
            setError('Upload failed. Make sure the backend is running.');
        } finally {
            setUploading(false);
        }
    };

    const handleFile = (e) => uploadFile(e.target.files?.[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        uploadFile(e.dataTransfer.files?.[0]);
    };

    const handleUrlApply = () => {
        if (urlInput) { onChange(urlInput); setError(''); }
    };

    const clear = () => { onChange(''); setUrlInput(''); };

    return (
        <div className="space-y-3">
            {/* Mode Toggle */}
            <div className="flex gap-2 text-xs font-medium">
                <button type="button" onClick={() => setMode('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${mode === 'upload' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 border-gray-200 hover:border-blue-300'}`}>
                    <Upload size={12} /> Upload from PC
                </button>
                <button type="button" onClick={() => setMode('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${mode === 'url' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 border-gray-200 hover:border-blue-300'}`}>
                    <Link size={12} /> Paste URL
                </button>
            </div>

            {mode === 'upload' ? (
                /* ── Drag & Drop Zone ── */
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !uploading && inputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all select-none
                        ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    {uploading ? (
                        <><Loader2 className="animate-spin text-blue-500" size={28} /><p className="text-sm text-gray-500">Uploading…</p></>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
                                <Image className="text-blue-400" size={22} />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Drag & drop or <span className="text-blue-600 underline">browse</span></p>
                            <p className="text-xs text-gray-400">JPG, PNG, WEBP — max 10MB</p>
                        </>
                    )}
                </div>
            ) : (
                /* ── URL Input ── */
                <div className="flex gap-2">
                    <input
                        type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    />
                    <button type="button" onClick={handleUrlApply}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        Apply
                    </button>
                </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            {/* Preview */}
            {value && (
                <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={value} alt="Preview" className="w-full h-40 object-cover" onError={e => e.target.src = 'https://via.placeholder.com/400x160?text=Invalid+Image'} />
                    <button type="button" onClick={clear}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow hover:bg-red-50 text-red-500 transition-colors">
                        <X size={16} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent px-3 py-1.5">
                        <p className="text-white text-[10px] truncate">{value}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
