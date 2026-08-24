import Link from "next/link";
import { useMemo } from "react";

import { FrameCycle } from "components";
import { pickCrop } from "lib";

// Every card is held to the same shape so the grid stays even, whatever crops
// the images behind it happen to have. `pickCrop` falls back to the nearest
// ratio a picture does have, so a project whose images were never cropped to
// this one — or cropped before it existed — still fills its card.
const CARD_RATIO = "4:3";

// Without this every card asks for a 3840px source, which the hover cycle would
// then multiply by the number of frames.
const GRID_SIZES =
  "(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

/**
 * The cover followed by the project's slice images. Deduped by URL, since a
 * cover is often also the first image on the project page — otherwise the cycle
 * would open by holding on the same picture twice.
 *
 * An image the editor has ticked "Hide from project grid preview" on is left
 * out: a project page often carries detail shots, type specimens or process
 * work that read at full width and turn to mush in a card. The cover is always
 * kept — it is the one image chosen to stand for the project, so there is
 * nothing to opt it out of.
 */
function useFrames(project) {
  return useMemo(() => {
    const images = [
      project?.data?.cover,
      ...(project?.data?.slices ?? [])
        .filter((slice) => slice.slice_type === "image_multiple")
        .flatMap((slice) => slice.items ?? [])
        .filter((item) => !item.hide_from_grid)
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
  // Index-only projects are listed in the archive but have no card here — the
  // filter lives in the grid rather than in the page so that every caller gets
  // it, and so the index alongside can keep showing the full run of work.
  const visible = useMemo(
    () => projects.filter((project) => !project?.data?.index_only),
    [projects],
  );

  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-gutter">
      {visible.map((project, index) => (
        <ProjectCard project={project} key={index} />
      ))}
    </section>
  );
}
