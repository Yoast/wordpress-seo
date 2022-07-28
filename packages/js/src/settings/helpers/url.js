import { forEach } from "lodash";

/**
 * Combines a link with params.
 * @param {string} link The link.
 * @param {Object} params The search params.
 * @returns {string} The link with params.
 */
export const createLink = ( link, params = {} ) => {
	try {
		const url = new URL( link );
		forEach( params, ( value, name ) => url.searchParams.append( name, value ) );
		return url.toString();
	} catch ( e ) {
		return link;
	}
};
