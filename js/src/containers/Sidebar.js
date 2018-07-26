import Sidebar from "../components/Sidebar";
import { connect } from "react-redux";

/**
 * Maps the state to props.
 *
 * @param {Object} state The state.
 *
 * @return {Object} The props for the Sidebar component.
 */
function mapStateToProps( state ) {
	return {
		isContentAnalysisActive: state.preferences.isContentAnalysisActive,
		isKeywordAnalysisActive: state.preferences.isKeywordAnalysisActive,
	}
}

export default connect( mapStateToProps )( Sidebar );
