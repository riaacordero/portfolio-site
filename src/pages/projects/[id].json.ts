import type { APIRoute } from "astro";
import { getProject, getProjects } from "~/prismic";

export const GET: APIRoute = async ({ params }) => {
  const project = await getProject(params.id);
  return new Response(JSON.stringify(project));
};

export async function getStaticPaths() {
  const projects = await getProjects();
  return projects.map((p) => ({
    params: { id: p.id },
  }));
}
