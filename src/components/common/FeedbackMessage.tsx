// components/common/FeedbackMessage.tsx

import React from 'react';

interface FeedbackMessageProps {
    icon: React.ReactNode;
    title: string;
    message: string;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ icon, title, message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white/50 rounded-lg h-full">
            <div className="text-gray-400 mb-4">
                {icon}
            </div>
            <h3 className="text-4xl font-bold text-gray-700">{title}</h3>
            <p className="mt-2 text-gray-500 max-w-sm">{message}</p>
        </div>
    );
};

export default FeedbackMessage;