import { withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { CONTENT_PLANNER_STORE } from "../constants";
import { ContentSuggestionsModal } from "../components/content-suggestions-modal";

export default compose( [
	withSelect( ( select ) => {
		const {
			selectSuggestions,
			selectSuggestionsStatus,
			selectSuggestionsError,
		} = select( CONTENT_PLANNER_STORE );
		const { getIsPremium } = select( "yoast-seo/editor" );

		return {
			suggestions: selectSuggestions(),
			isPremium: getIsPremium(),
			status: selectSuggestionsStatus(),
			error: selectSuggestionsError(),
		};
	} ),
] )( ContentSuggestionsModal );
