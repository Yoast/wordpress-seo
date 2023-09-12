import { select } from "@wordpress/data";

/**
	 * Checks if the Webinar promotion should be shown in the dashboard.
	 *
	 * @param {string} store The store to use.
	 *
	 * @returns {boolean} Whether the Webinar promotion should be shown.
	 */
const shouldShowWebinarPromoNotificationInDashboard = ( store = "yoast-seo/editor" ) => {
	const isBlackFridayChecklistPromoActive = select( store ).isPromotionActive( "black_friday_2023_checklist" );
	const isBlackFridayChecklistAlertDismissed = select( store ).isAlertDismissed( "black-friday-2023-sidebar-checklist" );

	if ( isBlackFridayChecklistPromoActive && ! isBlackFridayChecklistAlertDismissed ) {
		return false;
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
const shouldShowWebinarPromoNotificationInSidebar = ( store = "yoast-seo/editor" ) => {
	const isBlackFridaySalePromoActive = select( store ).isPromotionActive( "black_friday_2023_sale" );
	const isBlackFridaySaleAlertDismissed = select( store ).isAlertDismissed( "black-friday-2023-sale" );

	if ( ( isBlackFridaySalePromoActive && ! isBlackFridaySaleAlertDismissed ) ||
		! shouldShowWebinarPromoNotificationInDashboard( store ) ) {
		return false;
	}

	return true;
};

export { shouldShowWebinarPromoNotificationInDashboard, shouldShowWebinarPromoNotificationInSidebar };
