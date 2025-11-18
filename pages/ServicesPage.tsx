
import React from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Search, Share2, Palette, Code, ArrowRight } from 'lucide-react';

const skillPillars = [
    {
      icon: Search,
      title: "SEO & Digital Marketing",
      skills: [
        "Uncover Hidden Growth Opportunities with Technical Audits",
        "Capture Your Audience with Search Intent Mapping",
        "Build Authority with Content Strategy & Topic Clustering",
        "Maximize Visibility with On-Page & Semantic SEO",
        "Track What Matters with Performance Analytics",
        "Dominate Your Niche with Personal Branding SEO",
        "Implement Frameworks for Sustainable Organic Growth",
      ],
      description: "My SEO approach blends creativity with data. I focus on building content ecosystems that drive consistent traffic, rank for high-intent keywords, and establish long-term authority."
    },
    {
      icon: Share2,
      title: "Social Media Marketing",
      skills: [
        "Develop Platform-Specific Content Strategies",
        "Create High-Engagement Formats (Reels, Carousels)",
        "Gain an Edge with Audience & Competitor Benchmarking",
        "Maximize Reach with Strategic Hashtags & Trend Analysis",
        "Build Your Brand Narrative Through Visual Storytelling",
        "Cultivate a Loyal Following with Organic Engagement Systems",
        "Optimize for Growth with Social Media Analytics",
      ],
      description: "I turn social platforms into lead-generating ecosystems that strengthen brand identity, increase reach, and drive measurable growth without relying on paid ads."
    },
    {
      icon: Palette,
      title: "Creative Graphic Design",
      skills: [
        "Establish a Memorable Brand with Visual Identity Kits",
        "Drive Action with High-Impact Marketing Materials",
        "Stop the Scroll with Stunning Social Media Creatives",
        "Define Your Brand with Professional Logo Design",
        "Enhance User Experience with Intuitive UI/UX Designs",
        "Communicate Your Message with Clarity and Impact",
      ],
      description: "My design philosophy: Simple. Bold. Strategic. Every design I create supports your brand story and enhances user experience."
    },
    {
      icon: Code,
      title: "Full-Stack Website Development",
      skills: [
        "Bring Your Vision to Life with End-to-End Development",
        "Build a Foundation for SEO Success",
        "Ensure a Flawless Experience on Any Device",
        "Convert Visitors with High-Performance Landing Pages",
        "Take Control of Your Content with Custom CMS",
        "Boost Rankings with a Fast, Secure, and Performant Site",
      ],
      description: "I build websites that are not just visually appealing but also technically strong, fast, user-friendly, and optimized for search engines."
    }
  ];


const ServicesPage: React.FC = () => {
    const [headerRef, isHeaderVisible] = useIntersectionObserver();
    const [skillsRef, isSkillsVisible] = useIntersectionObserver();
    const [ctaRef, isCtaVisible] = useIntersectionObserver();

    return (
        <div className="bg-light py-24 fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className={`text-center animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
                  <h1 className="text-4xl font-extrabold text-dark sm:text-5xl">What I Bring to the Digital World</h1>
                  <p className="mt-4 text-xl text-muted max-w-3xl mx-auto">
                    A multidimensional skill set built on creativity, analytics, and full-stack digital execution. My services are organized into four core pillars designed to create visibility, engagement, and long-term brand growth.
                  </p>
                </div>

                <div ref={skillsRef} className={`mt-20 animate-on-scroll ${isSkillsVisible ? 'is-visible' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {skillPillars.map((pillar, index) => (
                            <div 
                                key={pillar.title}
                                className={`bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-on-scroll ${isSkillsVisible ? 'is-visible' : ''}`}
                                style={{ transitionDelay: `${100 + index * 150}ms`}}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                                        <pillar.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-dark">{pillar.title}</h3>
                                </div>
                                <ul className="mt-6 space-y-2 list-disc list-inside text-muted">
                                    {pillar.skills.map(skill => <li key={skill}>{skill}</li>)}
                                </ul>
                                <p className="mt-6 text-sm text-secondary italic border-l-4 border-primary/50 pl-4">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <section ref={ctaRef} className={`mt-24 animate-on-scroll ${isCtaVisible ? 'is-visible' : ''}`}>
                    <div className="bg-secondary text-white rounded-2xl p-12 text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full"></div>
                        <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-primary/20 rounded-full"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold">Ready to put these skills to work?</h2>
                            <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                                This is what I bring to the table. Let's discuss how these services can be tailored to meet your brand's unique goals.
                            </p>
                            <div className="mt-8">
                                <Link to="/work-with-me" className="group inline-flex items-center justify-center bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:brightness-95">
                                    Let's Work Together
                                    <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ServicesPage;