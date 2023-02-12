import { DefaultLayout } from "components";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "prismicio";

export default function Projects({ content }) {
  return (
    <>
      <main className="space-y-12 mx-6 md:mx-8">
        <section className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {content.map((project, index) => (
            <Link href={`/projects/${project.uid}`} key={index}>
              <a>
                <div className="w-full h-full space-y-2">
                  <figure className="aspect-[3/2] group">
                    <Image
                      className="transition duration-300 hover:blur-sm"
                      src={project?.data?.cover['3:2']?.url}
                      width={project?.data?.cover['3:2']?.dimensions?.width}
                      height={project?.data?.cover['3:2']?.dimensions?.height}
                      alt={project?.data?.cover?.alt}
                    />
                    <p className="mt-1 leading-snug md:text-lg group-focus:text-gray-400 group-hover:text-gray-400">
                        {project?.data?.title}
                        {project?.tags?.map((tag, index) => (
                          <span
                            className="ml-2 text-gray-400"
                            key={index}
                          >
                            {tag}
                          </span>
                        ))}
                    </p>
                  </figure>
                </div>
              </a>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}

Projects.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData });
  const content = await client.getAllByType("project", {
    orderings: { field: "my.project.date", direction: "desc" },
  });
  return {
    props: { content },
  };
}
