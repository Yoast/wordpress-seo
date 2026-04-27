import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { count } from "@wordpress/wordcount";
import { FeatureModal } from "../components/feature-modal";
import { CONTENT_PLANNER_STORE } from "../constants";
import { STORE_NAME_AI } from "../../ai-generator/constants";

export default compose( [
	withSelect( ( select ) => {
		const { selectFeatureModalStatus, selectSuggestionsStatus, selectContentOutlineStatus } = select( CONTENT_PLANNER_STORE );
		const content = select( "core/editor" ).getEditedPostContent();
		const { getIsPremium, selectLink } = select( "yoast-seo/editor" );

		const {
			selectUsageCount,
			selectUsageCountLimit,
			selectUsageCountStatus,
		} = select( STORE_NAME_AI );

		return {
			isEmptyPost: count( content, "words", {} ) === 0,
			isPremium: getIsPremium(),
			status: selectFeatureModalStatus(),
			modalHelpLink: selectLink( "https://yoa.st/ai-content-planner-help-button-modal" ),
			usageCount: selectUsageCount(),
			usageCountLimit: selectUsageCountLimit(),
			contentSuggestionsStatus: selectSuggestionsStatus(),
			contentOutlineStatus: selectContentOutlineStatus(),
			usageCountStatus: selectUsageCountStatus(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { closeModal } = dispatch( CONTENT_PLANNER_STORE );

		return {
			onClose: closeModal,
		};
	} ),
] )( FeatureModal );
