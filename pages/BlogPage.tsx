
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types';
import { supabase } from '../lib/supabaseClient';
import PostCard from '../components/PostCard';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Trophy, MousePointer, Eye, ChevronLeft, ChevronRight, Search, XCircle } from 'lucide-react';
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

const KeyMetricsSkeleton: React.FC = () => {
    return (
        <div className="my-16 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
             <Skeleton className="h-8 w-64 mx-auto mb-8" />
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {[...Array(3)].map((_, i) => (
                     <div key={i} className="p-4 bg-light rounded-lg flex flex-col items-center">
                        <Skeleton className="h-8 w-8 mb-2 rounded-md" />
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-10 w-16" />
                     </div>
                ))}
             </div>
        </div>
    );
}

const BlogPage: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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


  const paginatedPosts = useMemo(() => {
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
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

  const latestPost = posts.length > 0 ? posts[0] : null;

  return (
    <div className="py-24 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
          <h1 className="text-4xl font-extrabold text-dark sm:text-5xl">Challenge Log</h1>
          <p className="mt-4 text-xl text-muted max-w-2xl mx-auto">
            Follow the day-by-day journey, with all the wins, failures, and lessons learned along the way.
          </p>
        </div>
        
        {loading && <KeyMetricsSkeleton />}

        {error && (
          <div className="text-center my-16 bg-red-100 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && latestPost && (
          <div className={`my-16 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
            <h3 className="text-xl font-bold text-center text-dark mb-4">Key Results So Far</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-light rounded-lg">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-muted">Current Rank</p>
                <p className="text-3xl font-bold font-mono text-dark">{latestPost.metrics.rank}</p>
              </div>
              <div className="p-4 bg-light rounded-lg">
                <MousePointer className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-muted">Total Clicks</p>
                <p className="text-3xl font-bold font-mono text-dark">{latestPost.metrics.clicks}</p>
              </div>
              <div className="p-4 bg-light rounded-lg">
                <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-muted">Total Impressions</p>
                <p className="text-3xl font-bold font-mono text-dark">{latestPost.metrics.impressions}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Search and Filter Section */}
        {!loading && !error && posts.length > 0 && (
            <div className={`p-6 bg-white rounded-2xl shadow-lg border border-gray-200 mb-12 animate-on-scroll ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms'}}>
                <div className="space-y-6">
                    <div className="relative">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                         <input 
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-light border-2 border-transparent focus:border-primary focus:ring-0 transition-colors"
                         />
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                        <p className="font-semibold text-sm text-center mb-3 text-muted">Filter by Category</p>
                        <div className="flex flex-wrap justify-center gap-3">
                             {allCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-200 transform hover:scale-105 ${
                                        activeCategory === cat ? 'bg-secondary text-white shadow-md' : 'bg-light text-secondary hover:bg-gray-200'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div className="border-t border-gray-200 pt-4">
                        <p className="font-semibold text-sm text-center mb-3 text-muted">Filter by Tag</p>
                        <div className="flex flex-wrap justify-center gap-3">
                             {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-200 transform hover:scale-105 ${
                                        activeTag === tag ? 'bg-primary text-white shadow-md' : 'bg-light text-secondary hover:bg-gray-200'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}


        <div id="posts-grid" className="mt-16 grid gap-10 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
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
             <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-md border border-gray-200">
                  <XCircle className="mx-auto h-12 w-12 text-muted" />
                  <h3 className="mt-4 text-2xl font-bold text-dark">No Posts Found</h3>
                  {searchQuery && <p className="text-muted mt-2">Your search for "{searchQuery}" did not return any results.</p>}
                  {!searchQuery && <p className="text-muted mt-2">There are no posts matching the selected criteria.</p>}
              </div>
          )}
        </div>
        
        {!loading && totalPages > 1 && (
            <nav className="mt-16 flex justify-center items-center gap-4" aria-label="Pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white border border-gray-200 text-secondary disabled:opacity-50 hover:bg-light transition-colors"
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                    {paginationItems.map((item, index) => 
                        typeof item === 'number' ? (
                            <button
                                key={item}
                                onClick={() => handlePageChange(item)}
                                className={`h-10 w-10 rounded-full text-sm font-bold transition-colors ${
                                    currentPage === item
                                        ? 'bg-primary text-white shadow'
                                        : 'bg-white text-secondary hover:bg-light border border-gray-200'
                                }`}
                                aria-current={currentPage === item ? 'page' : undefined}
                            >
                                {item}
                            </button>
                        ) : (
                            <span key={`ellipsis-${index}`} className="h-10 w-10 flex items-center justify-center text-muted">...</span>
                        )
                    )}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white border border-gray-200 text-secondary disabled:opacity-50 hover:bg-light transition-colors"
                     aria-label="Go to next page"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </nav>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
