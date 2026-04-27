import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import { OutlineModalContent } from "../components/outline-modal-content";
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

		const {
			isCornerstoneContent,
			getDateFromSettings,
			getContentLocale,
		} = select( "yoast-seo/editor" );
		return {
			suggestion: selectSuggestion(),
			outline: selectContentOutline(),
			status: selectContentOutlineStatus(),
			error: selectContentOutlineError(),
			isPremium: getIsPremium(),
			isActive: selectFeatureModalStatus() === FEATURE_MODAL_STATUS.contentOutline,
			locale: getContentLocale(),
			date: getDateFromSettings(),
			isCornerstone: isCornerstoneContent(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setFeatureModalStatus, saveOutlineEditsToCache } = dispatch( CONTENT_PLANNER_STORE );

		return {
			onBackToSuggestions: ( suggestion, structure ) => {
				saveOutlineEditsToCache( { suggestion, structure } );
				setFeatureModalStatus( FEATURE_MODAL_STATUS.contentSuggestions );
			},
		};
	} ),
] )( OutlineModalContent );
