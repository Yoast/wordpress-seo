import forEach from "lodash/forEach";
import { updateReplacementVariable } from "../redux/actions/snippetEditor";

export const nonReplaceVars = [ "slug", "content" ];

/**
 * Fills the redux store with the newly acquired data.
 *
 * @returns {void}
 */
export default function fillReplacementValues( data, store ) {
	forEach( data, ( value, name ) => {
		if ( nonReplaceVars.includes( name ) ) {
			return;
		}
		store.dispatch( updateReplacementVariable( name, value ) );
	} );
}