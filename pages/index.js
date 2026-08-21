// Modules
import { useState } from "react";
import { SliceZone } from "@prismicio/react";

// Lib
import { createClient } from "prismicio";
import { components } from "slices";

// Components
import { DefaultLayout, NewsletterBar, Splash } from "components";

export default function Home({ content }) {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <>
      {showSplash && (
        <Splash
          text={[
            "Robots, Production & the Workshop.",
            "Culture, Vernacular & the Town",
            "Education, Printing & the Park",
          ]}
          hide={() => {
            setShowSplash(false);
          }}
        />
      )}
      <main className="slice-stack mt-4">
        {content?.data?.slices && (
          <SliceZone
            slices={content?.data?.slices}
            components={components}
            context={content}
          />
        )}
      </main>
      <NewsletterBar content={content} />
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
      ...on video_block {
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
    graphQuery: homeGraphQuery,
  });
  return {
    props: { content },
  };
}
