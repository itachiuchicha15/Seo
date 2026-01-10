import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import PostCard from '../components/PostCard';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Trophy, MousePointer, Eye, ChevronLeft, ChevronRight, Search, X, Calendar, ArrowRight, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import PostCardSkeleton from '../components/PostCardSkeleton';
import { usePosts, useAllPosts } from '../hooks/queries';

// Reuse the FeaturedPost component and Skeleton
const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => {
    return (
        <div className="group relative grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-xl overflow-hidden border border-muted/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 mb-16 animate-on-scroll is-visible">
            <div className="relative h-64 lg:h-auto overflow-hidden">
                <div className="absolute top-6 left-6 z-10">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-light shadow-lg uppercase tracking-wide ring-2 ring-white">
                        <Sparkles className="w-3 h-3 mr-1.5" /> Latest Update
                    </span>
                </div>
                <Link to={`/blog/${post.slug}`} className="block h-full">
                    <img
                        src={post.image.url}
                        alt={post.image.alt_text}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-dark/5 pointer-events-none"></div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Sparkles className="w-32 h-32 text-muted" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-sm text-muted mb-4">
                        <span className="flex items-center gap-1.5 bg-light px-3 py-1 rounded-full"><Calendar className="w-3.5 h-3.5" /> {new Date(post.date).toLocaleDateString()}</span>
                        <span className="font-bold text-primary uppercase tracking-wider text-xs">{post.categories?.[0] || 'Update'}</span>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="block">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-dark mb-4 leading-tight group-hover:text-primary transition-colors">
                            {post.title}
                        </h2>
                    </Link>
                    <p className="text-dark/70 text-lg mb-8 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-muted/10">
                        <div className="flex gap-3 text-sm font-medium">
                            <div className="flex items-center gap-2 text-secondary bg-light/50 px-4 py-2 rounded-lg border border-muted/10">
                                <Trophy className="w-4 h-4 text-secondary" />
                                <span className="flex flex-col leading-none">
                                    <span className="text-[10px] text-muted uppercase font-bold">Rank</span>
                                    <span className="font-bold text-dark text-base">{post.metrics.rank}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-primary bg-light/50 px-4 py-2 rounded-lg border border-muted/10">
                                <MousePointer className="w-4 h-4 text-primary" />
                                <span className="flex flex-col leading-none">
                                    <span className="text-[10px] text-muted uppercase font-bold">Clicks</span>
                                    <span className="font-bold text-dark text-base">{post.metrics.clicks}</span>
                                </span>
                            </div>
                        </div>
                        <Link
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center font-bold text-primary hover:underline underline-offset-4 text-base"
                        >
                            Read Full Story <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

const KeyMetricsSkeleton: React.FC = () => {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/50 backdrop-blur-sm border border-muted/10 p-4 rounded-xl flex flex-col items-center">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                </div>
            ))}
        </div>
    );
}

