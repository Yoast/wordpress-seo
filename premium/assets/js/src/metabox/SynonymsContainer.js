import { connect } from "react-redux";
import SynonymsSection from "yoast-components/composites/Plugin/Synonyms/components/SynonymsSection";

/**
 * Maps the redux state to the snippet editor component.
 *
 * @param {Object} state    The state.
 * @param {Object} ownProps The props.
 *
 * @returns {Object} Data for the Synonyms component.
 */
function mapStateToProps( state, ownProps ) {
	console.log( state, ownProps );
	return {
		synonyms: state.synonyms[ ownProps.activeKeyword ],
	};
}

export default connect( mapStateToProps )( SynonymsSection );
