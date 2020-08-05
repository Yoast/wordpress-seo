import PropTypes from "prop-types";

import SocialMetadata from "../social/SocialMetadata";
import Portal from "./Portal";

/**
 * Renders a portal for the social metadata settings in an editor.
 *
 * @param {string} target A target element ID in which to render the portal.
 *
 * @returns {wp.Element} The social metadata collapsibles.
 */
export default function SocialMetadataPortal( { target } ) {
	const isFacebookEnabled = window.wpseoScriptData.metabox.showSocial.facebook;
	const isTwitterEnabled = window.wpseoScriptData.metabox.showSocial.twitter;
	return (
		<Portal target={ target }>
			<SocialMetadata
				isFacebookEnabled={ isFacebookEnabled }
				isTwitterEnabled={ isTwitterEnabled }
			/>
		</Portal>
	);
}

SocialMetadataPortal.propTypes = {
	target: PropTypes.string.isRequired,
};
