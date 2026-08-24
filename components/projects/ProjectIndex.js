import Link from "next/link";
import * as prismic from "@prismicio/client";

import { Reveal } from "components";

import styles from "./ProjectIndex.module.css";

function year(date) {
  return date ? new Date(date).getFullYear() : "";
}

// Tags are stored lowercase in Prismic; the index reads better title-cased.
function type(tags = []) {
  return tags
    .map((tag) => tag.replace(/\b\w/g, (letter) => letter.toUpperCase()))
    .join(", ");
}

// Some clients are entered over two lines; a row is one line, so join them up.
function client(field) {
  return prismic.asText(field, { separator: ", " })?.replace(/\s*\n\s*/g, ", ");
}

// The four cells of a row, written once so the linked and the plain row can't
// drift apart — they are the same record, and only differ in whether there is
// anywhere to go.
function Cells({ project }) {
  return (
    <>
      <span className={styles.year}>{year(project?.data?.date)}</span>
      <span className={styles.title}>{project?.data?.title}</span>
      <span className={styles.type}>{type(project?.tags)}</span>
      <span className={styles.client}>{client(project?.data?.client)}</span>
    </>
  );
}

export default function ProjectIndex({ projects = [] }) {
  return (
    <div className={styles.base}>
      <div className={styles.head} aria-hidden="true">
        <p className={styles.year}>Year</p>
        <p>Project</p>
        <p className={styles.type}>Type</p>
        <p className={styles.client}>Client</p>
      </div>
      <ul>
        {projects.map((project) => (
          <Reveal as="li" key={project.id} className={styles.row}>
            {/*
             * Some work belongs in the record without having a page worth
             * visiting — a job with nothing to show, or one whose page isn't
             * ready. Ticking "Index only" leaves it here as a plain row: no
             * card in the grid, and nothing to click, rather than a link into
             * an empty page.
             */}
            {project?.data?.index_only ? (
              <div className={styles.plain}>
                <Cells project={project} />
              </div>
            ) : (
              <Link href={`/projects/${project.uid}`} className={styles.link}>
                <Cells project={project} />
              </Link>
            )}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
