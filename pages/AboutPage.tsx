import React from 'react';
import { Database, Users, ClipboardCheck } from 'lucide-react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const AboutPage: React.FC = () => {
  const principles = [
    {
      icon: Database,
      title: 'Data-Driven Decisions',
      description: 'Every strategy is rooted in comprehensive data analysis, not guesswork.',
    },
    {
      icon: Users,
      title: 'User-First Approach',
      description: 'Great SEO is about creating a better experience for humans, not just algorithms.',
    },
    {
      icon: ClipboardCheck,
      title: 'Transparent Process',
      description: 'I believe in open communication and sharing the "why" behind every action.',
    },
  ];
  
  const toolkit = [
    'Technical SEO', 'Content Strategy', 'Keyword Research', 'On-Page Optimization',
    'Link Building Theory', 'Google Analytics', 'Google Search Console', 'Ahrefs',
    'Screaming Frog', 'Local SEO', 'E-Commerce SEO', 'Performance Analysis'
  ];

  const [mainRef, isMainVisible] = useIntersectionObserver();
  const [toolkitRef, isToolkitVisible] = useIntersectionObserver();

  return (
    <div className="bg-white py-24 text-secondary fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={mainRef} className={`lg:grid lg:grid-cols-5 lg:gap-16 items-start animate-on-scroll ${isMainVisible ? 'is-visible' : ''}`}>
          {/* Left Column: Image and Principles */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="relative animate-on-scroll is-visible" style={{ transitionDelay: '100ms' }}>
                <img
                  className="h-48 w-48 rounded-full mx-auto shadow-2xl shadow-primary/20"
                  src="https://picsum.photos/seed/avatar/200/200"
                  alt="Alex Doe"
                />
                 <div className="absolute inset-0 max-w-[12rem] max-h-[12rem] mx-auto rounded-full ring-4 ring-primary/50 ring-offset-4 ring-offset-white"></div>
              </div>
              <div className="mt-8 text-center animate-on-scroll is-visible" style={{ transitionDelay: '200ms' }}>
                <h2 className="text-3xl font-extrabold text-dark">Alex Doe</h2>
                <p className="mt-1 text-lg text-primary font-semibold">SEO Strategist & Digital Tinkerer</p>
              </div>
              <div className="mt-10 space-y-6">
                {principles.map((principle, index) => (
                  <div key={principle.title} className="flex items-start animate-on-scroll is-visible" style={{ transitionDelay: `${300 + index * 150}ms`}}>
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <principle.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-dark">{principle.title}</h4>
                      <p className="mt-1 text-sm text-muted">{principle.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column: Narrative */}
          <div className="mt-16 lg:mt-0 lg:col-span-3">
            <div className="animate-on-scroll is-visible" style={{ transitionDelay: '400ms' }}>
                <h1 className="text-4xl font-extrabold tracking-tight text-dark sm:text-5xl mb-8">
                    More Than Just an SEO: A Story of Data, Dedication, and Digital Growth.
                </h1>
                <div className="prose prose-lg max-w-none prose-gray space-y-6">
                    <p>
                        Hello! I'm Alex, an SEO professional with over 7 years of experience helping businesses of all sizes grow their online presence. My passion lies in the intersection of data, content, and user experience—the core components of modern, sustainable SEO.
                    </p>
                    <p>
                        Throughout my career, I've worked both in-house and at agencies, managing everything from technical SEO audits for e-commerce giants to content strategies for local businesses. I've seen what works, what doesn't, and what's just marketing fluff.
                    </p>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-200 animate-on-scroll is-visible" style={{ transitionDelay: '600ms' }}>
                 <h3 className="text-3xl font-extrabold text-dark">Why I Started This Challenge</h3>
                 <div className="prose prose-lg max-w-none prose-gray mt-6 space-y-6">
                    <p>
                        The SEO industry is full of gurus and grand promises. It's easy to show off impressive results when you're working with established brands that already have authority and a big budget. But what about starting from scratch?
                    </p>
                    <p>
                        I created the "Search Me If You Can" challenge for two reasons. First, to create a living, breathing case study that proves my skills in the most transparent way possible. Second, to demystify the SEO process and show what it really takes to rank a new brand with a budget of zero. It's a personal test, a public portfolio, and an open-source guide all in one.
                    </p>
                 </div>
            </div>
          </div>
        </div>

        {/* Toolkit Section */}
        <div ref={toolkitRef} className={`mt-24 pt-16 border-t border-gray-200 animate-on-scroll ${isToolkitVisible ? 'is-visible' : ''}`}>
            <h2 className="text-3xl font-extrabold text-center text-dark">My SEO Toolkit</h2>
            <p className="mt-4 text-center text-lg text-muted max-w-2xl mx-auto">The skills and technologies I use to build and execute effective SEO strategies.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
                {toolkit.map((tool, index) => (
                    <span 
                        key={tool}
                        className={`bg-light text-secondary font-medium py-2 px-4 rounded-full border border-gray-200 transition-colors hover:border-primary hover:text-primary cursor-default animate-on-scroll ${isToolkitVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: `${100 + index * 50}ms`}}
                    >
                        {tool}
                    </span>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;