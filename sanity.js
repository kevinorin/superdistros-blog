import { ImageUrlBuilder, createCurrentUserHook,createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url'

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-10-21",
    useCdn: process.env.NODE_ENV === "production",
};

// Calls from Sanity backend Client
export const sanityClient = createClient(config);

export const urlFor = (source) => imageUrlBuilder(config).image(source);

export function imageUrl(source) {
    if (!source) return undefined;
    return imageUrlBuilder(config).image(source).url();
}