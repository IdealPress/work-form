// Modules
import { SliceZone } from "@prismicio/react";

// Lib
import { createClient } from "prismicio";
import { components } from "slices";

// Components
import { DefaultLayout } from "components";

export default function Home({ content }) {
  return (
    <main className="space-y-12">
      {content?.data?.slices && (
        <SliceZone slices={content?.data?.slices} components={components} context={content} />
      )}
    </main>
  );
}

Home.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

const homeGraphQuery = `{
  home {
    ...homeFields
    slices {
      ...on project {
        variation {
          ...on default {
            items {
              ...itemsFields
              project {
                ...on project {
                  ...projectFields
                }
              }
            }
          }
        }
      }
    }
  }
}`;


export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData });
  const content = await client.getSingle("home", {
    graphQuery: homeGraphQuery
  });
  return {
    props: { content },
  };
}
