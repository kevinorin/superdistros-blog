import React from 'react';
import { GetStaticProps } from 'next';
import Header from '../../components/Header';
import { sanityClient, imageUrl } from '../../sanity';
import { Post } from "../../typings";
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
    post: Post;
}

interface CFormInput {
    _id: string;
    name: string;
    email?: string;
    comment: string;
}

function Post({ post }: Props) {
    const mainImageSrc = imageUrl(post.mainImage);
    const authorImageSrc = imageUrl(post.author?.image);

    // comment form thank you
    const [submitted, setSubmitted] = React.useState(false);
    
    // comment form handler with React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CFormInput>();

    const onSubmit: SubmitHandler<CFormInput> = (data) => {
        fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        })
        .then(() => {
            console.log(data);
            setSubmitted(true);
        })
        .catch((err) => {
            console.log(err);
            setSubmitted(false);
        });
    };


    return (
        <main>
            <Header />

            {mainImageSrc ? (
                <img className="w-full h-72 object-cover" src={mainImageSrc} alt="" />
            ) : (
                <div className="w-full h-72 bg-gray-200" aria-hidden />
            )}
            <article className="max-w-3xl mx-auto p-5">
                <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
                <div className="flex items-center space-x-2">
                    {authorImageSrc ? (
                        <img className="h-14 w-14 rounded-full border-red-500 border-2" src={authorImageSrc} alt="" />
                    ) : (
                        <div className="h-14 w-14 rounded-full border-red-500 border-2 bg-gray-300" aria-hidden />
                    )}
                    <p className="font-extralight text-sm">by <span className="text-red-600">{post.author.name}</span> - published {new Date(post._createdAt).toLocaleString()}</p>
                </div>
                <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>

                <div>
                    <PortableText
                        className=""
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                        content={post.body}
                        // how rich text array of objects is treated/serialized
                        serializers={
                            {
                                h1: (props: any) => (
                                    <h1 className="text-2xl font-bold my-5" {...props} />
                                ),
                                h2: (props: any) => (
                                    <h2 className="text-xl font-bold my-5" {...props} />
                                ),
                                p: (props: any) => (
                                    <p className="text-xl my-10" {...props} />
                                ),
                                li: ({ children }: any) => (
                                    <li className="ml-4 list-disc">{children}</li>
                                ),
                                link: ({ href, children }: any) => (
                                    <a href ={href} className="text-blue-500 hover:underline">
                                        {children}
                                    </a>
                                ),
                            }
                        }
                    />
                </div>
            </article>

            <hr className="max-w-md my-5 mx-auto border border-green-500" />
                        
                
            {submitted ? (  
                <div className="flex flex-col p-10 my-10 bg-green-500 text-white max-w-2xl mx-auto">
                    <h3 className="text-3xl font-bold">Thanks for commenting!</h3>
                    <p className="text-1xl font-bold">Once your comment is approved, it will appear below.</p>
                </div>
                
            ): (
                <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10" onSubmit={handleSubmit(onSubmit)}>
                    <h3 className='text-md text-green-500 font-bold'>Enjoyed the article?</h3>
                    <h4 className='text-3xl font-bold'>Drop a comment below!</h4>
                    <hr className="py-3 mt-2"/>
                    
                    <input {...register("_id")} type="hidden" name="_id" value={post._id} />

                    <label className="block mb-5" htmlFor="">
                        <span className="text-gray-700">Name</ span>
                        <input {...register("name", { required: true })} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-500 outline-none focus:ring" type="text" placeholder="Guest Name" />
                    </label>
                    <label className="block mb-5" htmlFor="">
                        <span className="text-gray-700">Email</span>
                        <input {...register("email", { required: true })} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-500 outline-none focus:ring" type="text" placeholder="guest@superdistros.com" />
                    </label>
                    <label className="block mb-5" htmlFor="">
                        <span className="text-gray-700">Comment</span>
                        <textarea {...register("comment", { required: true })} className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-green-500 outline-none focus:ring" placeholder="Guest Name" rows={8} />
                    </label>
                    <div className="flex flex-col p-5">
                        {errors.name && (
                            <span className="text-green-500 font-bold">- Your name is required!</span>
                        )}
                        {errors.comment && (
                            <span className="text-green-500 font-bold">- Your email is required!</span>
                        )}
                        {errors.email && (
                            <span className="text-green-500 font-bold">- A comment or message is required!</span>
                        )}
                    </div>

                    <input type="submit" className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded cursor-pointer" />
                </form>
            )}

            <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-green-500 shadow space-y-2 '>
                <h3 className='text-3xl font-bold'>Comments</h3>
                <hr className='pb-2'/>

                {(post.comments ?? []).map((comment) => (
                    <div>
                        <p className=''>
                           <span className='text-green-500 font-bold'>{comment.name}: </span>
                           <span className=''>{comment.comment}</span>
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default Post;

// 1. Tell next JS which posts exist using special function called getStaticPaths
export const getStaticPaths = async () => {
 const query = `*[_type == "post"]{
    _id,
    slug {
        current
    }
  }`;

  // fetch paths to next.js with an array where each object has a key called params with path inside of it
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
        slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

// 2. Now we tell Next.js when it trys to prepare the page, how to use the slug/id to fetch that post information with getStaticProps
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query =`*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image
        },
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body
      }`

      const post = await sanityClient.fetch(query, {
        slug: params?.slug,
      });

      if (!post) {
        return {
            notFound: true
        }
      }

      return {
        props: {
            post,
        }
      }
};