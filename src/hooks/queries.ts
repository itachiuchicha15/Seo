import { useQuery, useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { BlogPost } from '../types';

export const POSTS_PER_PAGE = 6;

interface FetchPostsResponse {
    data: BlogPost[];
    count: number | null;
}

interface UsePostsParams {
    search?: string;
    tag?: string;
    category?: string;
}

/**
 * Hook to fetch paginated blog posts with infinite scroll support.
 * Uses 'date' ordering (descending) by default.
 */
export const usePosts = (params: UsePostsParams = {}) => {
    return useInfiniteQuery<BlogPost[], Error>({
        queryKey: ['posts', 'infinite', params],
        queryFn: async ({ pageParam = 0 }) => {
            const start = (pageParam as number) * POSTS_PER_PAGE;
            const end = start + POSTS_PER_PAGE - 1;

            let query = supabase
                .from('posts')
                .select('*')
                .order('date', { ascending: false });

            // Apply filters
            if (params.search) {
                query = query.or(`title.ilike.%${params.search}%,excerpt.ilike.%${params.search}%`);
            }
            if (params.tag && params.tag !== 'All') {
                query = query.contains('tags', [params.tag]);
            }
            if (params.category && params.category !== 'All') {
                query = query.contains('categories', [params.category]);
            }

            const { data, error } = await query.range(start, end);

            if (error) {
                console.error('Error fetching posts:', error);
                throw error;
            }

            return data as BlogPost[];
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            // If last page had fewer items than page size, we're at the end
            if (!lastPage || lastPage.length < POSTS_PER_PAGE) {
                return undefined;
            }
            // Otherwise, next page index is current number of pages
            return allPages.length;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook to fetch a single blog post by slug.
 */
export const usePost = (slug: string | undefined) => {
    return useQuery<BlogPost, Error>({
        queryKey: ['post', slug],
        queryFn: async () => {
            if (!slug) throw new Error('No slug provided');
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data as BlogPost;
        },
        enabled: !!slug, // Only run if slug exists
        staleTime: 1000 * 60 * 30, // 30 minutes (posts don't change often)
    });
};

/**
 * Hook to fetch ALL posts at once (for Results, Home stats, or small datasets).
 * Cached aggressively.
 */
export const useAllPosts = () => {
    return useQuery<BlogPost[], Error>({
        queryKey: ['posts', 'all'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('date', { ascending: false }); // Latest first

            if (error) throw error;
            return data as BlogPost[];
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};
