import { select } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-integration";

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
	defaults.excerpt_only,
	defaults.date,
	defaults.focus_keyphrase,
	{
		name: "permalink",
		label: "Permalink",
		getReplacement: () => select( SEO_STORE_NAME ).selectPermalink(),
		isVisible: false,
	},
	{
		name: "featured_image",
		label: "Featured image",
		getReplacement: () => select( SEO_STORE_NAME ).selectFeaturedImage()?.url ?? "",
		isVisible: false,
	},
	{
		name: "synonyms",
		label: "Synonyms",
		getReplacement: () => select( SEO_STORE_NAME ).selectSynonyms(),
	},
	defaults.content,
].map( logReplacementVariable );
