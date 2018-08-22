/* global tinyMCE */

import noop from "lodash/noop";

import tinyMCEHelper from "../wp-seo-tinymce";
import { tinyMCEDecorator } from "../decorator/tinyMCE";

let decorator = null;

/**
 * Gets the marker function.
 *
 * @param {boolean} [showMarkers=true] Whether to return the marker function or not.
 *
 * @returns {Function} The marker function or an empty function.
 */
export default function getMarker( showMarkers = true ) {
	if ( ! showMarkers ) {
		return noop;
	}
	return ( paper, marks ) => {
		if ( tinyMCEHelper.isTinyMCEAvailable( tinyMCEHelper.tmceId ) ) {
			if ( null === decorator ) {
				decorator = tinyMCEDecorator( tinyMCE.get( tinyMCEHelper.tmceId ) );
			}

			decorator( paper, marks );
		}
	};
}
