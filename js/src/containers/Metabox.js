import Metabox from "../components/Metabox";
import { connect } from "react-redux";

/**
 * Maps the state to props.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The props for the Metabox component.
 */
function mapStateToProps( state ) {
	return {
		isContentAnalysisActive: state.preferences.isContentAnalysisActive,
		isKeywordAnalysisActive: state.preferences.isKeywordAnalysisActive,
	};
}

export default connect( mapStateToProps )( Metabox );
