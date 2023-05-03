import { getCollection } from "astro:content";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

async function getNextEvents(url, type = "json") {
  const allEvents = await getCollection("events");
  let filterEvents = await allEvents
    .filter((event) => {
      if (isNaN(event.data.endDate.getTime())) {
        return event.data.startDate >= new Date();
      } else {
        return event.data.endDate >= new Date();
      }
    })
    .sort((a, b) => a.data.startDate.valueOf() - b.data.startDate.valueOf())
    .slice(0, 3);

  let nextEvents = [];

  filterEvents.forEach((event) => {
    let display_date = `${dayjs(event.data.startDate).format("D [de] MMMM")}`;
    if (!isNaN(event.data.endDate.getTime()) && !dayjs(event.data.startDate).isSame(event.data.endDate, "day")) {
      display_date = display_date + ` - ${dayjs(event.data.endDate).format("D [de] MMMM")}`;
    }
    nextEvents.push({
      name: event.data.name,
      date: display_date,
      description: event.data.description,
      url: event.slug,
    });
  });

  return nextEvents;
}

export { getNextEvents };
