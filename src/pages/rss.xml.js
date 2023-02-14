import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function get(context) {
    const blog = await getCollection('blog');
    return rss({
      title: 'CuCoders | La comunidad de los programadores cubanos',
      description: 'Cucoders es una plataforma para potenciar el desarrollo de software en Cuba y apoyar a los desarrolladores y emprendedores en su carrera profesional. Descubre recursos, aplicaciones, artículos, perfiles de programadores y ofertas laborales. Cucoders es el lugar perfecto para encontrar oportunidades y mantenerse actualizado en el mundo de la programación.',
      site: context.site,
      items: blog.map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        image: post.data.image,
        link: `/publicaciones/${post.slug}/`,
      })),
    });
  }
