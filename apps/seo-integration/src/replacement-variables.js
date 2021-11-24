import { select } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-store";

const logReplacementVariable = config => ( {
	...config,
	getReplacement: () => {
		const replacement = config.getReplacement();
		console.log( `getReplacement/${ config.name }`, replacement );
		return replacement;
	},
} );

export const createPostReplacementVariables = ( defaults ) => [
	defaults.title,
	defaults.excerpt,
	defaults.date,
	defaults.focusKeyphrase,
	{
		name: "permalink",
		label: "Permalink",
		getReplacement: () => select( SEO_STORE_NAME ).selectPermalink(),
	},
	{
		name: "featuredImage",
		label: "Featured image",
		getReplacement: () => select( SEO_STORE_NAME ).selectFeaturedImage()?.url ?? "",
	},
	{
		name: "synonyms",
		label: "Synonyms",
		getReplacement: () => select( SEO_STORE_NAME ).selectSynonyms(),
	},
	{
		name: "seoTitle",
		label: "SEO title",
		getReplacement: () => select( SEO_STORE_NAME ).selectSeoTitle(),
	},
	{
		name: "metaDescription",
		label: "Meta description",
		getReplacement: () => select( SEO_STORE_NAME ).selectMetaDescription(),
	},
	{
		name: "slug",
		label: "Slug",
		getReplacement: () => select( SEO_STORE_NAME ).selectSlug(),
	},
].map( logReplacementVariable );
