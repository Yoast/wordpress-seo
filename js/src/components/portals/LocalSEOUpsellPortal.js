import { createPortal } from "@wordpress/element";
import LocalSEOUpsell from "../LocalSEOUpsell";
import PropTypes from "prop-types";

/**
 * Renders a portal for a Local SEO upsell in the search appearance settings.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {string} url The url to link to in the notice.
 * @param {string} backgroundUrl The Url for the background image.
 *
 * @returns {null|ReactElement} The element.
 */
export default function LocalSEOUpsellPortal( { target, url, backgroundUrl } ) {
	const targetElement = document.getElementById( target );

	if ( ! targetElement ) {
		return null;
	}

	return createPortal(
		<LocalSEOUpsell url={ url } backgroundUrl={ backgroundUrl } />,
		targetElement
	);
}

LocalSEOUpsellPortal.propTypes = {
	target: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	backgroundUrl: PropTypes.string.isRequired,
};
