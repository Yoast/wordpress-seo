import { createPortal } from "@wordpress/element";

import MetaboxSlot from "../slots/MetaboxSlot";
import MetaboxFill from "../../containers/MetaboxFill";
import { Fragment } from "react";
import PropTypes from "prop-types";

/**
 * Renders the metabox portal.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {Object} store  The Redux store.
 * @param {Object} theme  The theme to use.
 *
 * @returns {null|ReactElement} The element.
 */
export default function MetaboxPortal( { target, store, theme } ) {
	const metaboxElement = document.getElementById( target );

	if ( ! metaboxElement ) {
		return null;
	}

	return createPortal(
		<Fragment>
			<MetaboxSlot />
			<MetaboxFill store={ store } theme={ theme } />
		</Fragment>,
		metaboxElement
	);
}

MetaboxPortal.propTypes = {
	target: PropTypes.string.isRequired,
	store: PropTypes.object,
	theme: PropTypes.object,
};
