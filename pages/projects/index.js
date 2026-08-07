import { useMemo } from "react";

import {
  DefaultLayout,
  ProjectFilters,
  ProjectGrid,
  ProjectIndex,
  DEFAULT_CATEGORY,
  useProjectView,
} from "components";
import { createClient } from "prismicio";

export default function Projects({ content, categories }) {
  const { view, category } = useProjectView(categories);

  const projects = useMemo(
    () =>
      category === DEFAULT_CATEGORY
        ? content
        : content.filter((project) => project?.tags?.includes(category)),
    [content, category],
  );

  return (
    <>
      <main className="mx-6 mt-4">
        {view === "index" ? (
          <ProjectIndex projects={projects} />
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </main>
    </>
  );
}

// The filters ride in the nav's lede slot, so they fade and collapse on scroll
// the way the home page strapline does.
Projects.getLayout = function getLayout(page) {
  return (
    <DefaultLayout lede={<ProjectFilters categories={page.props.categories} />}>
      {page}
    </DefaultLayout>
  );
};

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData });
  const content = await client.getAllByType("project", {
    orderings: { field: "my.project.date", direction: "desc" },
  });

  // Categories come from the tags actually in use, so adding a tag in Prismic
  // is all it takes for a new filter to appear here.
  const categories = [
    ...new Set(content.flatMap((project) => project.tags ?? [])),
  ].sort();

  return {
    props: { content, categories },
  };
}