const BlogPage: React.FC = () => {
    const [ref, isVisible] = useIntersectionObserver();
    const [searchParams, setSearchParams] = useSearchParams();

    // -- Filter State --
    const activeTag = searchParams.get('tag') || 'All';
    const activeCategory = searchParams.get('category') || 'All';
    const searchQuery = searchParams.get('q') || '';

    // -- Queries --
    // 1. Fetch ALL posts just to derive categories (cached efficiently)
    const { data: allPostsForCats = [] } = useAllPosts();

    // 2. Fetch Paginated/Filtered posts for the feed
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error
    } = usePosts({
        search: searchQuery,
        tag: activeTag,
        category: activeCategory
    });

    const isLoading = status === 'pending';

    // Flatten pages into a single array
    const posts = useMemo(() => {
        return data?.pages.flatMap(page => page) || [];
    }, [data]);


    // -- Derived Data --
    const { allCategories } = useMemo(() => {
        if (allPostsForCats.length === 0) return { allCategories: [] };
        const categories = new Set<string>();
        allPostsForCats.forEach(post => {
            post.categories?.forEach(cat => categories.add(cat));
        });
        return {
            allCategories: ['All', ...Array.from(categories).sort()]
        };
    }, [allPostsForCats]);


    // Features Post Logic
    // Only show featured post if no filters are active (Default View)
    const isDefaultView = !searchQuery && activeCategory === 'All' && activeTag === 'All';
    const featuredPost = (isDefaultView && posts.length > 0) ? posts[0] : null;

    // Grid posts: Excluding the first one if it's featured
    const gridPosts = (isDefaultView && featuredPost) ? posts.slice(1) : posts;


    // -- Event Handlers --

    const updateQueryParam = (key: string, value: string | null) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (value && value !== 'All') {
            newSearchParams.set(key, value);
        } else {
            newSearchParams.delete(key);
        }
        setSearchParams(newSearchParams);
    };

    const handleCategoryClick = (category: string) => updateQueryParam('category', category);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateQueryParam('q', e.target.value || null);
    };

    const clearSearch = () => {
        updateQueryParam('q', null);
    }

    // Latest Post Metrics (for the header stats) - Use the very first fetched post
    const latestPostMetrics = posts.length > 0 ? posts[0] : null;


    return (
        <div className="bg-light min-h-screen font-sans">
            <div className="relative bg-white pb-20 pt-28 overflow-hidden border-b border-muted/10">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-muted/10 to-transparent blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <div ref={ref} className={`max-w-3xl mx-auto animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
                        <span className="inline-block py-1.5 px-4 rounded-full bg-light border border-muted/20 text-primary text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                            Documenting the Journey
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-dark tracking-tight mb-6 leading-tight">
                            Challenge <span className="text-primary">Log</span>
                        </h1>
                        <p className="text-xl text-dark/70 leading-relaxed mb-10">
                            A transparent, day-by-day documentation of the journey from zero to ranking. Real data, real strategies, and real results.
                        </p>
                    </div>

                    {isLoading && <div className="max-w-4xl w-full"><KeyMetricsSkeleton /></div>}

                    {!isLoading && !error && latestPostMetrics && (
                        <div className="w-full max-w-4xl animate-on-scroll is-visible" style={{ transitionDelay: '100ms' }}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-muted/10 ring-1 ring-white">
                                <div className="flex flex-col items-center justify-center p-2">
                                    <div className="flex items-center gap-2 text-primary mb-1">
                                        <Trophy className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Current Rank</span>
                                    </div>
                                    <span className="text-3xl sm:text-4xl font-mono font-bold text-dark">{latestPostMetrics.metrics.rank}</span>
                                </div>

                                <div className="flex flex-col items-center justify-center p-2 border-t sm:border-t-0 sm:border-l border-muted/5">
                                    <div className="flex items-center gap-2 text-muted mb-1">
                                        <MousePointer className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Total Clicks</span>
                                    </div>
                                    <span className="text-3xl sm:text-4xl font-mono font-bold text-dark">{latestPostMetrics.metrics.clicks}</span>
                                </div>

                                <div className="flex flex-col items-center justify-center p-2 border-t sm:border-t-0 sm:border-l border-muted/5">
                                    <div className="flex items-center gap-2 text-muted mb-1">
                                        <Eye className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Impressions</span>
                                    </div>
                                    <span className="text-3xl sm:text-4xl font-mono font-bold text-dark">{latestPostMetrics.metrics.impressions}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-center text-muted mt-6 flex items-center justify-center gap-1.5 uppercase tracking-wide font-bold">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Synced: {new Date(latestPostMetrics.date).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="sticky top-20 z-20 mb-12 transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-xl shadow-dark/5 border border-muted/10 p-2 md:p-4 max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                            <div className="relative flex-grow group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-10 py-3 bg-light border-transparent focus:bg-white focus:border-primary/20 rounded-xl text-dark placeholder-muted/60 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all duration-300"
                                    placeholder="Search logs..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-secondary transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <div className="hidden md:block w-px h-10 bg-muted/10 mx-2"></div>

                            <div className="flex-grow-0 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                <div className="flex items-center space-x-2 pr-4">
                                    {allCategories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border ${activeCategory === cat
                                                ? 'bg-dark text-light border-dark shadow-lg'
                                                : 'bg-white text-dark/70 border-muted/20 hover:border-primary hover:text-primary hover:bg-light'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isDefaultView && featuredPost && (
                    <FeaturedPost post={featuredPost} />
                )}

                <div id="posts-grid" className="scroll-mt-32">
                    {isDefaultView && gridPosts.length > 0 && (
                        <div className="mb-8 flex items-center gap-4">
                            <h3 className="text-2xl font-extrabold text-dark">Chronological Feed</h3>
                            <div className="h-px flex-grow bg-muted/10"></div>
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        {isLoading ? (
                            [...Array(6)].map((_, i) => (
                                <PostCardSkeleton key={i} />
                            ))
                        ) : gridPosts.length > 0 ? (
                            gridPosts.map((post, index) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    style={{ transitionDelay: `${(index % 6) * 100}ms` }}
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-muted/20 text-center">
                                <div className="bg-light p-6 rounded-full mb-6">
                                    <Search className="h-12 w-12 text-muted/30" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-dark">No Results Found</h3>
                                <p className="text-muted mt-2 max-w-md mx-auto">
                                    Adjust your filters or try a different search term to find the logs you&apos;re looking for.
                                </p>
                                <button
                                    onClick={() => { updateQueryParam('q', null); updateQueryParam('tag', 'All'); updateQueryParam('category', 'All'); }}
                                    className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-full text-light bg-primary hover:brightness-95 transition-all shadow-lg"
                                >
                                    Reset Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Infinite Scroll / Load More UI */}
                {!isLoading && hasNextPage && (
                    <div className="mt-24 flex justify-center pb-20">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="group relative inline-flex items-center justify-center px-8 py-3 bg-white border border-muted/20 rounded-full text-dark font-bold text-sm shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary" />
                                    Loading more logs...
                                </>
                            ) : (
                                <>
                                    Load Oldest Logs
                                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {!isLoading && !hasNextPage && gridPosts.length > 0 && (
                    <div className="mt-24 text-center pb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-light/50 text-muted text-xs font-bold uppercase tracking-widest">
                            <CheckCircle className="w-3 h-3" /> All logs loaded
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;