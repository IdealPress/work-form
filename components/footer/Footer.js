import Link from "next/link";

export default function Footer() {
  return (
    <div className="relative md:flex md:h-60 p-8 md:space-x-12 space-y-6 md:space-y-0 mt-12">
      <div className="w-full md:w-1/3 lg:w-1/4">
        <p>For project enquires and portfolio requests please email studio at work-form.co.uk</p>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/5">
        <p>work-form</p>
        <p>Studio 6, Assembly Point Studios,</p> 
        <p>47 Staffordshire Street,</p>
        <p>London</p>
        <p>SE15 5TJ</p>
      </div>
      <div className="w-full sm:w-1/3 md:w-1/5">
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
          <li>
            <Link href="/projects">
              <a>Projects</a>
            </Link>
          </li>
          <li>
            <a href="https://www.instagram.com/workform/">Instagram</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
