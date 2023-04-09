/**
 * Gets the element by ID.
 * Creates and appends it to the body if not found.
 * @param {string} id The ID.
 * @param {string} [tag] Creates this tag if not found. Defaults to div.
 * @returns {HTMLElement} The element.
 */
const ensureElement = ( id, tag = "div" ) => {
	let element = document.getElementById( id );
	if ( ! element ) {
		element = document.createElement( tag );
		element.id = id;
		document.body.appendChild( element );
	}
	return element;
};

export default ensureElement;
