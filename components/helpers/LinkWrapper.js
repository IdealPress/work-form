import Link from "next/link"

export default function LinkWrapper({url, target, children}) {
    return url ? (
        <Link href={url}>
            <a className="group custom-blur focus:outline-none" target={target}>
                {children}
            </a>
        </Link>
    ) : (
        <>
            {children}
        </>
    )
}
  