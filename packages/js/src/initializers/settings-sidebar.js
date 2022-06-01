import { get } from "lodash";
import { render } from "@wordpress/element";
import { ThemeProvider } from "styled-components";
import SettingsSidebar from "../components/SettingsSidebar";

/**
 * Initializes the React settings sidebar.
 *
 * @returns {void}
 */
const initSettingsSidebar = () => {
	const reactRoot = document.getElementById( "yst-settings-sidebar-root" );
	const isRtl = Boolean( get( window, "wpseoScriptData.isRtl", false ) );

	if ( reactRoot ) {
		render(
			<ThemeProvider theme={ { isRtl } }>
				<SettingsSidebar />
			</ThemeProvider>,
			reactRoot
		);
	}
};

export default initSettingsSidebar;
