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
      className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 group border border-gray-200 hover:border-primary hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/10 flex flex-col h-full animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      style={style}
    >
      <div className="relative overflow-hidden">
        <Link to={`/blog/${post.slug}`}>
          <img loading="lazy" className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110" src={post.image.url} alt={post.image.alt_text || post.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </Link>
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="inline-block bg-dark text-primary text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
            ))}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div>
          <div className="flex items-center text-sm text-muted mb-2">
            <time dateTime={post.date}>{post.date}</time>
            <span className="mx-2">&middot;</span>
            <span>{post.author}</span>
          </div>
          <Link to={`/blog/${post.slug}`} className="block mt-2">
            <p className="text-xl font-semibold text-dark group-hover:text-primary transition-colors h-14 overflow-hidden">{post.title}</p>
            <p className="mt-3 text-base text-muted h-20 overflow-hidden">{post.excerpt}</p>
          </Link>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-medium text-muted">
            <div className="flex items-center gap-1.5"><TrendingUp className="text-primary h-4 w-4" /> Rank: <span className="text-dark font-bold">{post.metrics.rank}</span></div>
            <div className="flex items-center gap-1.5"><MousePointer className="text-primary h-4 w-4" /> Clicks: <span className="text-dark font-bold">{post.metrics.clicks}</span></div>
            <div className="flex items-center gap-1.5"><Eye className="text-primary h-4 w-4" /> Impressions: <span className="text-dark font-bold">{post.metrics.impressions}</span></div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;