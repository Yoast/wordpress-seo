const parser = new DOMParser();
export const getImage = ( content ) => {
	// Use a DOM parser to extract the src attribute
	const doc = parser.parseFromString( content, "text/html" );
	return doc.querySelector( "img" );
};
