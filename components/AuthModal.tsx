
import React, { Fragment } from 'react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md"
                        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
                    >
                        <div className="bg-white p-4 sm:p-6">
                            <div className="flex items-start justify-between">
                                <h3 className="text-xl font-serif font-bold leading-6 text-maroon-900" id="modal-title">
                                    {title}
                                </h3>
                                <button
                                    type="button"
                                    className="-m-2 p-2 text-maroon-500 hover:text-maroon-800"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close panel</span>
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="mt-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;