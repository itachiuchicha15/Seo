import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { supabase } from '../lib/supabaseClient';
import { TrendingUp, MousePointer, Eye, ArrowLeft, ArrowRight, Linkedin, Calendar, Clock, Share2, Copy, Check, ArrowUpRight, Mail } from 'lucide-react';
import BackToTopButton from '../components/BackToTopButton';
import Breadcrumbs from '../components/Breadcrumbs';
import PostCard from '../components/PostCard';
import Skeleton from '../components/Skeleton';

// Define interface for navigation posts (subset of BlogPost)
interface NavPost {
  title: string;
  slug: string;
  date: string;
  image: {
    url: string;
    alt_text: string;
  };
}

const BlogPostSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Skeleton className="h-4 w-32 mx-auto mb-4" />
        <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>

      <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg h-[450px] bg-muted/10 shimmer"></div>

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
          <div className="bg-light p-6 rounded-2xl border border-muted/20">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
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

  // Reading Progress State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        const { data: prevData } = await supabase
          .from('posts')
          .select('title, slug, date, image')
          .lt('date', currentDate)
          .order('date', { ascending: false })
          .limit(1);

        if (prevData && prevData.length > 0) {
          setPreviousPost(prevData[0] as NavPost);
        }

        const { data: nextData } = await supabase
          .from('posts')
          .select('title, slug, date, image')
          .gt('date', currentDate)
          .order('date', { ascending: true })
          .limit(1);

        if (nextData && nextData.length > 0) {
          setNextPost(nextData[0] as NavPost);
        }

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
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return <div className="bg-white text-dark fade-in"><BlogPostSkeleton /></div>;
  }

  if (error || !post) {
    return (
      <div className="text-center py-32 text-dark">
        <h1 className="text-4xl font-bold">{error || 'Post not found!'}</h1>
        <Link to="/blog" className="mt-6 inline-block bg-primary text-light px-6 py-3 rounded-full font-bold hover:brightness-95 transition-all">
          Back to the Challenge Log
        </Link>
      </div>
    );
  }

  const postUrl = window.location.href;
  const encodedTitle = encodeURIComponent(`Check out this SEO challenge update: "${post.title}"`);

  const breadcrumbLinks = [
    { label: 'Home', path: '/' },
    { label: 'Challenge Log', path: '/blog' },
    { label: post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title, path: `/blog/${post.slug}` },
  ];

  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="bg-white text-dark fade-in relative">
      {/* Reading Progress Bar - Themed */}
      <div className="fixed top-16 left-0 h-1 bg-light z-40 w-full">
        <div className="h-full bg-primary transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        <div className="mb-8">
          <Breadcrumbs links={breadcrumbLinks} />
        </div>

        {/* Editorial Header */}
        <header className="max-w-4xl mx-auto text-center mb-12 relative">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl opacity-60"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {post.categories?.map(cat => (
              <span key={cat} className="inline-block bg-primary/10 text-primary border border-primary/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {cat}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-dark leading-tight tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-xl text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted border-t border-b border-muted/10 py-4 mb-8">
            <div className="flex items-center gap-2">
              <img className="h-8 w-8 rounded-full object-cover border border-muted/10 ring-2 ring-white shadow-sm" src="https://picsum.photos/seed/avatar/100/100" alt={post.author} />
              <span className="font-bold text-dark">{post.author}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-muted/20"></div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <time className="font-medium" dateTime={post.date}>{new Date(post.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</time>
            </div>
            <div className="hidden sm:block w-px h-4 bg-muted/20"></div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">{readTime} min read</span>
            </div>
          </div>
        </header>

        {/* Immersive Featured Image */}
        <div className="relative rounded-3xl overflow-hidden mb-16 shadow-2xl shadow-muted/10 group border border-muted/10">
          <img src={post.image.url} alt={post.image.alt_text} className="w-full h-auto max-h-[600px] object-cover transition-transform duration-1000 group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent pointer-events-none"></div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">

          {/* Main Content */}
          <div className="lg:col-span-8">
            <article>
              <div
                className="prose prose-lg md:prose-xl max-w-none prose-custom 
                prose-headings:font-extrabold prose-headings:text-dark prose-headings:scroll-mt-24
                prose-p:text-dark/80 prose-p:leading-relaxed 
                prose-a:text-primary prose-a:no-underline prose-a:border-b-2 prose-a:border-primary/20 hover:prose-a:border-primary 
                prose-img:rounded-2xl prose-img:shadow-xl
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-light/40 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-dark
                first-letter:float-left first-letter:text-7xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:mt-[-10px]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Tags - Themed */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-muted/10">
                <h3 className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-4">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link to={`/blog?tag=${tag}`} key={tag} className="text-xs font-bold bg-light text-dark/70 px-4 py-2 rounded-lg border border-muted/20 hover:bg-primary hover:text-light hover:border-primary transition-all duration-300">
                      #{tag.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Rich Post Navigation - Themed */}
            <nav className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              {previousPost ? (
                <Link to={`/blog/${previousPost.slug}`} className="group relative h-40 rounded-2xl overflow-hidden flex items-end p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-muted/10">
                  {previousPost.image && (
                    <img src={previousPost.image.url} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="relative z-10 text-light w-full">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1 flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Previous</span>
                    <h4 className="font-bold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">{previousPost.title}</h4>
                  </div>
                </Link>
              ) : <div />}

              {nextPost && (
                <Link to={`/blog/${nextPost.slug}`} className="group relative h-40 rounded-2xl overflow-hidden flex items-end p-6 text-right shadow-lg hover:shadow-xl transition-all duration-300 border border-muted/10">
                  {nextPost.image && (
                    <img src={nextPost.image.url} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="relative z-10 text-light w-full flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1 flex items-center gap-1">Next <ArrowRight className="w-3 h-3" /></span>
                    <h4 className="font-bold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">{nextPost.title}</h4>
                  </div>
                </Link>
              )}
            </nav>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 mt-16 lg:mt-0">
            <div className="sticky top-24 space-y-8">

              {/* Mission Control Widget - FIXED: Switched from hardcoded black/green to brand tokens */}
              <div className="bg-dark p-6 rounded-3xl border border-primary/20 text-light shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <TrendingUp className="w-24 h-24 text-light" />
                </div>

                <div className="flex items-center justify-between mb-6 border-b border-light/5 pb-4 relative z-10">
                  <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                    Mission Control
                  </h3>
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live</span>
                  </span>
                </div>

                <ul className="space-y-6 relative z-10">
                  <li className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3 text-muted/60 group-hover/item:text-light transition-colors">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-bold text-xs uppercase tracking-wide">SERP Rank</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-3xl text-light block leading-none">{post.metrics.rank}</span>
                      <span className="text-[10px] text-primary font-bold flex items-center justify-end gap-0.5 mt-1">
                        <ArrowUpRight className="w-3 h-3" /> TOP 10
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3 text-muted/60 group-hover/item:text-light transition-colors">
                      <MousePointer className="h-5 w-5 text-primary" />
                      <span className="font-bold text-xs uppercase tracking-wide">Clicks</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-3xl text-light block leading-none">{post.metrics.clicks}</span>
                      <span className="text-[10px] text-primary font-bold flex items-center justify-end gap-0.5 mt-1">
                        <ArrowUpRight className="w-3 h-3" /> +12%
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3 text-muted/60 group-hover/item:text-light transition-colors">
                      <Eye className="h-5 w-5 text-primary" />
                      <span className="font-bold text-xs uppercase tracking-wide">Impressions</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-3xl text-light block leading-none">{post.metrics.impressions}</span>
                      <span className="text-[10px] text-primary font-bold flex items-center justify-end gap-0.5 mt-1">
                        <ArrowUpRight className="w-3 h-3" /> +8%
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Newsletter / CTA Widget - Themed */}
              <div className="bg-primary text-light p-6 rounded-3xl shadow-xl relative overflow-hidden group border border-primary/20">
                <div className="absolute -right-8 -top-8 bg-white/5 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -left-8 -bottom-8 bg-white/5 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 delay-100"></div>

                <div className="relative z-10">
                  <div className="bg-white/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                    <Mail className="h-5 w-5 text-light" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Don&apos;t Miss an Update</h3>
                  <p className="text-light/80 text-sm mb-6 leading-relaxed">
                    Join the journey. Get the latest rankings, strategies, and failures delivered straight to your inbox.
                  </p>
                  <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-light/40 text-light focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all text-sm font-medium"
                    />
                    <button className="w-full bg-light text-primary font-bold py-3 rounded-xl hover:bg-white transition-all text-sm shadow-lg">
                      Join The List
                    </button>
                  </form>
                </div>
              </div>

              {/* Author Profile - Themed */}
              <div className="bg-white p-6 rounded-3xl border border-muted/10 shadow-sm text-center group hover:shadow-md transition-all">
                <div className="relative inline-block">
                  <img className="h-20 w-20 rounded-full mx-auto shadow-md object-cover ring-4 ring-light group-hover:ring-primary/20 transition-all" src="https://picsum.photos/seed/avatar/200/200" alt={post.author} />
                  <div className="absolute bottom-0 right-0 bg-primary text-light text-[10px] font-bold px-1.5 py-0.5 rounded border-2 border-white shadow-sm uppercase tracking-tighter">SEO</div>
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-dark">{post.author}</h3>
                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mt-1">SEO Specialist</p>
                <p className="text-muted text-sm mt-4 leading-relaxed line-clamp-3 font-medium">
                  Documenting the raw, unfiltered journey of ranking a brand new site from scratch in 60 days.
                </p>
                <Link to="/about" className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-light text-dark text-xs font-bold py-3 px-4 rounded-xl hover:bg-primary hover:text-light transition-all border border-muted/10 hover:border-primary">
                  View Full Profile
                </Link>
              </div>

              {/* Share Widget - Themed */}
              <div className="bg-white p-6 rounded-3xl border border-muted/10 shadow-sm">
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Share2 className="w-3 h-3 text-primary" />
                  Share Update
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleCopyLink}
                    className={`w-full text-center p-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs border ${copied ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-muted/20 text-dark/70 hover:bg-light'}`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'COPIED!' : 'COPY LINK'}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${postUrl}&text=${encodedTitle}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full text-center bg-dark text-light p-2.5 rounded-xl transition-opacity hover:opacity-80 flex items-center justify-center gap-2 font-bold text-xs"
                      aria-label="Share on X"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                      SHARE
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full text-center bg-[#0077B5] text-white p-2.5 rounded-xl transition-opacity hover:opacity-90 flex items-center justify-center gap-2 font-bold text-xs"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" /> LINKEDIN
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="py-24 bg-light border-t border-muted/10 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-extrabold text-dark">More from the Log</h2>
              <Link to="/blog" className="text-primary font-bold hover:underline underline-offset-4 flex items-center gap-1">View All Logs <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {relatedPosts.map((relatedPost, index) => (
                <PostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  style={{ transitionDelay: `${index * 100}ms` }}
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