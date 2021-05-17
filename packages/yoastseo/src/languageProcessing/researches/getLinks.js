/** @module analyses/getLinkStatistics */

import getAnchors from "../helpers/link/getAnchorsFromText.js";

import { map } from "lodash-es";
import url from "../helpers/url/url.js";

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} paper The paper to get the text from.
 * @returns {Array} An array with the anchors
 */
export default function( paper ) {
	const anchors = getAnchors( paper.getText() );

	return map( anchors, url.getFromAnchorTag );
}
