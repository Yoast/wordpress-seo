import PropTypes from "prop-types";

import SocialMetadata from "../../containers/SocialMetadata";
import Portal from "./Portal";

/**
 * Renders a portal for the social metadata settings in an editor.
 *
 * @param {string} target A target element ID in which to render the portal.
 *
 * @returns {wp.Element} The social metadata collapsibles.
 */
export default function SocialMetadataPortal( { target } ) {
	return (
		<Portal target={ target }>
			<SocialMetadata />
		</Portal>
	);
}

SocialMetadataPortal.propTypes = {
	target: PropTypes.string.isRequired,
};
