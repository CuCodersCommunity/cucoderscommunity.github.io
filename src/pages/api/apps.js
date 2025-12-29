import { getCollection } from "astro:content";

const appsResponse = await getCollection("apps");
let data = appsResponse.map((apps, index) => ({
  id: index,
  updated_at: apps.data.pubDate,
  search_value: apps.data.name + " " + apps.data.description,
  data: {
    name: apps.data.name,
    url: apps.slug,
    subtitle: apps.data.description,
    img: apps.data.logo
  },
}));

export async function GET({ params, request }) {
  return new Response(JSON.stringify(data));
}
