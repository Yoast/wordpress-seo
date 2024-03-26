import { get, pickBy, forEach } from "lodash";

const primaryTaxonomies = {};

const metadata = get( window, "wpseoScriptData.metabox.metadata", {} );
const primaryTerms = pickBy( metadata, ( value, key ) => key.startsWith( "primary_" ) && value );
forEach( primaryTerms, ( value, key ) => {
	const taxonomy = key.replace( "primary_", "" );
	primaryTaxonomies[ taxonomy ] = value;
} );

export default primaryTaxonomies;
