/**
 * FAQItem Component
 * Reusable accordion item for FAQ sections
 */
import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-muted/10">
            <button
                onClick={onClick}
                className="flex w-full items-center justify-between py-5 sm:py-6 text-left"
                aria-expanded={isOpen}
            >
                <span className="text-base sm:text-lg font-medium text-dark pr-4">{question}</span>
                <ChevronDown
                    className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="text-muted text-sm sm:text-base">{answer}</p>
            </div>
        </div>
    );
};

export default FAQItem;
