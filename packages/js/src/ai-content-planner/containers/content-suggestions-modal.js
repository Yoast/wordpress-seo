import { withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { CONTENT_PLANNER_STORE } from "../constants";
import { ContentSuggestionsModal } from "../components/content-suggestions-modal";
import { STORE_NAME_AI } from "../../ai-generator/constants";

export default compose( [
	withSelect( ( select ) => {
		const {
			selectSuggestions,
			selectSuggestionsStatus,
		} = select( CONTENT_PLANNER_STORE );
		const {
			getIsPremium,
			selectLink,
		} = select( "yoast-seo/editor" );

		const {
			selectUsageCount,
			selectUsageCountLimit,
		} = select( STORE_NAME_AI );

		return {
			suggestions: selectSuggestions(),
			isPremium: getIsPremium(),
			usageCount: selectUsageCount(),
			usageCountLimit: selectUsageCountLimit(),
			status: selectSuggestionsStatus(),
			// Temporary link to the AI Generator help button modal until the Content Planner help shortlink is created.
			modalHelpLink: selectLink( "https://yoa.st/ai-generator-help-button-modal" ),
		};
	} ),
] )( ContentSuggestionsModal );
