import { __ } from "@wordpress/i18n";
import FirstTimeConfigurationSteps from "./first-time-configuration-steps";

/**
 * The first time configuration.
 *
 * @returns {WPElement} The FirstTimeConfigurationSteps component.
 */
export default function FirstTimeConfigurationAppContainer() {
	return ( <div id="yoast-configuration" className="yst-max-w-[715px] yst-mt-6 yst-p-8 yst-rounded-lg yst-bg-white yst-shadow yst-text-slate-600">
		<h2
			id="yoast-configuration-title"
			className="yst-text-lg yst-text-primary-500 yst-font-medium"
		>{ __( "Tell us about your site, so we can get it ranked!", "wordpress-seo" ) }</h2>
		<p className="yst-pt-2 yst-mb-6">
			{ __( "Let's get your site in tip-top shape for the search engines. Simply follow these 5 steps to make Google understand what your site is about.", "wordpress-seo" ) }
		</p>
		<hr id="configuration-hr-top" />
		<div className="yst-mt-8">
			<FirstTimeConfigurationSteps />
		</div>
	</div> );
}

