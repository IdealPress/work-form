import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useReveal } from "lib";

function ProjectCard({ project }) {
  const [ref, inView, initiallyVisible] = useReveal();
  const [hasLoaded, setHasLoaded] = useState(false);

  // Wait for both, so we never fade in a half-decoded image or an empty box.
  const revealed = inView && hasLoaded;

  return (
    <Link href={`/projects/${project.uid}`}>
      <div className="w-full h-full space-y-2">
        <figure className="aspect-3/2 group">
          <Image
            ref={ref}
            className={`reveal ${revealed ? "reveal-in" : ""} ${
              initiallyVisible ? "reveal-delayed" : ""
            } ${hasLoaded ? "" : "bg-gray-200"}`}
            src={project?.data?.cover["3:2"]?.url}
            width={project?.data?.cover["3:2"]?.dimensions?.width}
            height={project?.data?.cover["3:2"]?.dimensions?.height}
            alt={project?.data?.cover?.alt}
            onLoad={() => setHasLoaded(true)}
          />
          <p className="mt-3 leading-snug text-xl group-focus:text-grey group-hover:text-grey">
            {project?.data?.title}
          </p>
        </figure>
      </div>
    </Link>
  );
}

export default function ProjectGrid({ projects = [] }) {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-6 md:gap-8">
      {projects.map((project, index) => (
        <ProjectCard project={project} key={index} />
      ))}
    </section>
  );
}
