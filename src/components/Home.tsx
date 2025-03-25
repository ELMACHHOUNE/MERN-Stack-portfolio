import React, { Suspense, lazy } from "react";

// Lazy load sections
const Hero = lazy(() => import("./Hero"));
const About = lazy(() => import("./About"));
const Projects = lazy(() => import("./Projects"));
const Contact = lazy(() => import("./Contact"));

// Loading component for sections
const SectionLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="space-y-20">
      <Suspense fallback={<SectionLoading />}>
        <Hero />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <About />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Projects />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Contact />
      </Suspense>
    </div>
  );
};

export default Home;
