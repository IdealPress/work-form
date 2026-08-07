import Link from "next/link";

export default function LinkWrapper({ url, target, className, children }) {
  return url ? (
    <Link
      href={url}
      className={`group custom-blur focus:outline-hidden${
        className ? ` ${className}` : ""
      }`}
      target={target}
    >
      {children}
    </Link>
  ) : className ? (
    // Keep the wrapper's layout/sibling classes in play even without a link,
    // so callers relying on them (e.g. `peer`) still behave the same.
    <span className={className}>{children}</span>
  ) : (
    <>{children}</>
  );
}
