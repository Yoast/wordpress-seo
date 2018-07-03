import { connect } from "react-redux";
import SynonymsSection from "yoast-components/composites/Plugin/Synonyms/components/SynonymsSection";
import { changeSynonyms } from "yoast-components/composites/Plugin/Synonyms/actions/synonyms";

/**
 * Maps the redux state to the SynonymsSection component.
 *
 * @param {Object} state    The state of the store.
 * @param {Object} ownProps The props of the component.
 *
 * @returns {Object} Data for the SynonymsSection component.
 */
function mapStateToProps( state, ownProps ) {
	return {
		synonyms: state.synonyms[ ownProps.index ] || "",
	};
}

/**
 * Maps dispatch function to props for the SynonymsSection component.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 * @param {Object}   ownProps The props of the component.
 *
 * @returns {Object} Props for the SynonymsSection component.
 */
export function mapDispatchToProps( dispatch, ownProps ) {
	return {
		onChange: synonyms => {
			dispatch( changeSynonyms( ownProps.index, synonyms ) );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SynonymsSection );
