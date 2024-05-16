import { get, reduce } from "lodash";

const primaryTerms = get( window, "wpseoPrimaryCategoryL10n.taxonomies", {} );

export const primaryTaxonomies = reduce( primaryTerms, ( acc, value, key ) => {
	acc[ key ] = value.primary || -1;
	return acc;
}, {} );

