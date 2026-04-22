import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import { ContentOutlineModal } from "../components/content-outline-modal";
import { CONTENT_PLANNER_STORE, FEATURE_MODAL_STATUS } from "../constants";

export default compose( [
	withSelect( ( select ) => {
		const {
			selectSuggestion,
			selectContentOutline,
			selectContentOutlineStatus,
			selectFeatureModalStatus,
			selectContentOutlineError,
		} = select( CONTENT_PLANNER_STORE );

		const { getIsPremium } = select( "yoast-seo/editor" );

		return {
			suggestion: selectSuggestion(),
			outline: selectContentOutline(),
			status: selectContentOutlineStatus(),
			error: selectContentOutlineError(),
			isPremium: getIsPremium(),
			isActive: selectFeatureModalStatus() === FEATURE_MODAL_STATUS.contentOutline,
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
