import { get, reduce } from "lodash";

const primaryTerms = get( window, "wpseoPrimaryCategoryL10n.taxonomies", {} );

export const primaryTaxonomies = reduce( primaryTerms, ( acc, value ) => {
	acc[ value.name ] = value.primary || -1;
	return acc;
}, {} );

