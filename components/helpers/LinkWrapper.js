import Link from "next/link";

export default function LinkWrapper({ url, target, children }) {
  return url ? (
    <Link
      href={url}
      className="group custom-blur focus:outline-hidden"
      target={target}
    >
      {children}
    </Link>
  ) : (
    <>{children}</>
  );
}
