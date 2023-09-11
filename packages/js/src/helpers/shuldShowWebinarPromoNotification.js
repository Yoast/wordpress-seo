import { select } from "@wordpress/data";

/**
	 * Checks if the Webinar promotion should be shown.
	 * @returns {boolean} Whether the Webinar promotion should be shown.
	 */
export	const shouldShowWebinarPromoNotification = () => {
	const isBlackFridaySalePromoActive = select( "yoast-seo/editor" ).isPromotionActive( "black_friday_2023_sale" );
	const isBlackFridaySaleAlertDismissed = select( "yoast-seo/editor" ).isAlertDismissed( "black-friday-2023-sale" );
	const isBlackFridayChecklistPromoActive = select( "yoast-seo/editor" ).isPromotionActive( "black_friday_2023_checklist" );
	const isBlackFridayChecklistAlertDismissed = select( "yoast-seo/editor" ).isAlertDismissed( "black-friday-2023-sidebar-checklist" );

	if ( ( isBlackFridaySalePromoActive && ! isBlackFridaySaleAlertDismissed ) ||
		( isBlackFridayChecklistPromoActive && ! isBlackFridayChecklistAlertDismissed ) ) {
		return false;
	}

	return true;
};
