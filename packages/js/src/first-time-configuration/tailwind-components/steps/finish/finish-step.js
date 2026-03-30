import { ExternalLinkIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { get } from "lodash";
import { Button } from "@yoast/ui-library";
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
		<div className="yst-flex yst-flex-row yst-justify-between yst-items-center yst-mt-4">
			<div>
				<p className="yst-text-sm yst-mb-4">
					{ __( "Setup complete! Your site is now ready for discovery.", "wordpress-seo" ) }
				</p>
				<p className="yst-text-sm yst-mb-6">
					{ __( "Turning that visibility into sustainable organic growth is a journey, but you don't have to do it alone. Let's take it one step at a time to ensure your content is always understood, properly represented, and engaged with.", "wordpress-seo" ) }
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
						__( "Learn how to get the most out of your %1$s plugin", "wordpress-seo" ),
						"Yoast"
					) }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
					<ExternalLinkIcon className="yst-w-4 yst-h-4 yst-icon-rtl yst-ms-2" />
				</Button>
				<p className="yst-mt-6">
					<Button
						id="link-webinar-register"
						as="a"
						onClick={ goToSEODashboard }
						data-hiive-event-name="clicked_seo_dashboard"
						variant="tertiary"
					>
						{ __( "Or go to your SEO dashboard", "wordpress-seo" ) }
						<ArrowNarrowRightIcon className="yst-ms-1 yst-w-4 yst-h-4 yst-icon-rtl" />
					</Button>
				</p>
			</div>
		</div>
	);
}
