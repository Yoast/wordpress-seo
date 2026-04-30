import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { count } from "@wordpress/wordcount";
import { ApproveModal } from "../components/approve-modal";
import { CONTENT_PLANNER_STORE, FEATURE_MODAL_STATUS } from "../constants";
import { STORE_NAME_AI } from "../../ai-generator/constants";

export default compose( [
	withSelect( ( select ) => {
		const { selectFeatureModalStatus } = select( CONTENT_PLANNER_STORE );
		const content = select( "core/editor" ).getEditedPostContent();
		const { getIsPremium, selectLink } = select( "yoast-seo/editor" );

		const { isUsageCountLimitReached, selectPremiumSubscription } = select( STORE_NAME_AI );
		const hasValidPremiumSubscription = selectPremiumSubscription();
		const isPremium = getIsPremium();
		return {
			isEmptyPost: count( content, "words", {} ) === 0,
			isOpen: selectFeatureModalStatus() === FEATURE_MODAL_STATUS.idle,
			isPremium,
			upsellLink: selectLink( "https://yoa.st/content-planner-approve-modal" ),
			learnMoreLink: selectLink( "https://yoa.st/content-planner-learn-more" ),
			// Premium-installed users with an invalid licence should fall through to the
			// API call so the 402 response surfaces a "Subscription required" error, rather
			// than the "Unlock with Premium" upsell intended for free-only users.
			isUpsell: isUsageCountLimitReached() && ! hasValidPremiumSubscription && ! isPremium,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { closeModal, setFeatureModalStatus } = dispatch( CONTENT_PLANNER_STORE );

		return {
			onClose: closeModal,
			setStatus: setFeatureModalStatus,
		};
	} ),
] )( ApproveModal );
