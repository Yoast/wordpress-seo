import { select } from "@wordpress/data";

/**
	 * Checks if the Webinar promotion should be shown in the dashboard.
	 *
	 * @param {string} store The store to use.
	 *
	 * @returns {boolean} Whether the Webinar promotion should be shown.
	 */
const shouldShowWebinarPromotionNotificationInDashboard = ( store = "yoast-seo/editor" ) => {
	const isBlackFridayChecklistPromotionActive = select( store ).isPromotionActive( "black-friday-2023-checklist" );
	const isBlackFridayChecklistAlertDismissed = select( store ).isAlertDismissed( "black-friday-2023-sidebar-checklist" );

	if ( isBlackFridayChecklistPromotionActive ) {
		return isBlackFridayChecklistAlertDismissed;
	}

	return true;
};

/**
	 * Checks if the Webinar promotion should be shown in the sidebar.
	 *
	 * @param {string} store The store to use.
	 *
	 * @returns {boolean} Whether the Webinar promotion should be shown.
	 */
const shouldShowWebinarPromotionNotificationInSidebar = ( store = "yoast-seo/editor" ) => {
	const isBlackFridayPromotionActive = select( store ).isPromotionActive( "black-friday-2024-promotion" );
	const isBlackFridayPromotionAlertDismissed = select( store ).isAlertDismissed( "black-friday-2024-promotion" );

	if ( isBlackFridayPromotionActive ) {
		return isBlackFridayPromotionAlertDismissed;
	}

	return shouldShowWebinarPromotionNotificationInDashboard( store );
};

export { shouldShowWebinarPromotionNotificationInDashboard, shouldShowWebinarPromotionNotificationInSidebar };
