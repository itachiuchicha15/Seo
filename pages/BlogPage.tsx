import React from 'react';
import { blogPosts } from '../data/blogPosts';
import PostCard from '../components/PostCard';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const BlogPage: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div className="py-24 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
          <h1 className="text-4xl font-extrabold text-dark sm:text-5xl">Challenge Log</h1>
          <p className="mt-4 text-xl text-muted max-w-2xl mx-auto">
            Follow the day-by-day journey, with all the wins, failures, and lessons learned along the way.
          </p>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {blogPosts
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((post, index) => (
              <PostCard 
                key={post.id} 
                post={post} 
                style={{ transitionDelay: `${index * 100}ms`}}
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
