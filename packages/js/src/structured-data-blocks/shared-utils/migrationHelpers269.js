import { renderToString } from "@wordpress/element";

/**
 * Converts a rich text children array to an HTML string.
 *
 * @param {Array|string} value The value to convert.
 * @returns {string} The HTML string.
 */
export const childrenToString = ( value ) => {
	if ( ! value ) {
		return "";
	}
	if ( typeof value === "string" ) {
		return value;
	}
	if ( Array.isArray( value ) ) {
		try {
			return renderToString( value );
		} catch ( e ) {
			// Fallback: join string parts.
			return value
				.map( ( item ) => {
					if ( typeof item === "string" ) {
						return item;
					}
					if ( item && item.props ) {
						return renderToString( item );
					}
					return "";
				} )
				.join( "" );
		}
	}
	return "";
};

/**
 * Builds an image object from a node.
 * @param {object} node The image node.
 * @returns {{type: string, key: null, props: {src: string, alt: string, className: string, style: string}}} The image object.
 */
const buildImageObject = ( node ) => {
	const { key, props = {} } = node;
	const { src = "", alt = "", className = "", style = "" } = props;

	return {
		type: "img",
		key,
		props: { src, alt, className, style },
	};
};

/**
 * Extracts image elements from an old array-based text field.
 *
 * @param {Array} textArray The old text array that may contain image elements.
 * @returns {Array} Array of image objects in the new format.
 */
const extractImagesFromTextArray = ( textArray ) => {
	if ( ! Array.isArray( textArray ) ) {
		return [];
	}

	return textArray
		.filter( ( node ) => node && node.type && node.type === "img" )
		.map( buildImageObject );
};


/**
 * Gets the image array for a step, extracting from text if necessary.
 * @param {object[]} imageArray The existing images array.
 * @param {Array|string} content The text content to extract images from if needed.
 * @returns {object[]} The image array.
 */
export const getImageArray = ( imageArray, content ) => {
	if ( Array.isArray( content ) && imageArray.length === 0 ) {
		imageArray = extractImagesFromTextArray( content );
	}
	return imageArray;
};
