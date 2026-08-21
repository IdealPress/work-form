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
            <Link href={`/projects/${project.uid}`} className={styles.link}>
              <span className={styles.year}>{year(project?.data?.date)}</span>
              <span className={styles.title}>{project?.data?.title}</span>
              <span className={styles.type}>{type(project?.tags)}</span>
              <span className={styles.client}>
                {client(project?.data?.client)}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
