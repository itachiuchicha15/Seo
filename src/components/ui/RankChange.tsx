/**
 * RankChange Component
 * Displays rank movement with visual indicators
 */
import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface RankChangeProps {
    currentRank: number | string;
    prevRank: number | string | null;
}

const RankChange: React.FC<RankChangeProps> = ({ currentRank, prevRank }) => {
    if (typeof currentRank !== 'number') {
        return <span className="text-muted font-semibold">{currentRank}</span>;
    }

    if (prevRank === null || typeof prevRank !== 'number') {
        return (
            <span className="text-primary flex items-center gap-1 font-bold">
                <TrendingUp size={14} /> Indexed
            </span>
        );
    }

    const change = (typeof prevRank === 'number' ? prevRank : 100) -
        (typeof currentRank === 'number' ? currentRank : 100);

    if (change > 0) {
        return (
            <span
                className="text-primary flex items-center gap-1 font-bold"
                title={`Improved by ${change} positions`}
            >
                <ArrowUp size={14} /> {change}
            </span>
        );
    }

    if (change < 0) {
        return (
            <span
                className="text-secondary flex items-center gap-1 font-bold"
                title={`Dropped by ${Math.abs(change)} positions`}
            >
                <ArrowDown size={14} /> {Math.abs(change)}
            </span>
        );
    }

    return (
        <span className="text-muted flex items-center gap-1">
            <Minus size={14} /> 0
        </span>
    );
};

export default RankChange;
