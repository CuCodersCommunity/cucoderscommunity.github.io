import { getCollection } from "astro:content";

const blogResponse = await getCollection("blog");
let data = blogResponse.map((blog, index) => ({
  id: index,
  updated_at: blog.data.pubDate,
  search_value: blog.data.title + " " + blog.data.description,
  data: {
    title: blog.data.title,
    url: blog.slug,
  },
}));

export async function get({ params, request }) {
  return {
    body: JSON.stringify(data),
  };
}
