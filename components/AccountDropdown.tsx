
import React, { useRef, useEffect } from 'react';

interface AccountDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onRegisterClick: () => void;
    onSignInClick: () => void;
}

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);


const AccountDropdown: React.FC<AccountDropdownProps> = ({ isOpen, onClose, onRegisterClick, onSignInClick }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div
            ref={dropdownRef}
            className={`absolute top-full right-0 mt-2 w-64 rounded-lg bg-white shadow-2xl border border-maroon-100 z-50 overflow-hidden transition-all duration-200 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            aria-modal="true"
            role="dialog"
        >
            <div className="p-4 space-y-3">
                <button
                    onClick={onRegisterClick}
                    className="flex items-center justify-center w-full rounded-md border border-transparent bg-maroon-800 px-6 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-maroon-900 transition-colors"
                >
                    Register
                </button>
                 <button
                    onClick={onSignInClick}
                    className="flex items-center justify-center w-full rounded-md border border-maroon-300 bg-maroon-50 px-6 py-2.5 text-base font-semibold text-maroon-800 shadow-sm hover:bg-maroon-100 transition-colors"
                >
                    Sign In
                </button>
                
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-maroon-200"></div>
                    <span className="flex-shrink mx-4 text-sm text-maroon-500">or</span>
                    <div className="flex-grow border-t border-maroon-200"></div>
                </div>

                <button
                    onClick={onSignInClick}
                    className="flex items-center justify-center w-full rounded-md border border-maroon-300 bg-white px-6 py-2.5 text-base font-medium text-maroon-800 shadow-sm hover:bg-maroon-100 transition-colors"
                >
                    <GoogleIcon />
                    Continue with Google
                </button>

            </div>
        </div>
    );
};

export default AccountDropdown;
