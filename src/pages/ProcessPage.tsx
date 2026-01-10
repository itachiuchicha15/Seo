/**
 * ProcessPage
 * L7 Refactored - Uses centralized constants
 */
import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Layers, PenTool, BarChart3, Megaphone } from 'lucide-react';
import { PROCESS_STRINGS, PROCESS_STEPS, PROCESS_TOOLS } from '../constants';

// Icon mapping
const ICON_MAP = {
  Layers,
  PenTool,
  BarChart3,
  Megaphone,
};

const ProcessPage: React.FC = () => {
  const [headerRef, isHeaderVisible] = useIntersectionObserver();
  const [toolsRef, isToolsVisible] = useIntersectionObserver();

  return (
    <div className="bg-light py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`text-center animate-on-scroll ${isHeaderVisible ? 'is-visible' : ''}`}>
          <h1 className="text-4xl font-extrabold text-dark sm:text-5xl">{PROCESS_STRINGS.hero.title}</h1>
          <p className="mt-4 text-xl text-muted max-w-2xl mx-auto">
            {PROCESS_STRINGS.hero.subtitle}
          </p>
        </div>

        <div className="mt-20">
          <div className="relative">
            {/* The vertical timeline bar */}
            <div className="absolute left-1/2 -ml-px w-0.5 h-full bg-gray-200" aria-hidden="true"></div>

            <div className="space-y-12">
              {PROCESS_STEPS.map((step, index) => {
                const isLeft = index % 2 === 0;
                const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });
                const IconComponent = ICON_MAP[step.iconName as keyof typeof ICON_MAP];
                return (
                  <div
                    key={step.number}
                    ref={ref}
                    className={`relative flex items-center animate-on-scroll ${isVisible ? 'is-visible' : ''} ${isLeft ? 'justify-start' : 'justify-end'}`}
                  >
                    {/* Step Marker */}
                    <div className={`absolute left-1/2 -translate-x-1/2 z-10`}>
                      <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-primary shadow-lg">
                        <span className="absolute text-5xl font-bold text-primary/10 select-none">{step.number}</span>
                        <IconComponent className="h-8 w-8 text-primary z-10" />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`w-[calc(50%-4rem)] ${isLeft ? 'pr-8' : 'pl-8'}`}>
                      <div
                        className={`p-6 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 border-t-4 border-transparent hover:border-t-primary ${isLeft ? 'text-right' : 'text-left'}`}
                      >
                        <h3 className="text-2xl font-bold text-dark">{step.title}</h3>
                        <p className="mt-2 text-muted">{step.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={toolsRef} className={`mt-24 pt-16 animate-on-scroll ${isToolsVisible ? 'is-visible' : ''}`}>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 text-center">
            <h2 className="text-3xl font-extrabold text-dark">{PROCESS_STRINGS.tools.title}</h2>
            <p className="mt-4 text-lg text-muted">{PROCESS_STRINGS.tools.subtitle}</p>
            <div className="mt-8 flex justify-center flex-wrap gap-4">
              {PROCESS_TOOLS.map(tool => (
                <span
                  key={tool}
                  className="bg-light text-primary font-medium py-2 px-4 rounded-full border border-gray-200 transition-colors hover:border-primary hover:text-primary"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessPage;
