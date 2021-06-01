/**
 * @summary Converts HTML entities to the actual symbols.
 *
 * Source: http://stackoverflow.com/questions/3700326/decode-amp-back-to-in-javascript
 *
 * @param {string} htmlText The HTML text.
 * @returns {string} The string with converted HTML entities.
 */
const decodeHTML = ( htmlText ) => {
	var txt = document.createElement( "textarea" );
	txt.innerHTML = htmlText;
	return txt.value;
};

export default decodeHTML;
