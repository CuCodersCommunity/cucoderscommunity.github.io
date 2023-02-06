import { z, defineCollection } from "astro:content";

const blogSchema = z.object({
    title: z.string(),
    username: z.string(),
    pubDate: z.string().transform(str => new Date(str)),
    description: z.string().optional(),
    image: z.string().optional(),
    categories: z.array(z.string()),
});

const appsSchema = z.object({
    name: z.string(),
    id: z.string(),
    description: z.string().optional(),
    logo: z.string(),
    website: z.string(),
    email: z.string().optional(),
    is_open_source: z.boolean(),
    repository_url: z.string().optional(),
    twitter_username: z.string().optional(),
    telegram_username: z.string().optional(),
    dev_username: z.string(),
    pubDate: z.string().transform(str => new Date(str)),
    categories: z.array(z.string()),
    platforms: z.array(z.string())
});

export type BlogSchema = z.infer<typeof blogSchema>;
export type AppSchema = z.infer<typeof appsSchema>;

const blogCollection = defineCollection({ schema: blogSchema });
const appsCollection = defineCollection({ schema: appsSchema });

export const collections = {
    'blog': blogCollection,
    'apps': appsCollection
}