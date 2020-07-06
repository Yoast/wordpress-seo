import PropTypes from "prop-types";

import MetaboxSlot from "../slots/MetaboxSlot";
import MetaboxFill from "../../containers/MetaboxFill";
import Portal from "./Portal";

/**
 * Renders the metabox portal.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {Object} store  The Redux store.
 * @param {Object} theme  The theme to use.
 *
 * @returns {null|wp.Element} The element.
 */
export default function MetaboxPortal( { target, store, theme } ) {
	return (
		<Portal target={ target }>
			<MetaboxSlot />
			<MetaboxFill store={ store } theme={ theme } />
		</Portal>
	);
}

MetaboxPortal.propTypes = {
	target: PropTypes.string.isRequired,
	store: PropTypes.object,
	theme: PropTypes.object,
};
