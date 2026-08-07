import Image from "next/image";
import Link from "next/link";

export default function ProjectGrid({ projects = [] }) {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-6 md:gap-8">
      {projects.map((project, index) => (
        <Link href={`/projects/${project.uid}`} key={index}>
          <div className="w-full h-full space-y-2">
            <figure className="aspect-3/2 group">
              <Image
                className="transition duration-300  bg-gray-200"
                src={project?.data?.cover["3:2"]?.url}
                width={project?.data?.cover["3:2"]?.dimensions?.width}
                height={project?.data?.cover["3:2"]?.dimensions?.height}
                alt={project?.data?.cover?.alt}
              />
              <p className="mt-3 leading-snug text-xl group-focus:text-grey group-hover:text-grey">
                {project?.data?.title}
              </p>
            </figure>
          </div>
        </Link>
      ))}
    </section>
  );
}
