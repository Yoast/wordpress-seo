import { BlackFridayPromotion } from "../components/BlackFridayPromotion";
import { TrustpilotReviewNotification, useTrustpilotReviewNotification } from "../components/trustpilot-review-notification";
import WebinarPromoNotification from "../components/WebinarPromoNotification";
import { shouldShowWebinarPromotionNotificationInSidebar } from "../helpers/shouldShowWebinarPromotionNotification";

/**
 * Returns the first eligible entry from a list.
 * An entry should have a callback functions that determines if an entry is eligible.
 *
 * @param {{getIsEligible: func}[]} list Array of objects with a callback function under `getIsEligible`.
 *
 * @returns {Object|null} The first entry that is eligible or null.
 */
const getFirstEligible = ( list ) => {
	for ( const entry of list ) {
		if ( entry?.getIsEligible() ) {
			return entry;
		}
	}

	return null;
};

/**
 * Returns the first eligible notification.
 * The idea is to only show one notification at a time.
 *
 * @param {string} webinarIntroUrl The webinar intro URL.
 *
 * @returns {JSX.ElementClass|null} The first eligible notification or null.
 */
export const useFirstEligibleNotification = ( { webinarIntroUrl } ) => {
	const { shouldShow: shouldShowTrustpilotReviewNotification } = useTrustpilotReviewNotification();

	const firstEligible = getFirstEligible( [
		{
			getIsEligible: () => shouldShowTrustpilotReviewNotification,
			component: TrustpilotReviewNotification,
		},
		{
			getIsEligible: shouldShowWebinarPromotionNotificationInSidebar,
			component: () => <WebinarPromoNotification hasIcon={ false } image={ null } url={ webinarIntroUrl } />,
		},
		{
			getIsEligible: () => true,
			component: () => <BlackFridayPromotion hasIcon={ false } />,
		},
	] );

	return firstEligible?.component || null;
};
