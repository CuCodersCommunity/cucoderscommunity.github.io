import { getCollection } from "astro:content";
import featuredSlugs from "../../data/featuredApps.json";

async function getFeaturedApps(url, type = "json") {
  const allApps = await getCollection("apps");
  const filterApps = await allApps.filter((app) => featuredSlugs.includes(app.slug));

  let featuredApps = [];

  filterApps.forEach((app) => {
    featuredApps.push({
      name: app.data.name,
      description: app.data.description,
      logo: app.data.logo,
      url: app.slug,
    });
  });

  return featuredApps;
}

export { getFeaturedApps };
