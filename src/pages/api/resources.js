import { getCollection } from "astro:content";

const resourcesResponse = await getCollection("resources");
let resourcesList = [];

for (const resources of resourcesResponse) {
  resourcesList.push(resources.data);
}

export async function GET({ params, request }) {
  return new Response(JSON.stringify(resourcesList));
}
