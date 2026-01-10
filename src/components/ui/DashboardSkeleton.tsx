/**
 * DashboardSkeleton Component
 * Loading skeleton for the dashboard section
 */
import React from 'react';
import Skeleton from '../Skeleton';

const DashboardSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-muted/10">
                        <div className="flex justify-between items-start mb-4">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                        <Skeleton className="h-12 w-20 mb-2" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-muted/10">
                <Skeleton className="h-6 w-48 mb-6" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="mt-6 flex justify-center">
                    <Skeleton className="h-6 w-40" />
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
