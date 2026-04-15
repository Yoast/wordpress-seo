import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import { FeatureModal } from "../components/feature-modal";
import { CONTENT_PLANNER_STORE } from "../constants";

export default compose( [
	withSelect( ( select ) => {
		const {
			selectSuggestionsStatus,
			selectContentPlannerEndpoint,
		} = select( CONTENT_PLANNER_STORE );
		const {
			getPostType,
			getContentLocale,
			getEditorTypeApiValue,
		} = select( "yoast-seo/editor" );

		return {
			suggestionsStatus: selectSuggestionsStatus(),
			endpoint: selectContentPlannerEndpoint(),
			postType: getPostType(),
			contentLocale: getContentLocale(),
			editorApiValue: getEditorTypeApiValue(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { resetBlocks } = dispatch( "core/block-editor" );
		const { getContentOutline, fetchContentPlannerSuggestions } = dispatch( CONTENT_PLANNER_STORE );

		return {
			resetBlocks,
			getContentOutline,
			fetchContentPlannerSuggestions,
		};
	} ),
] )( FeatureModal );
