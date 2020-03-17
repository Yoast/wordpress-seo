import { createPortal } from "@wordpress/element";

import WordPressUserSelectorSearchAppearance from "../WordPressUserSelectorSearchAppearance";
import PropTypes from "prop-types";

/**
 * Renders a user select portal for the search appearance settings.
 *
 * @param {string} target A target element ID in which to render the portal.
 *
 * @returns {null|ReactElement} The element.
 */
export default function UserSelectPortal( { target } ) {
	const targetElement = document.getElementById( target );

	if ( ! targetElement ) {
		return null;
	}

	return createPortal( <WordPressUserSelectorSearchAppearance />, targetElement );
}

UserSelectPortal.propTypes = {
	target: PropTypes.string.isRequired,
};
