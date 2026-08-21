import Link from "next/link";
import { useMemo } from "react";

import { FrameCycle } from "components";
import { pickCrop } from "lib";

// Every card is held to the same shape so the grid stays even, whatever crops
// the images behind it happen to have. `pickCrop` falls back to the nearest
// ratio a picture does have, so a project whose images were never cropped to
// this one — or cropped before it existed — still fills its card.
const CARD_RATIO = "3:2";

// Without this every card asks for a 3840px source, which the hover cycle would
// then multiply by the number of frames.
const GRID_SIZES =
  "(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

/**
 * The cover followed by the project's slice images. Deduped by URL, since a
 * cover is often also the first image on the project page — otherwise the cycle
 * would open by holding on the same picture twice.
 */
function useFrames(project) {
  return useMemo(() => {
    const images = [
      project?.data?.cover,
      ...(project?.data?.slices ?? [])
        .filter((slice) => slice.slice_type === "image_multiple")
        .flatMap((slice) => slice.items ?? [])
        .map((item) => item.image),
    ];

    const seen = new Set();
    return images.filter((image) => {
      const url = pickCrop(image, CARD_RATIO)?.url;
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }, [project]);
}

function ProjectCard({ project }) {
  const frames = useFrames(project);

  return (
    <Link href={`/projects/${project.uid}`} className="group block">
      <figure>
        <FrameCycle
          frames={frames}
          ratio={CARD_RATIO}
          sizes={GRID_SIZES}
          alt={project?.data?.cover?.alt}
        />
        <figcaption className="mt-3 leading-snug text-lg group-focus:text-grey group-hover:text-grey">
          {project?.data?.title}
        </figcaption>
      </figure>
    </Link>
  );
}

export default function ProjectGrid({ projects = [] }) {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-gutter">
      {projects.map((project, index) => (
        <ProjectCard project={project} key={index} />
      ))}
    </section>
  );
}
