import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { TrendingUp, MousePointer, Eye } from 'lucide-react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface PostCardProps {
  post: BlogPost;
  style?: React.CSSProperties;
}

const PostCard: React.FC<PostCardProps> = ({ post, style }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div 
      ref={ref}
      className={`bg-white rounded-3xl shadow-sm overflow-hidden transition-all duration-300 group border border-muted/10 hover:border-primary hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      style={style}
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        <Link to={`/blog/${post.slug}`} className="block h-full">
          <img loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={post.image.url} alt={post.image.alt_text || post.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
        </Link>
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="inline-block bg-dark/90 text-light text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-sm">{tag}</span>
            ))}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div>
          <div className="flex items-center text-xs font-bold text-muted uppercase tracking-widest mb-3">
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
            <span className="mx-2 opacity-30">&middot;</span>
            <span className="text-primary">{post.author}</span>
          </div>
          <Link to={`/blog/${post.slug}`} className="block">
            <h3 className="text-xl font-extrabold text-dark group-hover:text-primary transition-colors leading-snug line-clamp-2 h-14 mb-3">{post.title}</h3>
            <p className="text-sm text-dark/70 leading-relaxed line-clamp-2 h-10 mb-4">{post.excerpt}</p>
          </Link>
        </div>
        <div className="mt-auto pt-4 border-t border-light flex justify-between items-center text-[11px] font-bold text-muted uppercase tracking-wider">
            <div className="flex items-center gap-1.5"><TrendingUp className="text-primary h-3.5 w-3.5" /> Rank: <span className="text-dark">{post.metrics.rank}</span></div>
            <div className="flex items-center gap-1.5"><MousePointer className="text-primary h-3.5 w-3.5" /> Clicks: <span className="text-dark">{post.metrics.clicks}</span></div>
            <div className="flex items-center gap-1.5"><Eye className="text-primary h-3.5 w-3.5" /> Impr: <span className="text-dark">{post.metrics.impressions}</span></div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;