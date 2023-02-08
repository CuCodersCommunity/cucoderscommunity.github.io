import { getCollection } from "astro:content";

const resourcesResponse = await getCollection("resources");
let resourcesList = [];

for (const resources of resourcesResponse) {
  resourcesList.push(resources.data);
}

export async function get({ params, request }) {
  return {
    body: JSON.stringify(resourcesList),
  };
}
