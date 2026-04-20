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
			selectSuggestionsError,
		} = select( CONTENT_PLANNER_STORE );
		const {
			getIsPremium,
			selectLink,
		} = select( "yoast-seo/editor" );

		const {
			selectUsageCount,
			selectUsageCountLimit,
			selectUsageCountStatus,
		} = select( STORE_NAME_AI );

		return {
			suggestions: selectSuggestions(),
			isPremium: getIsPremium(),
			usageCount: selectUsageCount(),
			usageCountLimit: selectUsageCountLimit(),
			status: selectSuggestionsStatus(),
			error: selectSuggestionsError(),
			modalHelpLink: selectLink( "https://yoa.st/ai-content-planner-help-button-modal" ),
			usageCountStatus: selectUsageCountStatus(),
		};
	} ),
] )( ContentSuggestionsModal );
