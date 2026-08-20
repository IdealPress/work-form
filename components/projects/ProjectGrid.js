import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useInterval, useReveal } from "lib";

// How long each frame holds before the next one cuts in.
const CYCLE_MS = 900;

// Hovering shouldn't pull down a project's whole slice zone — a handful of
// frames reads as a preview, and anything past that is a reason to visit.
const MAX_FRAMES = 8;

// Without this every card asks for a 3840px source, which the hover cycle would
// then multiply by the number of frames.
const GRID_SIZES =
  "(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

/**
 * The cover followed by the project's slice images, all at their 3:2 crop so
 * every frame fills the same box. Deduped by URL, since a cover is often also
 * the first image on the project page — otherwise the cycle would open by
 * holding on the same picture twice.
 */
function useFrames(project) {
  return useMemo(() => {
    const images = [
      project?.data?.cover?.["3:2"],
      ...(project?.data?.slices ?? [])
        .filter((slice) => slice.slice_type === "image_multiple")
        .flatMap((slice) => slice.items ?? [])
        .map((item) => item.image?.["3:2"]),
    ];

    const seen = new Set();
    return images
      .filter((image) => {
        if (!image?.url || seen.has(image.url)) return false;
        seen.add(image.url);
        return true;
      })
      .slice(0, MAX_FRAMES);
  }, [project]);
}

function ProjectCard({ project }) {
  const [ref, inView, initiallyVisible] = useReveal();
  const [hasLoaded, setHasLoaded] = useState(false);

  const frames = useFrames(project);
  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(false);

  // High-water mark of frames that have been mounted. Frames load one ahead of
  // where the cycle has reached, so a hover fetches at the pace it's watched
  // rather than all at once, and re-hovering a card doesn't start over.
  const [reach, setReach] = useState(0);

  // Wait for both, so we never fade in a half-decoded image or an empty box.
  const revealed = inView && hasLoaded;

  useInterval(
    () => {
      const next = (index + 1) % frames.length;
      setIndex(next);
      setReach(Math.max(reach, Math.min(next + 1, frames.length - 1)));
    },
    cycling ? CYCLE_MS : null,
  );

  const startCycling = () => {
    if (frames.length < 2) return;

    // Touch taps can raise a mouseenter, and a cycle nobody asked for is worse
    // on a phone than no cycle at all. Reduced motion opts out for the same
    // reason the scroll reveals do.
    if (
      typeof window.matchMedia === "function" &&
      (!window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }

    // The first frame mounts on enter rather than on the first tick, so it has
    // a full interval to load before it's shown.
    setReach(Math.max(reach, 1));
    setCycling(true);
  };

  const stopCycling = () => {
    setCycling(false);
    setIndex(0);
  };

  return (
    <Link href={`/projects/${project.uid}`}>
      <div className="w-full h-full space-y-2">
        <figure
          className="aspect-3/2 group"
          onMouseEnter={startCycling}
          onMouseLeave={stopCycling}
        >
          {/* Frames stack in source order and each one is opaque, so a
              frame that hasn't finished decoding shows the frame beneath
              rather than a gap — which is what keeps a cut, with no fade to
              cover the gap, from flashing. Everything past the cover stays
              mounted once reached, which is what makes leaving and returning
              instant. */}
          <div className="relative">
            <Image
              ref={ref}
              className={`reveal ${revealed ? "reveal-in" : ""} ${
                initiallyVisible ? "reveal-delayed" : ""
              } ${hasLoaded ? "" : "bg-gray-200"}`}
              src={frames[0]?.url}
              width={frames[0]?.dimensions?.width}
              height={frames[0]?.dimensions?.height}
              sizes={GRID_SIZES}
              alt={project?.data?.cover?.alt}
              onLoad={() => setHasLoaded(true)}
            />
            {frames.slice(1, reach + 1).map((frame, offset) => (
              <Image
                key={frame.url}
                className={`absolute inset-0 w-full h-full object-cover ${
                  offset + 1 <= index ? "opacity-100" : "opacity-0"
                }`}
                src={frame.url}
                width={frame.dimensions?.width}
                height={frame.dimensions?.height}
                sizes={GRID_SIZES}
                // Decorative: the cover above already names the project.
                alt=""
              />
            ))}
          </div>
          <p className="mt-3 leading-snug text-lg group-focus:text-grey group-hover:text-grey">
            {project?.data?.title}
          </p>
        </figure>
      </div>
    </Link>
  );
}

export default function ProjectGrid({ projects = [] }) {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-6 md:gap-6">
      {projects.map((project, index) => (
        <ProjectCard project={project} key={index} />
      ))}
    </section>
  );
}
