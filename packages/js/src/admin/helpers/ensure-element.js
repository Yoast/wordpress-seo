/**
 * Gets the element.
 * Creates and appends it to the body if not found.
 * @param {string} id The ID.
 * @returns {HTMLElement} The element.
 */
const ensureElement = ( id ) => {
	let element = document.getElementById( id );
	if ( ! element ) {
		element = document.createElement( "div" );
		element.id = id;
		document.body.appendChild( element );
	}
	return element;
};

export default ensureElement;
