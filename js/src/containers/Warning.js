import { connect } from "react-redux";
import { YoastWarning } from "yoast-components";

/**
 * Maps the state to props for the containing component.
 *
 * @param {Object} state The full available redux state.
 *
 * @returns {Object} Props for the containing component.
 */
function mapStateToProps( state ) {
	return {
		message: state.warning.message,
	};
}

export default connect( mapStateToProps )( YoastWarning );
