/**
 * Creates a custom event with optional additional data.
 *
 * @param {string} name The name of the event.
 * @param {object} data The data of the event.
 *
 * @returns {void}
 */
export default function createCustomEvent( name, data = {} ) {
	return new CustomEvent( name, { detail: data } );
}
