import { select } from "@wordpress/data";
import { replacementVariableConfigurations, SEO_STORE_NAME } from "@yoast/seo-integration";

const logReplacementVariable = config => ( {
	...config,
	getReplacement: () => {
		const replacement = config.getReplacement();
		console.log( `getReplacement/${ config.name }`, replacement );
		return replacement;
	},
} );

export const createPostReplacementVariables = () => [
	replacementVariableConfigurations.title,
	replacementVariableConfigurations.excerpt,
	replacementVariableConfigurations.excerptOnly,
	replacementVariableConfigurations.date,
	replacementVariableConfigurations.focusKeyphrase,
	{ ...replacementVariableConfigurations.permalink, isVisible: false },
	{
		name: "featured_image",
		getLabel: () => "Featured image",
		getReplacement: () => select( SEO_STORE_NAME ).selectFeaturedImage()?.url ?? "",
		isVisible: false,
	},
	{
		name: "synonyms",
		getLabel: () => "Synonyms",
		getReplacement: () => select( SEO_STORE_NAME ).selectKeyphraseSynonyms(),
	},
	replacementVariableConfigurations.content,
].map( logReplacementVariable );
