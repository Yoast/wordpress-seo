import { renderToString } from "@wordpress/element";

export const convertToHTMLString = ( contents ) => {
	if ( ! Array.isArray( contents ) ) {
		return contents;
	}
	return contents.map( ( item ) => {
		if ( ! item ) {
			return "";
		}

		if ( typeof item === "string" ) {
			return item;
		}
		return renderToString( item );
	} ).join( "" );
};
