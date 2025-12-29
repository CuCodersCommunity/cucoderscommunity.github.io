import { getCollection } from "astro:content";

const appsResponse = await getCollection("apps");

const lastDate = getLastUpdate(appsResponse);

function getLastUpdate(array) {
  if (array.length === 0) return null;

  return array.reduce((biggerDate, obj) => {
    const itemDate = new Date(obj.data.pubDate);
    return itemDate > biggerDate ? itemDate : biggerDate;
  }, new Date(array[0].data.pubDate));
}

export async function GET({ params, request }) {
  return new Response(JSON.stringify({ updated_at: lastDate }));
}
