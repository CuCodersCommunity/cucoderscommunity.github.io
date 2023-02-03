import { z, defineCollection } from "astro:content";

const blogSchema = z.object({
    title: z.string(),
    username: z.string(),
    pubDate: z.string().transform(str => new Date(str)),
    description: z.string().optional(),
    image: z.string().optional(),
    categories: z.array(z.string()),
});

export type BlogSchema = z.infer<typeof blogSchema>;

const blogCollection = defineCollection({ schema: blogSchema });

export const collections = {
    'blog': blogCollection,
}