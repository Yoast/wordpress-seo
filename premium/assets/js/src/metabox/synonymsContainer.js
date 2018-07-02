import { connect } from "react-redux";
import SynonymsSection from "yoast-components/composites/Plugin/Synonyms/components/SynonymsSection";

/**
 * Maps the redux state to the snippet editor component.
 *
 * @param {Object} state          The current state.
 *
 * @returns {Object} Data for the Synonyms component.
 */
function mapStateToProps( state ) {
	return {
		synonyms: state.synonyms,
	};
}

export default connect( mapStateToProps )( SynonymsSection );
