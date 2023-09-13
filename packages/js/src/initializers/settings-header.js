import { get } from "lodash";
import { render } from "@wordpress/element";
import { ThemeProvider } from "styled-components";
import WebinarPromoNotification from "../components/WebinarPromoNotification";
import { BlackFridaysidebarChecklistPromotion } from "../components/BlackFridaysidebarChecklistPromotion";
import { shouldShowWebinarPromoNotificationInDashboard } from "../helpers/shouldShowWebinarPromoNotification";

/**
 * Initializes the React settings header, just below the title.
 *
 * @returns {void}
 */
const initSettingsHeader = () => {
	const reactRoot = document.getElementById( "yst-settings-header-root" );
	const isRtl = Boolean( get( window, "wpseoScriptData.isRtl", false ) );
	const webinarIntroSettingsUrl = get( window, "wpseoScriptData.webinarIntroSettingsUrl", "https://yoa.st/webinar-intro-settings" );
	const isWooCommerce = get( window, "wpseoScriptData.isWooCommerceActive", "" );

	if ( reactRoot ) {
		render(
			<ThemeProvider theme={ { isRtl } }>
				{ isWooCommerce && <BlackFridaysidebarChecklistPromotion store="yoast-seo/settings" /> }
				{ shouldShowWebinarPromoNotificationInDashboard( "yoast-seo/settings" ) && <WebinarPromoNotification store="yoast-seo/settings" url={ webinarIntroSettingsUrl } /> }
			</ThemeProvider>,
			reactRoot
		);
	}
};

export default initSettingsHeader;
