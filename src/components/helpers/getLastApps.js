import { getCollection } from "astro:content";
import dayjs from "dayjs";
import "dayjs/locale/es";

async function getLastApps(url, type = "json") {
  const allApps = await getCollection("apps");
  let filterApps = await allApps
    .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf())
    .slice(0, 3);

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
