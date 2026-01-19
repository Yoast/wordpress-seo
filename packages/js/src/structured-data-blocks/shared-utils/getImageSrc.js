const parser = new DOMParser();

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
 * Extracts image src from string format.
 * @param {string} contents The string to parse for an image.
 * @returns {boolean|string} The image src or false if none is found.
 */
const getImageSrcFromString = ( contents ) => {
	if ( ! contents.includes( "<img" ) ) {
		return false;
	}
	const doc = parser.parseFromString( contents, "text/html" );
	return doc.querySelector( "img" )?.src || false;
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
		return getImageSrcFromString( contents );
	}

	return false;
};
