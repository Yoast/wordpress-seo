import { getImageElements } from "./getImageElements";

/**
 * Extracts image src from array format.
 * @param {Array} contents The array to search for an image.
 * @returns {boolean|string} The image src or false if none is found.
 */
const getImageSrcFromArray = ( contents ) => {
	const image = contents.find( ( node ) => node?.type === "img" );
	return image?.props?.src || false;
};

/**
 * Gets the src of the first image src from the contents.
 * @param {Array|string} contents The contents to search for an image.
 * @returns {boolean|string} The image src or false if none is found.
 */
export const getImageSrc = ( contents ) => {
	if ( Array.isArray( contents ) ) {
		return getImageSrcFromArray( contents );
	}
	if ( typeof contents === "string" ) {
		const images = getImageElements( contents );
		if ( images.length === 0 ) {
			return false;
		}
		return images[ 0 ].props?.src || false;
	}

	return false;
};
