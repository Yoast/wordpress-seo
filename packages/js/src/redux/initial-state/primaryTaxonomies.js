import { get, forEach } from "lodash";

const primaryTaxonomies = {};

const primaryTerms = get( window, "wpseoPrimaryCategoryL10n.taxonomies", {} );

forEach( primaryTerms, ( value, key ) => {
	primaryTaxonomies[ key ] = value.primary || -1;
} );

export default primaryTaxonomies;
