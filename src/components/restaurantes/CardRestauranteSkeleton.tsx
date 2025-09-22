// components/restaurantes/CardRestauranteSkeleton.tsx

import React from 'react';

const CardRestauranteSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 animate-pulse">
            <div className="flex flex-col md:flex-row md:h-72">
                {/* Imagen Skeleton */}
                <div className="md:w-2/5 bg-gray-300 h-48 md:h-full"></div>

                {/* Info Skeleton */}
                <div className="flex-grow p-5 md:p-6 flex justify-between gap-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="pt-6 space-y-3">
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        </div>
                    </div>

                    {/* QR Skeleton */}
                    <div className="w-28 h-36 bg-gray-300 rounded-xl flex-shrink-0 hidden md:block"></div>
                </div>
            </div>
        </div>
    );
};

export default CardRestauranteSkeleton;