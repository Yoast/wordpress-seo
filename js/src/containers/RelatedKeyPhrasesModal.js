/* External dependencies */
import { connect } from "react-redux";

/* Internal dependencies */
import RelatedKeyPhrasesModal from "../components/RelatedKeyPhrasesModal";

/**
 * Maps redux state to the RelatedKeyPhrasesModal props.
 *
 * @param {Object} state The redux state.
 *
 * @returns {Object} Props that should be passed to RelatedKeyPhrasesModal.
 */
function mapStateToProps( state ) {
	const keyphrase = state.focusKeyword;

	return {
		keyphrase,
	};
}


export default connect( mapStateToProps )( RelatedKeyPhrasesModal );
