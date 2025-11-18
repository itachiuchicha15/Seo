import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { supabase } from '../lib/supabaseClient';
import { TrendingUp, MousePointer, Eye, ArrowLeft, ArrowRight, Twitter, Linkedin } from 'lucide-react';
import BackToTopButton from '../components/BackToTopButton';
import Breadcrumbs from '../components/Breadcrumbs';
import PostCard from '../components/PostCard';
import Skeleton from '../components/Skeleton';


// FIX: Define a type for the navigation post link to resolve type mismatch.
interface NavPost {
  title: string;
  slug: string;
}

const BlogPostSkeleton: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Skeleton className="h-6 w-48 mb-8" />
            {/* Hero */}
            <div className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-primary/10 h-[450px] bg-gray-200 shimmer"></div>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                <div className="lg:col-span-8 space-y-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-64 w-full rounded-lg my-8" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <aside className="lg:col-span-4 mt-12 lg:mt-0 space-y-8">
                     <div className="bg-light p-6 rounded-2xl border border-gray-200">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                     </div>
                     <div className="bg-light p-6 rounded-2xl border border-gray-200 text-center flex flex-col items-center">
                        <Skeleton className="h-24 w-24 rounded-full mb-4" />
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-32" />
                     </div>
                </aside>
            </div>
        </div>
    );
}


