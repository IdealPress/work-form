import Link from "next/Link"

export default function LinkWrapper({url, children}) {
    return url ? (
        <Link href={url} target="_blank">
            <a>
                {children}
            </a>
        </Link>
    ) : (
        <>
            {children}
        </>
    )
}
  