import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

/**
 * ConfirmDialog — Custom in-app confirmation modal
 * Props:
 *   open      — boolean
 *   title     — string
 *   message   — string
 *   onConfirm — () => void
 *   onCancel  — () => void
 *   confirmLabel — string (default "Delete")
 *   danger    — boolean (default true)
 *   variant   — 'danger' | 'warning' | 'success' (overrides danger prop)
 */
const ConfirmDialog = ({
    open,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    onConfirm,
    onCancel,
    confirmLabel = 'Delete',
    danger = true,
    variant, // 'danger' | 'warning' | 'success'
}) => {
    // Resolve variant: explicit variant prop wins, otherwise fall back to danger bool
    const resolvedVariant = variant || (danger ? 'danger' : 'warning');
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
                <div className="p-6">
                    {/* Icon + Close */}
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                resolvedVariant === 'success' ? 'bg-green-100' :
                                resolvedVariant === 'danger'  ? 'bg-red-100'   : 'bg-yellow-100'
                            }`}>
                            {resolvedVariant === 'success'
                                ? <CheckCircle2 className="text-green-600" size={22} />
                                : <AlertTriangle className={resolvedVariant === 'danger' ? 'text-red-600' : 'text-yellow-600'} size={22} />}
                        </div>
                        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Text */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
                            resolvedVariant === 'success' ? 'bg-green-600 hover:bg-green-700' :
                            resolvedVariant === 'danger'  ? 'bg-red-600 hover:bg-red-700'     : 'bg-yellow-500 hover:bg-yellow-600'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
