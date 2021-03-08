import PropTypes from "prop-types";

import LocalSEOUpsell from "../LocalSEOUpsell";
import Portal from "./Portal";


/**
 * Renders a portal for a Local SEO upsell in the search appearance settings.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {string} url The url to link to in the notice.
 * @param {string} backgroundUrl The Url for the background image.
 *
 * @returns {null|wp.Element} The element.
 */
export default function LocalSEOUpsellPortal( { target, url, backgroundUrl } ) {
	return (
		<Portal target={ target }>
			<LocalSEOUpsell url={ url } backgroundUrl={ backgroundUrl } />
		</Portal>
	);
}

LocalSEOUpsellPortal.propTypes = {
	target: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	backgroundUrl: PropTypes.string.isRequired,
};
