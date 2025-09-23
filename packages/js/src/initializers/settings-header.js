import { get } from "lodash";
import { select } from "@wordpress/data";
import { createRoot } from "@wordpress/element";
import { addQueryArgs } from "@wordpress/url";
import { ThemeProvider } from "styled-components";
import WebinarPromoNotification from "../components/WebinarPromoNotification";

/**
 * Initializes the React settings header, just below the title.
 *
 * @returns {void}
 */
const initSettingsHeader = () => {
	const reactRoot = document.getElementById( "yst-settings-header-root" );
	const isRtl = Boolean( get( window, "wpseoScriptData.isRtl", false ) );
	const linkParams = select( "yoast-seo/settings" ).selectLinkParams();
	const webinarIntroSettingsUrl = addQueryArgs( "https://yoa.st/webinar-intro-settings", linkParams );

	if ( reactRoot ) {
		createRoot( reactRoot ).render(
			<ThemeProvider theme={ { isRtl } }>
				<WebinarPromoNotification store="yoast-seo/settings" url={ webinarIntroSettingsUrl } />
			</ThemeProvider>
		);
	}
};

export default initSettingsHeader;
