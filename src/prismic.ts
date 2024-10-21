import { createClient, asText } from "@prismicio/client";
import fetch from "node-fetch";
import { PRISMIC_REPO_NAME } from "astro:env/server";

export const client = createClient(PRISMIC_REPO_NAME, { fetch });

export async function getHomepageData() {
  const { data } = await client.getSingle("homepage");
  const slices = data.body.filter((s) => "slice_type" in s);

  return {
    introduction: slices.find((s) => s.slice_type === "introduction").primary,
    technologies: slices.find((s) => s.slice_type === "technologies").items,
    job_background: slices.find((s) => s.slice_type === "job_background").items,
    educational_background: slices.find(
      (s) => s.slice_type === "educational_background",
    ).items,
  };
}

export async function getSiteInfoData() {
  const homepage = await getHomepageData();
  const siteTitle = homepage.introduction.name;
  const pageTitle = `${siteTitle} - ${homepage.introduction.short_description}`;
  const pageDescription = asText(homepage.introduction.description);
  const websiteUrl = homepage.introduction.current_website_url;

  return {
    homepage,
    siteTitle,
    pageTitle,
    pageDescription,
    websiteUrl,
  };
}

export async function getProjects() {
  const projects = await client.getByType("projects", {
    orderings: [{ field: "document.first_publication_date" }],
  });
  return projects.results;
}

export async function getProjectTags(...ids: string[]) {
  if (ids.length === 0) {
    return [];
  }
  const found = await client.getByIDs(ids);
  return found.results.filter((r) => r.type === "project_tag");
}

export async function getProject(id: string) {
  const project = await client.getByID(id);
  if (project.type !== "projects") {
    return null;
  }
  return project;
}
