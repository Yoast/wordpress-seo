import { createPortal } from "@wordpress/element";

/**
 * Renders a portal.
 *
 * @param {Object} props Component props.
 * @param {(string|Object)} props.target A target element ID in which to render the portal.
 * @param {wp.Element} props.children The child components.
 *
 * @returns {null|wp.Element} The element.
 */
export default function Portal( { target, children } ) {
	let targetElement = target;

	if ( typeof target === "string" ) {
		targetElement = document.getElementById( target );
	}

	if ( ! targetElement ) {
		return null;
	}

	return createPortal(
		children,
		targetElement
	);
}
