/**
 * ServicesPage
 * L7 Refactored - Uses centralized constants
 */
import React from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Search, Share2, Palette, Code, ArrowRight } from 'lucide-react';
import { ROUTES, SERVICES_STRINGS, SKILL_PILLARS } from '../constants';

// Icon mapping
const ICON_MAP = {
  Search,
  Share2,
  Palette,
  Code,
};

const ServicesPage: React.FC = () => {
  const [headerRef, isHeaderVisible] = useIntersectionObserver();
  const [skillsRef, isSkillsVisible] = useIntersectionObserver();
  const [ctaRef, isCtaVisible] = useIntersectionObserver();

  return (
    <div className="bg-light py-24 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`text-center animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
          <h1 className="text-4xl font-extrabold text-dark sm:text-5xl">{SERVICES_STRINGS.hero.title}</h1>
          <p className="mt-4 text-xl text-muted max-w-3xl mx-auto">
            {SERVICES_STRINGS.hero.subtitle}
          </p>
        </div>

        <div ref={skillsRef} className={`mt-20 animate-on-scroll ${isSkillsVisible ? 'is-visible' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SKILL_PILLARS.map((pillar, index) => {
              const IconComponent = ICON_MAP[pillar.iconName as keyof typeof ICON_MAP];
              return (
                <div
                  key={pillar.title}
                  className={`bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-on-scroll ${isSkillsVisible ? 'is-visible' : ''}`}
                  style={{ transitionDelay: `${100 + index * 150}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-dark">{pillar.title}</h3>
                  </div>
                  <ul className="mt-6 space-y-2 list-disc list-inside text-muted">
                    {pillar.skills.map(skill => <li key={skill}>{skill}</li>)}
                  </ul>
                  <p className="mt-6 text-sm text-muted italic border-l-4 border-primary/50 pl-4">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <section ref={ctaRef} className={`mt-24 animate-on-scroll ${isCtaVisible ? 'is-visible' : ''}`}>
          <div className="bg-secondary text-secondary-foreground rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full"></div>
            <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-primary/20 rounded-full"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold">{SERVICES_STRINGS.cta.title}</h2>
              <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary-foreground/80">
                {SERVICES_STRINGS.cta.subtitle}
              </p>
              <div className="mt-8">
                <Link to={ROUTES.WORK_WITH_ME} className="group inline-flex items-center justify-center bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:brightness-95">
                  {SERVICES_STRINGS.cta.button}
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