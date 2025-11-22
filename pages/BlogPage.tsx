
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { supabase } from '../lib/supabaseClient';
import PostCard from '../components/PostCard';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Trophy, MousePointer, Eye, ChevronLeft, ChevronRight, Search, X, Tag, Calendar, ArrowRight, Sparkles, Filter } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import PostCardSkeleton from '../components/PostCardSkeleton';

const POSTS_PER_PAGE = 6;

const getPaginationItems = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage > totalPages - 4) {
        return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => {
    return (
        <div className="group relative grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 mb-16 animate-on-scroll is-visible">
            <div className="relative h-64 lg:h-auto overflow-hidden">
                <div className="absolute top-6 left-6 z-10">
                     <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-white shadow-lg uppercase tracking-wide ring-2 ring-white">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/5 pointer-events-none"></div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Sparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-sm text-muted mb-4">
                        <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full"><Calendar className="w-3.5 h-3.5" /> {new Date(post.date).toLocaleDateString()}</span>
                        <span className="font-medium text-primary uppercase tracking-wider text-xs">{post.categories?.[0] || 'Update'}</span>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="block">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-dark mb-4 leading-tight group-hover:text-primary transition-colors">
                            {post.title}
                        </h2>
                    </Link>
                    <p className="text-muted text-lg mb-8 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-100">
                         <div className="flex gap-3 text-sm font-medium">
                            <div className="flex items-center gap-2 text-secondary bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                <Trophy className="w-4 h-4 text-yellow-600" /> 
                                <span className="flex flex-col leading-none">
                                    <span className="text-[10px] text-muted uppercase font-bold">Rank</span>
                                    <span className="font-bold text-dark text-base">{post.metrics.rank}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-secondary bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                <MousePointer className="w-4 h-4 text-blue-600" /> 
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
                <div key={i} className="bg-white/50 backdrop-blur-sm border border-gray-200 p-4 rounded-xl flex flex-col items-center">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                </div>
             ))}
        </div>
    );
}

