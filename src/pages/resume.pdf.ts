import { APIRoute } from "astro";
import { getHomepageData } from "~/prismic";

export const GET: APIRoute = async () => {
  const homepage = await getHomepageData();
  const resumeUrl =
    "url" in homepage.introduction.resume
      ? homepage.introduction.resume.url
      : "";
  if (!resumeUrl) {
    return new Response(null, { status: 404 });
  }

  const response = await fetch(resumeUrl);
  return new Response(await response.arrayBuffer(), {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};
