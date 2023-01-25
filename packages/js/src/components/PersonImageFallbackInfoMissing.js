/* External dependencies */
import PropTypes from "prop-types";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Shows an alert with a message and a link.
 *
 * @constructor
 *
 * @param {Object} props The properties to use.
 *
 * @returns {wp.Element} The Alert component.
 */
const PersonImageFallbackInfoMissing = ( props ) => {
	return <Alert type={ props.type }>
		{ props.message }
	</Alert>;
};

PersonImageFallbackInfoMissing.propTypes = {
	type: PropTypes.oneOf( [ "error", "info", "success", "warning" ] ),
	message: PropTypes.string.isRequired,
};

PersonImageFallbackInfoMissing.defaultProps = {
	type: "info",
};

export default PersonImageFallbackInfoMissing;
