import { get } from "lodash";
import { render } from "@wordpress/element";
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

	if ( reactRoot ) {
		render(
			<ThemeProvider theme={ { isRtl } }>
				<WebinarPromoNotification store="yoast-seo/settings" />
			</ThemeProvider>,
			reactRoot
		);
	}
};

export default initSettingsHeader;
