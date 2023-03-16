// Modules
import { useState } from "react";
import { SliceZone } from "@prismicio/react";

// Lib
import { createClient } from "prismicio";
import { components } from "slices";

// Components
import { DefaultLayout, Splash } from "components";

export default function Home({ content }) {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <>
      {showSplash && <Splash text={['Robots, Production & the Workshop.', 'Culture, Vernacular & the Town', 'Education, Printing & the Park']} hide={() => {setShowSplash(false)}} />}
      <main className="space-y-28 mt-4">
        {content?.data?.slices && (
          <SliceZone slices={content?.data?.slices} components={components} context={content} />
        )}
      </main>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

const homeGraphQuery = `{
  home {
    ...homeFields
    slices {
      ...on text_block {
        variation {
          ...on default {
            primary {
              ...primaryFields
            }
          }
        }
      }
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
