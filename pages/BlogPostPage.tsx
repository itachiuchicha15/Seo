import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { TrendingUp, MousePointer, Eye, ArrowLeft, ArrowRight, Twitter, Linkedin } from 'lucide-react';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const sortedPosts = [...blogPosts].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const postIndex = sortedPosts.findIndex(p => p.slug === slug);
  const post = sortedPosts[postIndex];
  
  const previousPost = postIndex < sortedPosts.length - 1 ? sortedPosts[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? sortedPosts[postIndex - 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="text-center py-20 text-dark">
        <h1 className="text-4xl font-bold">Post not found!</h1>
        <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">Back to the Challenge Log</Link>
      </div>
    );
  }

  const postUrl = window.location.href;
  const encodedTitle = encodeURIComponent(`Check out this SEO challenge update: "${post.title}"`);

  return (
    <div className="bg-white text-secondary fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:text-dark font-semibold transition-colors">
              <ArrowLeft size={20} />
              Back to all posts
            </Link>
        </div>

        {/* Hero Section */}
        <header className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-primary/10">
            <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/70 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-end min-h-[450px] p-8 md:p-12">
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="inline-block bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{tag}</span>
                    ))}
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">{post.title}</h1>
                <div className="text-base text-gray-300 mt-4">
                    Published on <time dateTime={post.date}>{post.date}</time> by {post.author}
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
                <img className="h-24 w-24 rounded-full mx-auto shadow-md" src="https://picsum.photos/seed/avatar/200/200" alt="Alex Doe" />
                <h3 className="mt-4 text-xl font-bold text-dark">{post.author}</h3>
                <p className="text-primary text-sm font-semibold">SEO Strategist</p>
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
    </div>
  );
};

export default BlogPostPage;
