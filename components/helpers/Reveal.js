import { useReveal } from "lib";

/**
 * The class list for something that arrives on scroll. Exported so components
 * that have to own their own element (an <Image> that also needs its `onLoad`)
 * reveal on exactly the same terms as everything wrapped in <Reveal>.
 *
 * `variant` picks how it arrives: images resolve out of a blur, and so do the
 * blocks of small type in the index — but a single line of large text looks
 * mis-rendered rather than resolving, so it fades instead.
 */
export function revealClass(revealed, delayed, { variant = "blur" } = {}) {
  return [
    variant === "fade" ? "reveal reveal-fade" : "reveal",
    revealed ? "reveal-in" : "",
    delayed ? "reveal-delayed" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Wraps anything that should arrive as it scrolls into view — index rows,
 * captions, blocks of text. Images go through `ImageWrapper`, which waits on
 * the decode as well as the scroll.
 *
 * `ready` holds the reveal back for content that has its own loading to do;
 * `delay` staggers a first screenful in behind the nav.
 */
export default function Reveal({
  as: Tag = "div",
  ready = true,
  variant = "blur",
  className = "",
  children,
  ...rest
}) {
  const [ref, inView, initiallyVisible] = useReveal();

  return (
    <Tag
      ref={ref}
      className={`${revealClass(inView && ready, initiallyVisible, {
        variant,
      })} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
