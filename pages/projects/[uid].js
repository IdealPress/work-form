import dynamic from 'next/dynamic'
import { useRouter } from "next/router";
import * as prismicH from "@prismicio/helpers";
import { PrismicRichText, SliceZone } from "@prismicio/react";

import { createClient, linkResolver } from "prismicio";

import { ProjectLayout } from "components";
import { components } from "slices";


const Sticker = dynamic(() =>
  import('../../components').then((mod) => mod.Sticker), {
    ssr: false,
  }
)

export default function Project({ content }) {
  const router = useRouter();
  return (
    <>
      <main className="space-y-28 mt-4">
        {router.query.text ? (
          <>
            <section className="mx-6 md:mx-8 lg:w-3/5">
              <div className="prose-xl max-w-[65ch]">
                <PrismicRichText field={content.data.about_text} />
              </div>
            </section>
            <section className="mx-6 md:mx-8 lg:w-3/5 space-y-4">
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
          <Sticker key={router.asPath} />
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
  return <ProjectLayout title={page.props.content.data.title}>{page}</ProjectLayout>;
};

export async function getStaticPaths() {
  const client = createClient();
  const documents = await client.getAllByType("project");
  return {
    paths: documents.map((doc) => prismicH.asLink(doc, linkResolver)),
    fallback: false,
  };
}

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData });
  const content = await client.getByUID("project", params.uid);
  return {
    props: { content },
  };
}
