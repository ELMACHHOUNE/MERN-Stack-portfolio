import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Project One",
    description:
      "A modern web application built with React and TypeScript. Features include responsive design, dark mode, and real-time updates.",
    image: "https://via.placeholder.com/600x400",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    githubLink: "https://github.com/yourusername/project1",
    liveLink: "https://project1.com",
  },
  {
    id: 2,
    title: "Project Two",
    description:
      "Full-stack application with authentication, database integration, and RESTful API endpoints.",
    image: "https://via.placeholder.com/600x400",
    technologies: ["Next.js", "MongoDB", "Express", "JWT"],
    githubLink: "https://github.com/yourusername/project2",
    liveLink: "https://project2.com",
  },
  {
    id: 3,
    title: "Project Three",
    description:
      "Mobile-first responsive website with modern UI/UX design principles and smooth animations.",
    image: "https://via.placeholder.com/600x400",
    technologies: ["React", "Framer Motion", "SASS", "Firebase"],
    githubLink: "https://github.com/yourusername/project3",
    liveLink: "https://project3.com",
  },
];

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Ensure elements are mounted before animating
    if (!titleRef.current || !cardsRef.current.length) {
      console.log("Elements not ready yet");
      return;
    }

    console.log("Initializing GSAP animations");

    // Animate section title
    gsap.fromTo(
      titleRef.current,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animate project cards
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(
        card,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Hover animations for cards
      const image = card.querySelector("img");
      const overlay = card.querySelector(".overlay");
      const content = card.querySelector(".content");

      if (!image || !overlay || !content) return;

      const handleMouseEnter = () => {
        gsap.to(image, {
          scale: 1.1,
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(content, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(image, {
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(content, {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      // Cleanup event listeners
      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    return () => {
      // Cleanup ScrollTrigger
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 bg-gradient-to-b from-gray-900 to-gray-800"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          ref={titleRef}
          className="text-4xl font-bold text-center mb-12 relative text-white"
        >
          My Projects
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              ref={(el) => {
                if (el) {
                  cardsRef.current[project.id - 1] = el;
                }
              }}
              className="group bg-gray-800 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="overlay absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0"></div>
                <div className="content absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0">
                  <div className="flex space-x-4">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-white hover:text-purple-500 transition-colors duration-300"
                    >
                      <i className="fab fa-github mr-2"></i>
                      GitHub
                    </a>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-white hover:text-purple-500 transition-colors duration-300"
                    >
                      <i className="fas fa-external-link-alt mr-2"></i>
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
