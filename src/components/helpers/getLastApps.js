import { getCollection } from "astro:content";

async function getLastApps(url, type = "json") {
  const allApps = await getCollection("apps");
  let filterApps = await allApps
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 5);

  let lastApps = [];

  filterApps.forEach((app) => {
    lastApps.push({
      name: app.data.name,
      description: app.data.description,
      logo: app.data.logo,
      url: app.slug,
    });
  });

  return lastApps;
}

export { getLastApps };
