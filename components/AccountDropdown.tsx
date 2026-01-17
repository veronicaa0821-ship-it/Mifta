
import React, { useRef, useEffect } from 'react';
import type { User } from '../types';

interface AccountDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onRegisterClick: () => void;
    onSignInClick: () => void;
    onSignOut: () => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ isOpen, onClose, user, onRegisterClick, onSignInClick, onSignOut }) => {
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
            role="dialog"
        >
            {user ? (
                <div className="p-4">
                    <p className="text-sm text-maroon-800 font-semibold">Hello, {user.name}!</p>
                    <p className="text-xs text-maroon-500 truncate mb-4">{user.email}</p>
                    <button
                        onClick={onSignOut}
                        className="flex items-center justify-center w-full rounded-md border border-maroon-300 bg-maroon-50 px-6 py-2.5 text-base font-semibold text-maroon-800 shadow-sm hover:bg-maroon-100 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <div className="p-4 space-y-3">
                    <h3 className="font-serif text-center font-bold text-maroon-900">Welcome to Zephyra</h3>
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
                </div>
            )}
        </div>
    );
};

export default AccountDropdown;
