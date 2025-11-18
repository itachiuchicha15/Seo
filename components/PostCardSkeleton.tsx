
import React from 'react';
import Skeleton from './Skeleton';

const PostCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
            <div className="h-48 w-full relative">
                <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
            </div>
            <div className="p-6 flex flex-col flex-grow space-y-3">
                <div className="flex items-center gap-2 mb-2">
                     <Skeleton className="h-4 w-20" />
                     <Skeleton className="h-4 w-4 rounded-full" />
                     <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-2/3" />
                <div className="space-y-2 mt-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
};

export default PostCardSkeleton;
