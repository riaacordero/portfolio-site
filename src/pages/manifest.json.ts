import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import favicon from "../assets/logo.png";
import { getSiteInfoData } from "~/prismic";

const faviconPngSizes = [192, 512];

export const GET: APIRoute = async () => {
  const { siteTitle, pageDescription } = await getSiteInfoData();

  const icons = await Promise.all(
    faviconPngSizes.map(async (size) => {
      const image = await getImage({
        src: favicon,
        width: size,
        height: size,
        format: "png",
      });
      return {
        src: image.src,
        type: `image/${image.options.format}`,
        sizes: `${image.options.width}x${image.options.height}`,
      };
    }),
  );

  const manifest = {
    name: siteTitle,
    description: pageDescription,
    start_url: "/",
    display: "standalone",
    id: siteTitle.toLowerCase().replace(/\s/g, "-"),
    icons,
  };

  return new Response(JSON.stringify(manifest));
};
