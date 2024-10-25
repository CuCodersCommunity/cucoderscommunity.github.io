import { getCollection } from "astro:content";

const blogResponse = await getCollection("blog");

const lastDate = getLastUpdate(blogResponse);

function getLastUpdate(array) {
  if (array.length === 0) return null;

  return array.reduce((biggerDate, obj) => {
    const itemDate = new Date(obj.data.pubDate);
    return itemDate > biggerDate ? itemDate : biggerDate;
  }, new Date(array[0].data.pubDate));
}

export async function get({ params, request }) {
  return {
    body: JSON.stringify({ updated_at: lastDate }),
  };
}
