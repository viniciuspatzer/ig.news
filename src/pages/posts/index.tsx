import { GetStaticProps } from 'next';
import Head from 'next/head'
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom'

import styles from './styles.module.scss'

type Post = {
  slug: string;
  title: string;
  preview: string;
  updatedAt: string;
}

interface PostProps {
  posts: Post[]
}

export default function Posts({ posts }: PostProps) {
  return (
    <>
    <Head>
      <title>Posts | ig.news</title>
    </Head>

    <main className={styles.container}>
      <div className={styles.posts}>

        { posts.map(post => (
          <a key={post.slug} href="#">
            <time>{post.updatedAt}</time>
            <strong>{post.title}</strong>
            <p>{post.preview}</p>
          </a>
        ))}

      </div>
    </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['title', 'content'],
    pageSize: 100
  });

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      preview: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  });

  return {
    props: {
      posts
    }
  }
}