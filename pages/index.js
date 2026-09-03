// Modules
import { useState } from "react";
import { SliceZone } from "@prismicio/react";

// Lib
import { createClient, getNewsletter } from "prismicio";
import { components } from "slices";

// Components
import { DefaultLayout, Splash } from "components";

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
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return (
    <DefaultLayout newsletter={page.props.newsletter}>{page}</DefaultLayout>
  );
};

/*
 * The fields the page actually renders. `...itemsFields` follows each slice's
 * model, so a field retired from a model leaves this query on its own.
 *
 * A project slice's linked document is named field by field rather than spread:
 * the card falls back to the project's own title when the editor hasn't written
 * a caption, and that title is the only thing it reads off the link — the uid
 * its href is built from comes back with the link itself, without the
 * document's data. `...projectFields` was carrying every linked project's whole
 * document, slices included, into the home page's props to render one line of
 * type apiece.
 */
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
      ...on image_multiple {
        variation {
          ...on default {
            items {
              ...itemsFields
            }
          }
          ...on carousel {
            primary {
              ...primaryFields
            }
            items {
              ...itemsFields
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
                  title
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
    props: { content, newsletter: await getNewsletter(client) },
  };
}
