import { select } from "@wordpress/data";

/**
	 * Checks if the Webinar promotion should be shown in the sidebar.
	 *
	 * @param {string} store The store to use.
	 *
	 * @returns {boolean} Whether the Webinar promotion should be shown.
	 */
export const shouldShowWebinarPromotionNotificationInSidebar = ( store = "yoast-seo/editor" ) => {
	const isBlackFridayPromotionActive = select( store ).isPromotionActive( "black-friday-promotion" );
	const isBlackFridayPromotionAlertDismissed = select( store ).isAlertDismissed( "black-friday-promotion" );

	if ( isBlackFridayPromotionActive ) {
		return isBlackFridayPromotionAlertDismissed;
	}

	return true;
};