const BlogPage: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTag = searchParams.get('tag') || 'All';
  const activeCategory = searchParams.get('category') || 'All';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            setError('Could not fetch blog posts.');
            console.error(error);
        } else {
            setPosts(data as BlogPost[]);
        }
        setLoading(false);
    };
    fetchPosts();
  }, []);
  
  const { allTags, allCategories } = useMemo(() => {
    if (posts.length === 0) return { allTags: [], allCategories: [] };
    const tags = new Set<string>();
    const categories = new Set<string>();
    posts.forEach(post => {
        post.tags?.forEach(tag => tags.add(tag));
        post.categories?.forEach(cat => categories.add(cat));
    });
    return {
      allTags: ['All', ...Array.from(tags).sort()],
      allCategories: ['All', ...Array.from(categories).sort()]
    };
  }, [posts]);
  
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const searchMatch = searchQuery 
        ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const tagMatch = activeTag === 'All' ? true : post.tags?.includes(activeTag);
      const categoryMatch = activeCategory === 'All' ? true : post.categories?.includes(activeCategory);
      
      return searchMatch && tagMatch && categoryMatch;
    });
  }, [posts, activeTag, activeCategory, searchQuery]);

  // Logic for Featured Post
  // Only show on Page 1, when no search/filter is active, and we have posts
  const isDefaultView = !searchQuery && activeCategory === 'All' && activeTag === 'All';
  const showFeatured = currentPage === 1 && isDefaultView && filteredPosts.length > 0;
  const featuredPost = showFeatured ? filteredPosts[0] : null;
  
  // Grid Posts
  const gridPostsSource = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  const paginatedPosts = useMemo(() => {
      // If featured is shown, we treat the "grid" as a separate list for pagination purposes relative to the page
      // However, standard pagination logic usually applies to the whole set. 
      // To keep it simple: Page 1 shows Featured + 6 Grid items. Page 2 shows 6 Grid items.
      
      if (showFeatured) {
          // On page 1, we simply take the first 6 from the sliced array
          return gridPostsSource.slice(0, POSTS_PER_PAGE);
      } else {
          // Standard pagination
          const indexOfLastPost = currentPage * POSTS_PER_PAGE;
          const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
          return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
      }
  }, [filteredPosts, gridPostsSource, currentPage, showFeatured]);

  // Total pages calculation needs to account for the featured post being "outside" the grid on page 1
  const totalItems = showFeatured ? gridPostsSource.length : filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / POSTS_PER_PAGE));
  const paginationItems = getPaginationItems(currentPage, totalPages);

  const updateQueryParam = (key: string, value: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
        newSearchParams.set(key, value);
    } else {
        newSearchParams.delete(key);
    }
    if (key !== 'page') {
        newSearchParams.set('page', '1');
    }
    setSearchParams(newSearchParams);
  };
  
  const handleTagClick = (tag: string) => updateQueryParam('tag', tag);
  const handleCategoryClick = (category: string) => updateQueryParam('category', category);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateQueryParam('page', page.toString());
    const postsElement = document.getElementById('posts-grid');
    if (postsElement) {
        postsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQueryParam('q', e.target.value || null);
  };
  
  const clearSearch = () => {
      updateQueryParam('q', null);
  }

  const latestPostMetrics = posts.length > 0 ? posts[0] : null;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
        {/* Enhanced Hero Section */}
        <div className="relative bg-white pb-20 pt-28 overflow-hidden border-b border-gray-200">
             {/* Background decoration */}
             <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-gray-100 to-transparent blur-3xl"></div>
             </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                 <div ref={ref} className={`max-w-3xl mx-auto animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
                    <span className="inline-block py-1 px-3 rounded-full bg-gray-100 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        Documenting the Journey
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-dark tracking-tight mb-6 leading-tight">
                        Challenge <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-gray-600">Log</span>
                    </h1>
                    <p className="text-xl text-muted leading-relaxed mb-10">
                        A transparent, day-by-day documentation of the journey from zero to ranking. Real data, real strategies, and real results.
                    </p>
                </div>

                {/* Integrated Metrics HUD */}
                {loading && <div className="max-w-4xl w-full"><KeyMetricsSkeleton /></div>}
                
                {!loading && !error && latestPostMetrics && (
                    <div className="w-full max-w-4xl animate-on-scroll is-visible" style={{ transitionDelay: '100ms' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/60 ring-1 ring-gray-100">
                             <div className="flex flex-col items-center justify-center p-2">
                                 <div className="flex items-center gap-2 text-primary mb-1">
                                     <Trophy className="h-4 w-4" />
                                     <span className="text-xs font-bold uppercase tracking-widest">Current Rank</span>
                                 </div>
                                 <span className="text-3xl sm:text-4xl font-mono font-bold text-dark">{latestPostMetrics.metrics.rank}</span>
                             </div>
                             
                             <div className="flex flex-col items-center justify-center p-2 border-t sm:border-t-0 sm:border-l border-gray-100">
                                 <div className="flex items-center gap-2 text-muted mb-1">
                                     <MousePointer className="h-4 w-4" />
                                     <span className="text-xs font-bold uppercase tracking-widest">Total Clicks</span>
                                 </div>
                                 <span className="text-3xl sm:text-4xl font-mono font-bold text-dark">{latestPostMetrics.metrics.clicks}</span>
                             </div>
                             
                             <div className="flex flex-col items-center justify-center p-2 border-t sm:border-t-0 sm:border-l border-gray-100">
                                 <div className="flex items-center gap-2 text-muted mb-1">
                                     <Eye className="h-4 w-4" />
                                     <span className="text-xs font-bold uppercase tracking-widest">Impressions</span>
                                 </div>
                                 <span className="text-3xl sm:text-4xl font-mono font-bold text-dark">{latestPostMetrics.metrics.impressions}</span>
                             </div>
                        </div>
                         <p className="text-[10px] text-center text-muted mt-4 flex items-center justify-center gap-1.5 uppercase tracking-wide font-medium">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Last updated: {new Date(latestPostMetrics.date).toLocaleDateString()}
                         </p>
                    </div>
                )}
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
             {/* Unified Search & Filter Toolbar */}
            <div className="sticky top-20 z-20 mb-12 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200 p-2 md:p-4 max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                        {/* Search Input */}
                        <div className="relative flex-grow group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-primary/20 rounded-xl text-dark placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {searchQuery && (
                                <button 
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        {/* Vertical Divider (Desktop) */}
                        <div className="hidden md:block w-px h-10 bg-gray-200 mx-2"></div>

                        {/* Category Pills */}
                        <div className="flex-grow-0 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <div className="flex items-center space-x-2 pr-4">
                                {allCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
                                            activeCategory === cat
                                                ? 'bg-dark text-white border-dark shadow-md'
                                                : 'bg-white text-secondary border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Tags Expansion (Conditional or always visible if relevant) */}
                    {!loading && allTags.length > 1 && (
                         <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-2 px-2">
                            <div className="flex items-center text-xs font-bold text-muted uppercase tracking-wider">
                                <Filter className="h-3 w-3 mr-1.5" /> Filter by Tag:
                            </div>
                            {allTags.filter(t => t !== 'All').map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(activeTag === tag ? 'All' : tag)}
                                    className={`text-xs font-medium transition-colors duration-200 flex items-center ${
                                        activeTag === tag 
                                            ? 'text-primary font-bold bg-primary/10 px-2 py-1 rounded-md' 
                                            : 'text-muted hover:text-dark'
                                    }`}
                                >
                                    <span className="mr-0.5">#</span>{tag}
                                </button>
                            ))}
                            {activeTag !== 'All' && (
                                <button onClick={() => handleTagClick('All')} className="ml-auto text-[10px] font-bold text-red-500 hover:underline bg-red-50 px-2 py-1 rounded uppercase tracking-wide">
                                    Clear Tags
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Featured Post Section (Only on Page 1 & No Search) */}
            {showFeatured && featuredPost && (
                <FeaturedPost post={featuredPost} />
            )}

            {/* Results Grid */}
            <div id="posts-grid" className="scroll-mt-32">
                {showFeatured && gridPostsSource.length > 0 && (
                     <div className="mb-8 flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-dark">Previous Updates</h3>
                        <div className="h-px flex-grow bg-gray-200"></div>
                     </div>
                )}
                
                <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <PostCardSkeleton key={i} />
                    ))
                ) : paginatedPosts.length > 0 ? (
                    paginatedPosts.map((post, index) => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        style={{ transitionDelay: `${index * 100}ms`}}
                    />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-6 animate-bounce-slow">
                            <Search className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-dark">No Posts Found</h3>
                        <p className="text-muted mt-2 max-w-md mx-auto">
                            {searchQuery 
                                ? `We couldn't find any matches for "${searchQuery}".` 
                                : "There are no posts available with the selected filters."}
                        </p>
                        <button 
                            onClick={() => { updateQueryParam('q', null); updateQueryParam('tag', 'All'); updateQueryParam('category', 'All'); }}
                            className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-full text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
                </div>
            </div>
            
            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <nav className="mt-24 flex justify-center items-center gap-2" aria-label="Pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="group inline-flex items-center justify-center h-12 w-12 rounded-full bg-white border border-gray-200 text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
                        aria-label="Go to previous page"
                    >
                        <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                    </button>

                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm">
                        {paginationItems.map((item, index) => 
                            typeof item === 'number' ? (
                                <button
                                    key={item}
                                    onClick={() => handlePageChange(item)}
                                    className={`h-9 w-9 rounded-full text-sm font-bold transition-all duration-200 ${
                                        currentPage === item
                                            ? 'bg-dark text-white shadow-md transform scale-110'
                                            : 'text-muted hover:bg-gray-100 hover:text-dark'
                                    }`}
                                    aria-current={currentPage === item ? 'page' : undefined}
                                >
                                    {item}
                                </button>
                            ) : (
                                <span key={`ellipsis-${index}`} className="h-9 w-9 flex items-center justify-center text-gray-300 font-bold">...</span>
                            )
                        )}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="group inline-flex items-center justify-center h-12 w-12 rounded-full bg-white border border-gray-200 text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
                         aria-label="Go to next page"
                    >
                        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                </nav>
            )}
        </div>
    </div>
  );
};

export default BlogPage;
