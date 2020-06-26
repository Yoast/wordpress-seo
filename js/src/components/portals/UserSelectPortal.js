import PropTypes from "prop-types";

import WordPressUserSelectorSearchAppearance from "../WordPressUserSelectorSearchAppearance";
import Portal from "./Portal";

/**
 * Renders a user select portal for the search appearance settings.
 *
 * @param {string} target A target element ID in which to render the portal.
 *
 * @returns {null|wp.Element} The element.
 */
export default function UserSelectPortal( { target } ) {
	return (
		<Portal target={ target }>
			<WordPressUserSelectorSearchAppearance />
		</Portal>
	);
}

UserSelectPortal.propTypes = {
	target: PropTypes.string.isRequired,
};
