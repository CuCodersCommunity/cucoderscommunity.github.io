import { getCollection } from "astro:content";
import categorias from "../../data/resourcesCategories.json";

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