const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousPost, setPreviousPost] = useState<NavPost | null>(null);
  const [nextPost, setNextPost] = useState<NavPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        setError('Could not find the requested post.');
        console.error(error);
        setPost(null);
      } else {
        const currentPost = data as BlogPost;
        setPost(currentPost);

        // Fetch previous and next posts based on date
        const currentDate = currentPost.date;
        const { data: prevData } = await supabase.from('posts').select('title, slug').lt('date', currentDate).order('date', { ascending: false }).limit(1).single();
        setPreviousPost(prevData);

        const { data: nextData } = await supabase.from('posts').select('title, slug').gt('date', currentDate).order('date', { ascending: true }).limit(1).single();
        setNextPost(nextData);

        // Fetch related posts based on tags
        if (currentPost.tags && currentPost.tags.length > 0) {
            const { data: relatedData, error: relatedError } = await supabase
                .from('posts')
                .select('*')
                .or(currentPost.tags.map(tag => `tags.cs.{${tag}}`).join(','))
                .neq('id', currentPost.id)
                .limit(3);
            
            if (!relatedError && relatedData) {
                setRelatedPosts(relatedData as BlogPost[]);
            }
        }
      }
      
      setLoading(false);
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  // Effect for updating meta tags
  useEffect(() => {
    if (post) {
      document.title = post.seo?.title || `${post.title} – Search Me If You Can`;
      
      const setMeta = (name: string, content: string) => {
        let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('name', name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      }
      
      const setOg = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      setMeta('description', post.seo?.meta_description || post.excerpt);
      setOg('og:title', post.seo?.title || post.title);
      setOg('og:description', post.seo?.meta_description || post.excerpt);
      setOg('og:image', post.image.url);
      setOg('og:url', window.location.href);

    }
    // No cleanup needed as we want these to persist until the next post loads
  }, [post]);

  if (loading) {
    return <div className="bg-white text-secondary fade-in"><BlogPostSkeleton /></div>;
  }

  if (error || !post) {
    return (
      <div className="text-center py-20 text-dark">
        <h1 className="text-4xl font-bold">{error || 'Post not found!'}</h1>
        <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">Back to the Challenge Log</Link>
      </div>
    );
  }

  const postUrl = window.location.href;
  const encodedTitle = encodeURIComponent(`Check out this SEO challenge update: "${post.title}"`);
  
  const breadcrumbLinks = [
    { label: 'Home', path: '/' },
    { label: 'Challenge Log', path: '/blog' },
    { label: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <div className="bg-white text-secondary fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
            <Breadcrumbs links={breadcrumbLinks} />
        </div>

        {/* Hero Section */}
        <header className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-primary/10">
            <img src={post.image.url} alt={post.image.alt_text} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/70 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-end min-h-[450px] p-8 md:p-12">
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories?.map(cat => (
                        <span key={cat} className="inline-block bg-secondary text-light text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{cat}</span>
                    ))}
                    {post.tags.map(tag => (
                        <span key={tag} className="inline-block bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{tag}</span>
                    ))}
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">{post.title}</h1>
                <div className="text-base text-gray-300 mt-4">
                    Published on <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                    {post.updated_at && new Date(post.updated_at).toDateString() !== new Date(post.date).toDateString() && (
                      <span className="italic"> (Updated on <time dateTime={post.updated_at}>{new Date(post.updated_at).toLocaleDateString()}</time>)</span>
                    )}
                     by {post.author}
                </div>
            </div>
        </header>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <article>
              <div 
                className="prose prose-lg max-w-none prose-custom"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Post Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-8">
                {previousPost ? (
                    <Link to={`/blog/${previousPost.slug}`} className="group text-left">
                        <p className="text-sm text-muted">Previous Post</p>
                        <p className="mt-1 font-bold text-lg text-dark group-hover:text-primary transition-colors flex items-center gap-2">
                            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                            {previousPost.title}
                        </p>
                    </Link>
                ) : <div />}
                 {nextPost ? (
                    <Link to={`/blog/${nextPost.slug}`} className="group text-right">
                        <p className="text-sm text-muted">Next Post</p>
                        <p className="mt-1 font-bold text-lg text-dark group-hover:text-primary transition-colors flex items-center justify-end gap-2">
                            {nextPost.title}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </p>
                    </Link>
                ) : <div />}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-8">
              
              <div className="bg-light p-6 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-dark mb-4 border-b border-gray-200 pb-3">Post Metrics</h3>
                <ul className="space-y-4 pt-2">
                  <li className="flex items-center justify-between text-muted">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="text-primary h-6 w-6"/>
                      <span>Current Rank</span>
                    </div>
                    <span className="font-mono font-bold text-xl text-dark">{post.metrics.rank}</span>
                  </li>
                  <li className="flex items-center justify-between text-muted">
                    <div className="flex items-center gap-3">
                      <MousePointer className="text-primary h-6 w-6"/>
                      <span>Total Clicks</span>
                    </div>
                    <span className="font-mono font-bold text-xl text-dark">{post.metrics.clicks}</span>
                  </li>
                  <li className="flex items-center justify-between text-muted">
                    <div className="flex items-center gap-3">
                      <Eye className="text-primary h-6 w-6"/>
                      <span>Total Impressions</span>
                    </div>
                    <span className="font-mono font-bold text-xl text-dark">{post.metrics.impressions}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-light p-6 rounded-2xl border border-gray-200 text-center">
                <img className="h-24 w-24 rounded-full mx-auto shadow-md" src="https://picsum.photos/seed/avatar/200/200" alt={post.author} />
                <h3 className="mt-4 text-xl font-bold text-dark">{post.author}</h3>
                <p className="text-primary text-sm font-semibold">Digital Marketing Specialist</p>
                <p className="text-muted text-sm mt-2">Documenting a 60-day challenge to rank a brand from scratch.</p>
                <Link to="/about" className="mt-4 inline-block bg-primary text-white text-sm font-bold py-2 px-4 rounded-full hover:brightness-95 transition-all">
                  About Me
                </Link>
              </div>

              <div className="bg-light p-6 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-dark mb-4">Share this post</h3>
                <div className="space-y-3">
                    <a 
                        href={`https://twitter.com/intent/tweet?url=${postUrl}&text=${encodedTitle}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full text-center bg-[#1DA1F2] text-white p-3 rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center gap-2 font-semibold"
                        aria-label="Share on Twitter"
                    >
                        <Twitter /> Share on Twitter
                    </a>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full text-center bg-[#0077B5] text-white p-3 rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center gap-2 font-semibold"
                        aria-label="Share on LinkedIn"
                    >
                        <Linkedin /> Share on LinkedIn
                    </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
       {relatedPosts.length > 0 && (
        <section className="py-24 bg-light border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-dark text-center mb-12">Related Posts</h2>
                <div className="grid gap-10 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                    {relatedPosts.map((relatedPost, index) => (
                        <PostCard 
                            key={relatedPost.id}
                            post={relatedPost}
                            style={{ transitionDelay: `${index * 100}ms`}}
                        />
                    ))}
                </div>
            </div>
        </section>
      )}

      <BackToTopButton />
    </div>
  );
};

export default BlogPostPage;