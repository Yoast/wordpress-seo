import { select } from "@wordpress/data";
import { addFilter } from "@wordpress/hooks";
import createReplacementVariables from "@yoast/replacement-variables";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { reduce } from "lodash";

const applyReplacementVariables = ( paper ) => {
	const replacementVariables = createReplacementVariables( [
		{
			name: "title",
			label: "Title",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectTitle();
				console.log( "getReplacement/title", replacement );
				return replacement;
			},
		},
	] );

	return reduce(
		paper,
		( acc, value, key ) => ( {
			...acc,
			[ key ]: replacementVariables.apply( value ),
		} ),
		{},
	);
};

const registerReplacementVariables = () => {
	// Applying the replacement variables with a priority of 10, so that other functions can go before (< 10) or after (> 10) the replaced variables.
	addFilter(
		"yoast.seoStore.analysis.preparePaper",
		"yoast/seo-integration-app/applyReplacementVariables",
		applyReplacementVariables,
		10,
	);
};

export default registerReplacementVariables;
