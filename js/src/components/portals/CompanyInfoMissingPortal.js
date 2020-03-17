import { createPortal } from "@wordpress/element";
import CompanyInfoMissing from "../CompanyInfoMissing";
import PropTypes from "prop-types";

/**
 * Renders a portal for a company info missing notice in the search appearance settings.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {string} message The message to show in the notice.
 * @param {string} url The url to link to in the notice.
 *
 * @returns {null|ReactElement} The element.
 */
export default function CompanyInfoMissingPortal( { target, message, link } ) {
	const targetElement = document.getElementById( target );

	if ( ! targetElement ) {
		return null;
	}

	return createPortal(
		<CompanyInfoMissing message={ message } link={ link } />,
		targetElement
	);
}

CompanyInfoMissingPortal.propTypes = {
	target: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
};
