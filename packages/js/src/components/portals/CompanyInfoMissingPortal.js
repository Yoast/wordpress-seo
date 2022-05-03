import PropTypes from "prop-types";

import CompanyInfoMissing from "../CompanyInfoMissing";
import Portal from "./Portal";

/**
 * Renders a portal for a company info missing notice in the search appearance settings.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {string} message The message to show in the notice.
 * @param {string} url The url to link to in the notice.
 *
 * @returns {null|wp.Element} The element.
 */
export default function CompanyInfoMissingPortal( { target, message, link } ) {
	return (
		<Portal target={ target }>
			<CompanyInfoMissing message={ message } link={ link } />
		</Portal>
	);
}

CompanyInfoMissingPortal.propTypes = {
	target: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
};
