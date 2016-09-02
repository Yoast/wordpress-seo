/**
 * @summary Converts HTML entities to the actual symbols.
 *
 * @param htmlText The HTML text.
 * @returns {string} The string with converted HTML entities.
 */
let decodeHTML = ( htmlText ) => {
	var txt = document.createElement( "textarea" );
	txt.innerHTML = htmlText;
	return txt.value;
};

export default decodeHTML;