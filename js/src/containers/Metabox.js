import Metabox from "../components/Metabox";
import { connect } from "react-redux";

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
		// Because this value is initiated as an empty string.
		displayAdvancedTab: !! window.wpseoAdminL10n.displayAdvancedTab,
	};
	return {
		settings,
		store: ownProps.store,
	};
}

export default connect( mapStateToProps )( Metabox );
