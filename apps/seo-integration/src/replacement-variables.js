import { select } from "@wordpress/data";
import { addFilter } from "@wordpress/hooks";
import createReplacementVariables from "@yoast/replacement-variables";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { reduce } from "lodash";

const registerReplacementVariables = () => {
	const { variables, apply } = createReplacementVariables( [
		{
			name: "title",
			label: "Title",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectTitle();
				console.log( "getReplacement/title", replacement );
				return replacement;
			},
		},
		{
			name: "permalink",
			label: "Permalink",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectPermalink();
				console.log( "getReplacement/permalink", replacement );
				return replacement;
			},
		},
		{
			name: "excerpt",
			label: "Excerpt",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectExcerpt();
				console.log( "getReplacement/excerpt", replacement );
				return replacement;
			},
		},
		{
			name: "date",
			label: "Date",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectDate();
				console.log( "getReplacement/date", replacement );
				return replacement;
			},
		},
		{
			name: "featuredImage",
			label: "Featured image",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectFeaturedImage()?.url ?? "";
				console.log( "getReplacement/featuredImage", replacement );
				return replacement;
			},
		},
		{
			name: "keyphrase",
			label: "Keyphrase",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectKeyphrase();
				console.log( "getReplacement/keyphrase", replacement );
				return replacement;
			},
		},
		{
			name: "synonyms",
			label: "Synonyms",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectSynonyms();
				console.log( "getReplacement/synonyms", replacement );
				return replacement;
			},
		},
		{
			name: "seoTitle",
			label: "SEO title",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectSeoTitle();
				console.log( "getReplacement/seoTitle", replacement );
				return replacement;
			},
		},
		{
			name: "metaDescription",
			label: "Meta description",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectSeoDescription();
				console.log( "getReplacement/metaDescription", replacement );
				return replacement;
			},
		},
		{
			name: "slug",
			label: "Slug",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectSlug();
				console.log( "getReplacement/slug", replacement );
				return replacement;
			},
		},
	] );
	console.log("you can try the following replacement variables:", variables.map( variable => variable.name ) );

	const applyReplacementVariables = ( paper ) => {
		return reduce(
			paper,
			( acc, value, key ) => ( {
				...acc,
				[ key ]: apply( value ),
			} ),
			{},
		);
	};

	// Applying the replacement variables with a priority of 10, so that other functions can go before (< 10) or after (> 10) the replaced variables.
	addFilter(
		"yoast.seoStore.analysis.preparePaper",
		"yoast/seo-integration-app/applyReplacementVariables",
		applyReplacementVariables,
		10,
	);
};

export default registerReplacementVariables;
