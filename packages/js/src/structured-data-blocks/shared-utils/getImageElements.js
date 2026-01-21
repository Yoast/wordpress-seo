import parse from "html-react-parser";

/**
 * Gets all image elements from the given content.
 *
 * @param {string} content The content to search for image elements.
 * @returns {Object[]} An array of image elements found in the content.
 */
export const getImageElements = ( content ) => {
	if ( typeof content !== "string" || ! content.includes( "<img" ) ) {
		return [];
	}
	const foundImages = [ ...content.matchAll( /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/ig ) ];
	const imageElements = [];
	foundImages.forEach( ( match ) => {
		const imgTag = match[ 0 ];
		const parsedElements = parse( imgTag );
		imageElements.push( parsedElements );
	} );
	return imageElements;
};

