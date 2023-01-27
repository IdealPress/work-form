import * as prismicH from "@prismicio/helpers";
import { PrismicRichText, SliceZone } from "@prismicio/react";

import { createClient, linkResolver } from "prismicio";
import { components } from "slices";

import { ProjectLayout } from "components";
import { useRouter } from "next/router";

export default function Project({ content }) {
  const router = useRouter();
  return (
    <>
      <main className="space-y-12">
        {router.query.text ? (
          <>
            <section className="mx-8 lg:w-3/5">
              <div className="prose-lg max-w-none">
                <PrismicRichText field={content.data.about_text} />
              </div>
            </section>
            <section className="mx-8 lg:w-3/5 space-y-4">
              <div>
                <p className="text-xs">Client</p>
                <PrismicRichText field={content.data.client} />
              </div>
              <div>
                <p className="text-xs">Category</p>
                <p className="space-x-2">
                  {content.tags.map((tag, index) => (
                    <span key={index}>{tag}</span>
                  ))}
                </p>
              </div>
              {content?.data?.date && (
                <div>
                  <p className="text-xs">Year</p>
                  <p className="space-x-2">
                    {new Date(content.data.date).toLocaleDateString('en-GB', {year: 'numeric'})}
                  </p>
                </div>
              )}
              {content?.data?.more?.length > 0 && (
                <div>
                  <p className="text-xs">More</p>
                  <PrismicRichText field={content.data.more} />
                </div>
              )}
            </section>
          </>
        ) : (
          <>
          {content?.data?.slices && (
            <SliceZone slices={content?.data?.slices} components={components} context={content} />
          )}
          </>
        )}
      </main>
    </>
  );
}

Project.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>;
};

export async function getStaticPaths() {
  const client = createClient();
  const documents = await client.getAllByType("project");
  return {
    paths: documents.map((doc) => prismicH.asLink(doc, linkResolver)),
    fallback: true,
  };
}

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData });
  const content = await client.getByUID("project", params.uid);
  return {
    props: { content },
  };
}
