import { __ } from "@wordpress/i18n";

import FirstTimeConfigurationSteps from "../../first-time-configuration/first-time-configuration-steps";
import {

	RouteLayout,
} from "../components";

/**
 * @returns {JSX.Element} The site defaults route.
 */
const FirstTimeConfiguration = () => {
	return (
		<RouteLayout
			title={ __( "First-time configuration", "wordpress-seo" ) }
			description={ __( "Tell us about your site, so we can get it ranked! Let's get your site in tip-top shape for the search engines. Follow these 5 steps to make Google understand what your site is about.", "wordpress-seo" ) }
		>
			<hr id="configuration-hr-top" />
			<div id="yoast-configuration" className="yst-p-8 yst-max-w-[715px]">
				<FirstTimeConfigurationSteps />
			</div>
		</RouteLayout>
	);
};

export default FirstTimeConfiguration;
