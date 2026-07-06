import type { MetadataRoute } from "next";

const SITE = "https://usa-adventures.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/map", "/plans", "/trips", "/memories"];
  const now = new Date();
  return routes.map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
