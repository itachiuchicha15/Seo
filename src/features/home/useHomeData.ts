/**
 * useHomeData Hook
 * Encapsulates data fetching and state management for HomePage
 * Follows separation of concerns - logic separate from UI
 */
import { useMemo, useCallback } from 'react';
import { BlogPost } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { APP_CONFIG } from '../../constants';
import { useAllPosts } from '../../hooks/queries';

interface UseHomeDataReturn {
    blogPosts: BlogPost[];
    loading: boolean;
    challengeEndDate: Date;
    latestPostsForTimeline: BlogPost[];
    allPostsChronological: BlogPost[];
    getGrowth: (start: number, end: number) => string;
}

export const useHomeData = (): UseHomeDataReturn => {
    // Data Fetching via React Query (Cached)
    const { data: blogPosts = [], isLoading: loading } = useAllPosts();

    // Calculate challenge end date
    const challengeEndDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + APP_CONFIG.challengeDurationDays);
        return date;
    }, []);

    // Derived data
    const latestPostsForTimeline = useMemo(
        () => blogPosts.slice(0, 3),
        [blogPosts]
    );

    const allPostsChronological = useMemo(
        () => [...blogPosts].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
        [blogPosts]
    );

    // Calculate growth percentage
    const getGrowth = useCallback((start: number, end: number): string => {
        if (start === 0) return 'NEW';
        const percentage = ((end - start) / start) * 100;
        return `${percentage > 0 ? '+' : ''}${percentage.toFixed(0)}%`;
    }, []);

    return {
        blogPosts,
        loading,
        challengeEndDate,
        latestPostsForTimeline,
        allPostsChronological,
        getGrowth,
    };
};

export default useHomeData;
