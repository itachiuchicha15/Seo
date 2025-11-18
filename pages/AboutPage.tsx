
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

  const [mainRef, isMainVisible] = useIntersectionObserver();

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
                  alt="Eswarapandi Vinayagamoorthy"
                />
                 <div className="absolute inset-0 max-w-[12rem] max-h-[12rem] mx-auto rounded-full ring-4 ring-primary/50 ring-offset-4 ring-offset-white"></div>
              </div>
              <div className="mt-8 text-center animate-on-scroll is-visible" style={{ transitionDelay: '200ms' }}>
                <h2 className="text-3xl font-extrabold text-dark">Eswarapandi Vinayagamoorthy</h2>
                <p className="mt-1 text-lg text-primary font-semibold">Digital Marketing Specialist</p>
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
            <div className="animate-on-scroll is-visible space-y-12" style={{ transitionDelay: '400ms' }}>
                <div className="prose prose-lg max-w-none prose-gray space-y-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-dark sm:text-5xl !mb-8">
                        My Story
                    </h1>
                    <p>
                        I’m Eswarapandi Vinayagamoorthy, a Digital Marketing Specialist, SEO Strategist, Creative Graphic Designer, and Full-Stack Website Development driven by one mission: to build brands that not only look good but rank, convert, and grow. My journey into the digital world began long before I earned my degrees in MSc Digital Marketing from Northumbria University, UK, and BSc Visual Communication from the University of Madras, India. It started with curiosity an urge to understand how people interact with brands, what makes content memorable, and why certain businesses rise while others disappear in the digital noise.
                    </p>
                    <p>
                        Today, after more than three years of hands-on experience across digital communication, client support, content creation, branding, and technical development, I’ve built a multidisciplinary skill set that allows me to approach every project from a 360° perspective. I don’t just design. I don’t just write. I don’t just optimize. I strategize, build, analyze, and improve ensuring every digital element works together for measurable results.
                    </p>
                     <p>
                        This website and the "Search Me If You Can" challenge are my way of demonstrating these skills in action. It's a commitment to transparency and a real-time showcase of what's possible with a strategic, data-driven approach to digital marketing.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;