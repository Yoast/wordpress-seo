const parser = new DOMParser();

/**
 * Get the src of the first image src from the contents.
 * @param {Array|string} contents The contents to search for an image.
 * @returns {boolean|string} The image src or false if none is found.
 */
export const getImageSrc = ( contents ) => {
	// Handle legacy array format for backward compatibility.
	if ( Array.isArray( contents ) ) {
		// Find the first image node.
		const image = contents.find( ( node ) => node && node.type === "img" );
		return image ? image.props.src : false;
	}

	// Handle new string format - parse for img tag.
	if ( typeof contents === "string" && contents.includes( "<img" ) ) {
		// Use a DOM parser to extract the src attribute.
		const doc = parser.parseFromString( contents, "text/html" );
		// Only return the first image found.
		const img = doc.querySelector( "img" );
		if ( img && img.src ) {
			return img.src;
		}
	}

	return false;
};
