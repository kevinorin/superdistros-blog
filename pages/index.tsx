import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Link from "next/link";
import { sanityClient, imageUrl } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Super Distros Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>
     
      <div className="flex justify-between items-center bg-green-500 border-y border-black py-10 lg:py-0">
          <div className="px-10 space-y-5">
              <h1 className="text-5xl max-w-xl font-serif">This is a React.js & Next.js project with a backend powered by <span className="underline decoration-black decoration-4">Sanity.io</span>. </h1>
              <h2 className="max-w-md">The Sanity CMS uses Sanity Content Lake to store and access content. It runs in the cloud and is fully managed by Sanity. </h2>
          </div>
          
          <img className="hidden md:inline-flex h-32 lg:h-full" src="https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_96102ac6497377cd53da621075fe828e/sanity.png"/>
      </div>

      { /* Posts */ }
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-2 md:p-6">
        {posts.map(post => (
          
            <div className="group overflow-hidden">
              <Link key={post._id} href={`/post/${post.slug.current}`}>
                {imageUrl(post.mainImage) ? (
                  <img className="h-60 w-full rounded-lg cursor-pointer object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out" src={imageUrl(post.mainImage)} alt="" />
                ) : (
                  <div className="h-60 w-full rounded-lg bg-gray-200" aria-hidden />
                )}
              </Link>
              <div className="p-3 bg-white justify-between content-center">
                <div className="flex justify-start content-evenly">
                  <div>
                    {imageUrl(post.author?.image) ? (
                      <img className="h-8 rounded-full" src={imageUrl(post.author.image)} alt="" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-300" aria-hidden />
                    )}
                  </div>
                  <div>
                    <p className=""><span className="p-2 align-middle">{post.author.name}</span></p>
                  </div>
                </div>
                <Link key={post._id} href={`/post/${post.slug.current}`}>
                  <div className="flex cursor-pointer">
                    <p>{post.title}</p>
                  </div>
                </Link>
              </div>
            </div>
        ))}
      </div>

    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    slug,
    description,
    mainImage,
    author-> {
      name,
      image
    }
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
      revalidate: 21600, // initiate ISR to update cache every 6 hours
    },
  }; 
};
