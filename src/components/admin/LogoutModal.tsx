'use client';

import { X, LogOut } from 'lucide-react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="p-6 sm:p-8 text-center">
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <LogOut className="w-8 h-8 text-red-600" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Confirm Logout
                    </h3>
                    <p className="text-gray-500 mb-8">
                        Are you sure you want to sign out of the StarStore Admin Panel?
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition shadow-lg shadow-red-200"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
