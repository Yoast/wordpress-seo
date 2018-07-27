import { connect } from "react-redux";
import KeywordInput from "yoast-components/composites/Plugin/Shared/components/KeywordInput";
import { setFocusKeyword } from "../redux/actions/focusKeyWord";

/**
 * Maps redux state to KeywordInput props.
 *
 * @param {Object} state The redux state.
 *
 * @returns {Object} Props that should be passed to SeoAnalysis.
 */
function mapStateToProps( state ) {
	return {
		keyword: state.focusKeyword,
	};
}

/**
 * Maps the redux dispatch to KeywordInput props.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 *
 * @returns {Object} Props for the `KeywordInput` component.
 */
function mapDispatchToProps( dispatch ) {
	return {
		onChange: ( value ) => {
			dispatch( setFocusKeyword( value ) );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( KeywordInput );
