import MetaboxFill from "../components/fills/MetaboxFill";
import { connect } from "react-redux";
import { get } from "lodash-es";

/**
 * Maps the state to props.
 *
 * @param {Object} state The Redux state.
 * @param {Object} ownProps The props passed.
 *
 * @returns {Object} The props for the Metabox component.
 */
function mapStateToProps( state, ownProps ) {
	const settings = {
		...state.preferences,
		// Because cornerstone is only applicable to posts, not terms. Despite the general setting.
		isCornerstoneActive: get( window, "wpseoScriptData.isPost", false ) && state.preferences.isCornerstoneActive,
		// Because this value is initiated as an empty string.
		displayAdvancedTab: !! window.wpseoAdminL10n.displayAdvancedTab,
	};
	return {
		settings,
		store: ownProps.store,
	};
}

export default connect( mapStateToProps )( MetaboxFill );
