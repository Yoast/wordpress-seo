import Portal from "./Portal";
import PropTypes from "prop-types";

/**
 * Renders a portal for the readability results in the editor.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {wp.Element} children The child components.
 *
 * @returns {null|wp.Element} The element.
 */
export default function ReadabilityResultsPortal( { target, children } ) {
	return (
		<Portal target={ target }>
			{ children }
		</Portal>
	);
}

ReadabilityResultsPortal.propTypes = {
	target: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};
