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
			selectContentOutlineError,
		} = select( CONTENT_PLANNER_STORE );

		const {
			selectUsageCountLimit,
			selectUsageCount,
		} = select( STORE_NAME_AI );

		const {
			getIsPremium,
			selectLink,
			isCornerstoneContent,
			getDateFromSettings,
			getContentLocale,
		} = select( "yoast-seo/editor" );

		return {
			suggestion: selectSuggestion(),
			outline: selectContentOutline(),
			sparksLimit: selectUsageCountLimit(),
			sparksUsage: selectUsageCount(),
			status: selectContentOutlineStatus(),
			error: selectContentOutlineError(),
			isPremium: getIsPremium(),
			isActive: selectFeatureModalStatus() === FEATURE_MODAL_STATUS.contentOutline,
			modalHelpLink: selectLink( "https://yoa.st/ai-content-planner-help-button-modal" ),
			isCornerstone: isCornerstoneContent(),
			date: getDateFromSettings(),
			locale: getContentLocale(),
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
