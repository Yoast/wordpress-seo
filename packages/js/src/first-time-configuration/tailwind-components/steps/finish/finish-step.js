import { ExternalLinkIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { get } from "lodash";
import { Button, Link } from "@yoast/ui-library";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";

/**
 * Goes to the Dashboard tab by clicking the tab button.
 *
 * @param {Event} event The event object.
 *
 * @returns {void}
 */
function goToSEODashboard( event ) {
	event.preventDefault();
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
			<div>
				<p className="yst-text-sm yst-mb-4">
					{
						sprintf(
							/* translators: 1: Yoast. */
							__( "Great work! Thanks to the details you've provided, %1$s has enhanced your site for search engines, giving them a clearer picture of what your site is all about.", "wordpress-seo" ),
							"Yoast"
						)
					}
				</p>
				<p className="yst-text-sm yst-mb-6">
					{ __( "If your goal is to increase your rankings, you need to work on your SEO regularly. That can be overwhelming, so let's tackle it one step at a time!", "wordpress-seo" ) }
				</p>
				<Button
					as="a"
					variant="primary"
					id="button-webinar-seo-dashboard"
					href={ webinarIntroFirstTimeConfigUrl }
					target="_blank"
					data-hiive-event-name="clicked_to_onboarding_page"
				>
					{ sprintf(
						/* translators: 1: Yoast SEO. */
						__( "Learn how to increase your rankings with %1$s", "wordpress-seo" ),
						"Yoast SEO"
					) }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
					<ExternalLinkIcon className="yst-w-4 yst-h-4 yst-icon-rtl yst-ms-2" />
				</Button>
				<p className="yst-mt-4">
					<Link
						id="link-webinar-register"
						as="button"
						onClick={ goToSEODashboard }
						data-hiive-event-name="clicked_seo_dashboard"
						variant="primary"
						className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"

					>
						{ __( "Or go to your SEO dashboard", "wordpress-seo" ) }
						<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
					</Link>
				</p>
			</div>
		</div>
	);
}
