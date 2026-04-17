import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import { ContentOutlineModal } from "../components/content-outline-modal";
import { CONTENT_PLANNER_STORE, FEATURE_MODAL_STATUS } from "../constants";
import { STORE_NAME_AI } from "../../ai-generator/constants";

export default compose( [
	withSelect( ( select ) => {
		const {
			selectSuggestion,
			selectContentOutline,
			selectContentOutlineStatus,
			selectFeatureModalStatus,
		} = select( CONTENT_PLANNER_STORE );

		const {
			selectUsageCountLimit,
			selectUsageCount,
		} = select( STORE_NAME_AI );

		const { getIsPremium, selectLink } = select( "yoast-seo/editor" );

		return {
			suggestion: selectSuggestion(),
			outline: selectContentOutline(),
			sparksLimit: selectUsageCountLimit(),
			sparksUsage: selectUsageCount(),
			status: selectContentOutlineStatus(),
			isPremium: getIsPremium(),
			isActive: [ FEATURE_MODAL_STATUS.contentOutline, FEATURE_MODAL_STATUS.contentOutlineError ]
				.includes( selectFeatureModalStatus() ),
			// Temporary link to the AI Generator help button modal until the Content Planner help shortlink is created.
			modalHelpLink: selectLink( "https://yoa.st/ai-generator-help-button-modal" ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setFeatureModalStatus } = dispatch( CONTENT_PLANNER_STORE );

		return {
			onBackToSuggestions: () => {
				setFeatureModalStatus( FEATURE_MODAL_STATUS.contentSuggestions );
			},
		};
	} ),
] )( ContentOutlineModal );
