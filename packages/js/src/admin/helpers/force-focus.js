/**
 * Sets focus on an HTML element.
 *
 * By setting the `tabindex` temporarily.
 *
 * @param {HTMLElement} element The element.
 * @param {Object} [options] The focus options.
 *
 * @returns {void}
 */
const forceFocus = ( element, options ) => {
	if ( ! element ) {
		return;
	}

	const tabIndex = element.getAttribute( "tabindex" );

	element.setAttribute( "tabindex", "0" );
	element.focus( options );

	if ( tabIndex === null ) {
		element.removeAttribute( "tabindex" );
	} else {
		element.setAttribute( "tabindex", tabIndex );
	}
};

export default forceFocus;
