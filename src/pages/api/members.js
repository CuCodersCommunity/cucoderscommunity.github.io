import { getCollection } from "astro:content";

const members = await fetch("https://cucoderscommunity.github.io/members-api/members-data");
const members_data = await members.json();

let data = [];


  for (let [key, member] of Object.entries(members_data)) {
    data.push({
      id: key ,
      updated_at: Date.now(),
      search_value: `${member.username} ${member.name} ${member.headline ? member.headline : ""}`,
      data: {
        title: member.name,
        subtitle: member.headline,
        url: member.username,
        img: member.avatar_url_small,
      },
    });
  }

export async function GET({ params, request }) {
  return new Response(JSON.stringify(data));
}
