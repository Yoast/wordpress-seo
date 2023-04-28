import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { get } from "lodash";
import { ReactComponent as ConfigurationFinishImage } from "../../../../../images/indexables_2_left_bubble_optm.svg";
import { Button, Link } from "@yoast/ui-library";

/**
 * Goes to the Dashboard tab by clicking the tab button.
 *
 * @returns {void}
 */
function goToSEODashboard() {
	window.location.href = "admin.php?page=wpseo_dashboard";
}

/**
 * The last step of the Stepper: the Finish step.
 *
 * @returns {WPElement} The Finish step.
 */
export default function FinishStep() {
	const webinarIntroFirstTimeConfigUrl = get( window, "wpseoScriptData.webinarIntroFirstTimeConfigUrl", "https://yoa.st/webinar-intro-first-time-config" );

	return (
		<div className="yst-flex yst-flex-row yst-justify-between yst-items-center yst--mt-4">
			<div className="yst-mr-6">
				<p className="yst-text-sm yst-mb-4">
					{ __( "That's it! By providing this information, our Indexables squad has been able to do a lot of optimization for your site already. But there's more to do!", "wordpress-seo" ) }
				</p>
				<p className="yst-text-sm yst-mb-6">
					{ __( "Learn how to get the most out of Yoast SEO in an easy-to-follow video, ask questions in the live Q&A with our experts, or sign up for Yoast Academy for free to take control of your SEO!", "wordpress-seo" ) }
				</p>
				<Button
					as="a"
					id="button-webinar-seo-dashboard"
					href={ webinarIntroFirstTimeConfigUrl }
					target="_blank"
				>
					{ __( "Learn how to get the most out of Yoast SEO!", "wordpress-seo" ) }
					<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl yst-ml-2" />
				</Button>
				<p className="yst-mt-4">
					<Link
						id="link-webinar-register"
						onClick={ goToSEODashboard }
					>
						{ __( "Or go to your SEO dashboard", "wordpress-seo" ) }
					</Link>
				</p>
			</div>
			<ConfigurationFinishImage className="yst-shrink-0 yst-h-28 yst-mb-24" />
		</div>
	);
}
