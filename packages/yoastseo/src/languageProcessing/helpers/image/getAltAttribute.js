import stripSpaces from "../sanitize/stripSpaces.js";
import { Node } from "../../../parse/structure";
import { hashedHtmlEntities } from "../../../helpers/htmlEntities";

// The HTML entities that the tree builder protects as "#nbsp;", "#quot;" and so on (see `build`).
const HASHED_HTML_ENTITY = new RegExp( [ ...hashedHtmlEntities.keys() ].join( "|" ), "gi" );

/**
 * Checks for an alt attribute in the image and returns its content, with the surrounding whitespace stripped.
 *
 * The tree builder changes entities such as "&nbsp;" into "#nbsp;" in the whole text, attributes included.
 * For an image from the tree, they are turned back into their characters, so the alt text reads as it renders.
 * A provided image (a plain `img` pseudo-node, see `getImagesInScope`) never went through the tree builder,
 * so a "#nbsp;" in its alt text is real text and is kept.
 *
 * @param {Node|Object} imageNode The image node to get the alt attribute from.
 *
 * @returns {String} The contents of the alt attribute, empty if none is set.
 */
export default function( imageNode ) {
	if ( imageNode.name !== "img" ) {
		return "";
	}

	const alt = imageNode.attributes.alt || "";

	if ( imageNode instanceof Node ) {
		return stripSpaces( alt.replace( HASHED_HTML_ENTITY, ( entity ) => hashedHtmlEntities.get( entity.toLowerCase() ) ) );
	}

	return stripSpaces( alt ).replace( /&quot;/g, "\"" ).replace( /&#039;/g, "'" );
}
