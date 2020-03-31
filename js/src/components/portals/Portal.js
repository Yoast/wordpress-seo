import { createPortal } from "@wordpress/element";
import PropTypes from "prop-types";

/**
 * Renders a portal.
 *
 * @param {string|object} target A target element ID in which to render the portal.
 * @param {React.Element} children The child components.
 *
 * @returns {null|ReactElement} The element.
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

Portal.propTypes = {
	target: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.object,
	] ).isRequired,
	children: PropTypes.node.isRequired,
};
