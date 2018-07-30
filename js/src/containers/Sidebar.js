import Sidebar from "../components/Sidebar";
import { connect } from "react-redux";

/**
 * Maps the state to props.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The props for the Sidebar component.
 */
function mapStateToProps( state ) {
	return {
		isContentAnalysisActive: state.preferences.isContentAnalysisActive,
		isKeywordAnalysisActive: state.preferences.isKeywordAnalysisActive,
		isCornerstone: state.isCornerstone,
		isCornerstoneActive: state.preferences.isCornerstoneActive,
	};
}

export default connect( mapStateToProps )( Sidebar );
