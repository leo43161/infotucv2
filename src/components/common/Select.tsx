import { cn } from '@/utils';
import { ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface options {
    label: string;
    value: string;
}

export default function TouchSelect({ label, options, value, onChange, placeholder, className }: {
    label: string;
    options: options[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const labelSelected = options.find((option) => option.value === value)?.label;
    // Cerrar si se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className={cn("relative", className ?? '')} ref={selectRef}>
            <button
                className={cn("w-full px-6 py-4 bg-secondary border text-center text-3xl font-medium text-zinc-50 flex justify-between items-center min-h-[70px] hover:bg-secondary/90 active:bg-secondary/90 transition-colors shadow-sm", value ? 'bg-primary' : '')}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? 'text-zinc-50 font-bold' : 'text-zinc-50'}>
                    {labelSelected || placeholder}
                </span>
                <ChevronUp
                    className={`w-7 h-7 text-zinc-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-white border-secondary rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    <div
                        className="px-6 py-4 text-zinc-500 hover:bg-gray-50 cursor-pointer text-xl border-b border-gray-200"
                        onClick={() => {
                            onChange('');
                            setIsOpen(false);
                        }}
                    >
                        {placeholder}
                    </div>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="px-6 py-4 hover:bg-secondary hover:text-white cursor-pointer text-xl transition-colors border-b font-semibold border-gray-100 last:border-b-0"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}