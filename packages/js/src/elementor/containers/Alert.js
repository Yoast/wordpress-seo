import { Alert } from "@yoast/components";
import { withSelect } from "@wordpress/data";
import PropTypes from "prop-types";

/**
 * Wraps the Alert as a quick fix for the way it is used in Elementor.
 * Message is sometimes an empty array or an empty string,
 * in which case the Alert should not be shown.
 *
 * @param {Object} props The props.
 *
 * @returns {ReactElement|Null} The Alert or Null.
 */
function WrappedAlert( props ) {
	return ( props.message.length === 0 ? null : <Alert type={ props.type }>{ props.message }</Alert> );
}

WrappedAlert.propTypes = {
	message: PropTypes.oneOfType( [ PropTypes.array, PropTypes.string ] ).isRequired,
	type: PropTypes.string.isRequired,
};

export default withSelect( select => {
	const {
		getWarningMessage,
	} = select( "yoast-seo/editor" );

	return {
		message: getWarningMessage(),
		type: "info",
	};
} )( WrappedAlert );

