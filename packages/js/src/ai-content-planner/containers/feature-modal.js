import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { count } from "@wordpress/wordcount";
import { FeatureModal } from "../components/feature-modal";
import { CONTENT_PLANNER_STORE } from "../constants";
import { STORE_NAME_AI } from "../../ai-generator/constants";

export default compose( [
	withSelect( ( select ) => {
		const { selectFeatureModalStatus, selectIsModalOpen, selectSuggestion } = select( CONTENT_PLANNER_STORE );
		const content = select( "core/editor" ).getEditedPostContent();
		const { getIsPremium, selectLink } = select( "yoast-seo/editor" );
		const { isUsageCountLimitReached } = select( STORE_NAME_AI );

		return {
			isOpen: selectIsModalOpen(),
			isEmptyPost: count( content, "words", {} ) === 0,
			isPremium: getIsPremium(),
			status: selectFeatureModalStatus(),
			upsellLink: selectLink( "https://yoa.st/content-planner-approve-modal" ),
			isUpsell: isUsageCountLimitReached(),
			selectedSuggestion: selectSuggestion(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { closeModal, setFeatureModalStatus } = dispatch( CONTENT_PLANNER_STORE );

		return {
			onClose: closeModal,
			setStatus: setFeatureModalStatus,
		};
	} ),
] )( FeatureModal );
