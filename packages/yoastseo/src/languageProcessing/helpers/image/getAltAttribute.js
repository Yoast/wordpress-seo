import stripSpaces from "../sanitize/stripSpaces.js";

/**
 * Checks for an alt attribute in the image and returns its content.
 *
 * @param {Node} imageNode Text string to match the alt attribute.
 * @returns {String} The contents of the alt attribute, empty if none is set.
 */
export default function( imageNode ) {
	let alt = "";

	if ( imageNode.name === "img" ) {
		alt = stripSpaces( imageNode.attributes.alt || "" );

		alt = alt.replace( /&quot;/g, "\"" );
		alt = alt.replace( /&#039;/g, "'" );
	}

	return alt;
}
