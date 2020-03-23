import { createPortal } from "@wordpress/element";
import PropTypes from "prop-types";

/**
 * Renders a portal.
 *
 * @param {string|object} target A target element ID in which to render the portal.
 * @param {object[]} children The child components.
 *
 * @returns {null|ReactElement} The element.
 */
export default function Portal( { target, children } ) {
	const targetElement = target;

	if ( typeof target === 'string' ) {
		targetElement = document.getElementById( target );
	}

	if ( ! targetElement ) {
		return null;
	}

	return createPortal(
		{ children },
		targetElement
	);
}

Portal.propTypes = {
	target: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.object,
	] ).isRequired,
	children: PropTypes.arrayOf( PropTypes.element ).isRequired,
};
