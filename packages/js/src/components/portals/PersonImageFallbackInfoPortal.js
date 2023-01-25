import PropTypes from "prop-types";

import PersonImageFallbackInfoMissing from "../PersonImageFallbackInfoMissing";
import Portal from "./Portal";

/**
 * Renders a portal for a person image missing notice in the search appearance settings.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {string} message The message to show in the notice.
 *
 * @returns {null|wp.Element} The element.
 */
export default function PersonImageFallbackInfoPortal( { target, message } ) {
	return (
		<Portal target={ target }>
			<PersonImageFallbackInfoMissing message={ message } />
		</Portal>
	);
}

PersonImageFallbackInfoPortal.propTypes = {
	target: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
};
