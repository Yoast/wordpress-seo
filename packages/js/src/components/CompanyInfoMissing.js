/* External dependencies */
import { sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { Alert } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

const OutboundLink = makeOutboundLink();

/**
 * Shows an alert with a message and a link.
 *
 * @constructor
 *
 * @param {Object} props The properties to use.
 *
 * @returns {wp.Element} The Alert component.
 */
const CompanyInfoMissing = ( props ) => {
	return <Alert type={ props.type }>
		{ [
			interpolateComponents( {
				mixedString: sprintf( props.message, "{{link}}", "{{/link}}" ),
				components: { link: <OutboundLink href={ props.link } /> },
			} ),
		] }
	</Alert>;
};

CompanyInfoMissing.propTypes = {
	type: PropTypes.oneOf( [ "error", "info", "success", "warning" ] ),
	message: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
};

CompanyInfoMissing.defaultProps = {
	type: "warning",
};

export default CompanyInfoMissing;
