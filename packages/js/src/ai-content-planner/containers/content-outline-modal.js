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

		const { getIsPremium } = select( "yoast-seo/editor" );

		return {
			suggestion: selectSuggestion(),
			outline: selectContentOutline(),
			sparksLimit: selectUsageCountLimit(),
			sparksUsage: selectUsageCount(),
			status: selectContentOutlineStatus(),
			isPremium: getIsPremium(),
			isActive: selectFeatureModalStatus() === FEATURE_MODAL_STATUS.contentOutline,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { resetBlocks } = dispatch( "core/block-editor" );
		const { getContentOutline, fetchContentPlannerSuggestions, setFeatureModalStatus } = dispatch( CONTENT_PLANNER_STORE );

		return {
			resetBlocks,
			getContentOutline,
			fetchContentPlannerSuggestions,
			onBackToSuggestions: () => {
				setFeatureModalStatus( FEATURE_MODAL_STATUS.contentSuggestions );
			},
		};
	} ),
] )( ContentOutlineModal );
