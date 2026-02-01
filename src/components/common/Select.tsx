import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
    onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, placeholder, className = '', onChange, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={`
              w-full px-4 py-3 bg-white dark:bg-dark-800 
              border rounded-xl text-dark-800 dark:text-white 
              appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:border-transparent 
              transition-all duration-200
              ${error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-dark-200 dark:border-dark-600 focus:ring-primary-500'
                            }
              ${className}
            `}
                        onChange={(e) => onChange?.(e.target.value)}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-dark-400">
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
