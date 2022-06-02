import { __ } from "@wordpress/i18n";
import { ReactComponent as ConfigurationFinishImage } from "../../../../../images/succes_marieke_bubble_optm.svg";

/**
 * Goes to the Dashboard tab by clicking the tab button.
 *
 * @returns {void}
 */
function goToSEODashboard() {
	document.getElementById( "dashboard-tab" ).click();
	window.scrollTo( 0, 0 );
}

/**
 * The last step of the Stepper: the Finish step.
 *
 * @returns {WPElement} The Finish step.
 */
export default function FinishStep() {
	return (
		<div className="yst-flex yst-flex-row yst-justify-between yst-items-center yst--mt-4">
			<div className="yst-mr-6">
				<p className="yst-text-sm yst-mb-4">
					{ __( "That's it! By providing this information our Indexables squad has been able to do a lot of optimization for your site already.", "wordpress-seo" ) }
				</p>
				<p className="yst-text-sm yst-mb-6">
					{ __( "Want to optimize even further and get the most out of Yoast SEO? Make sure you don't miss our weekly webinar!", "wordpress-seo" ) }
				</p>
				<a href="https://yoast.com/" target="_blank" rel="noreferrer" className="yst-button yst-button--primary yst-text-white">
					{ __( "Register now!", "wordpress-seo" ) }
				</a>
				<button
					type="button"
					onClick={ goToSEODashboard }
					className={ "yst-ml-4 yst-text-indigo-600 hover:yst-text-indigo-500" }
				>{ __( "Or visit your SEO dashboard", "wordpress-seo" ) }</button>
			</div>
			<ConfigurationFinishImage className="yst-shrink-0 yst-h-28" />
		</div>
	);
}
