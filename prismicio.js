import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next/pages";
import sm from "./slicemachine.config.json";

export const endpoint = sm.apiEndpoint;
export const repositoryName = prismic.getRepositoryName(endpoint);

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc) {
  switch (doc.type) {
    case "home":
      return "/";
    case "project":
      return `/projects/${doc.uid}`;
    default:
      return null;
  }
}

/*
 * The newsletter bar's copy. It lives on the home document because that is
 * where an editor expects to find it, but the bar itself sits above the footer
 * on every page — so every page has to ask for it, and the layouts render it
 * the way they already render the footer.
 *
 * Narrowed to the two fields the bar reads: without a graphQuery a project page
 * would be pulling the whole home document, slices and all, to put one line of
 * text above its footer.
 */
export async function getNewsletter(client) {
  const home = await client.getSingle("home", {
    graphQuery: `{
      home {
        newsletter_text
        newsletter_label
      }
    }`,
  });

  return {
    text: home?.data?.newsletter_text ?? "",
    label: home?.data?.newsletter_label ?? "",
  };
}

// This factory function allows smooth preview setup
export function createClient(config = {}) {
  const client = prismic.createClient(endpoint, {
    ...config,
  });

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
}
