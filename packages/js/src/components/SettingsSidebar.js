import { Fragment } from "@wordpress/element";
import WebinarPromoAlert from "./WebinarPromoAlert";

/**
 * @returns {JSX.Element} The SettingsSidebar component.
 */
const SettingsSidebar = () => (
	<Fragment>
		<WebinarPromoAlert store="yoast-seo/settings" />
	</Fragment>
);

export default SettingsSidebar;
