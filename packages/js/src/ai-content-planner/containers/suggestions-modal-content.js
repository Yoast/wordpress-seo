import { withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { CONTENT_PLANNER_STORE } from "../constants";
import { SuggestionsModalContent } from "../components/suggestions-modal-content";

export default compose( [
	withSelect( ( select ) => {
		const {
			selectSuggestions,
			selectSuggestionsStatus,
			selectSuggestionsError,
		} = select( CONTENT_PLANNER_STORE );

		return {
			suggestions: selectSuggestions(),
			status: selectSuggestionsStatus(),
			error: selectSuggestionsError(),
		};
	} ),
] )( SuggestionsModalContent );
