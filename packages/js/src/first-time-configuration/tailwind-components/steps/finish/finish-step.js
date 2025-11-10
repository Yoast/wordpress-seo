import { CheckCircleIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { get } from "lodash";
import { Button } from "@yoast/ui-library";
import { ArrowNarrowRightIcon, LightningBoltIcon, LockOpenIcon } from "@heroicons/react/outline";
import UpsellNotice from "../../base/upsell-notice";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";

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
 * @param {Object} state The state.
 *
 * @returns {WPElement} The Finish step.
 */
export default function FinishStep( { state } ) {
	const webinarIntroFirstTimeConfigUrl = get( window, "wpseoScriptData.webinarIntroFirstTimeConfigUrl", "https://yoa.st/webinar-intro-first-time-config" );

	const premiumFTCBenefits = [
		__( "Optimize for multiple keyphrases per page to reach a wider audience.", "wordpress-seo" ),
		__( "Get smart internal linking suggestions that strengthen your site structure.", "wordpress-seo" ),
		__( "Automatically redirect broken URLs so you don’t lose traffic or SEO value.", "wordpress-seo" ),
		__( "Save time with AI-powered title and meta description suggestions.", "wordpress-seo" ),
	];

	return (
		<div className="yst-flex yst-flex-row yst-justify-between yst-items-center yst-mt-4">
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
				{ ! state.isPremium && <UpsellNotice className="yst-mt-8 yst-gap-2">
					<div className="yst-flex yst-flex-col yst-gap-1">
						<div className="yst-flex yst-gap-2 yst-items-center">
							<LightningBoltIcon className="yst-text-primary-300 yst-w-4 yst-h-4 yst-inline-block" />
							<p className="yst-font-medium yst-text-slate-800">
								{ __( "Your site’s ready to shine! Want to take it to the next level?", "wordpress-seo" ) }
							</p>
						</div>
						<p className="yst-mt-4">
							{
								safeCreateInterpolateElement(
									sprintf(
										/* translators: %1$s expands to opening 'span' HTML tag, %2$s expands to Yoast SEO Premium,
										%3$s expands to closing 'span' HTML tag. */
										__( "%1$s%2$s%3$s helps you:", "wordpress-seo" ),
										"<span>",
										"Yoast SEO Premium",
										"</span>"
									),
									{
										span: <span className="yst-text-slate-800 yst-font-medium" />,
									}
								)
							}
						</p>
						<ul className="yst-flex yst-flex-col yst-gap-2 yst-list-none yst-list-outside yst-text-slate-600 yst-mt-2">
							{ premiumFTCBenefits.map( ( benefit, index ) => (
								<li key={ `upsell-benefit-${ index }` } className="yst-flex yst-items-start"><CheckCircleIcon className="yst-mr-2 yst-text-green-500 yst-w-[19.5px] yst-h-[19.5px] yst-flex-shrink-0" />{ benefit }</li>
							) ) }
						</ul>
					</div>
					<p className="yst-mt-5">
						<Button
							as="a"
							variant="upsell"
							href={ window.wpseoFirstTimeConfigurationData.shortlinks.finishLearnMore }
							className="yst-gap-2 sm:yst-max-w-sm"
							target="_blank"
							rel="noopener"
						>
							<LockOpenIcon className="yst-w-4 yst-h-4" />
							{ __( "Unlock all Premium features", "wordpress-seo" ) }
							<span className="yst-sr-only">
								{
									/* translators: Hidden accessibility text. */
									__( "(Opens in a new browser tab)", "wordpress-seo" )
								}
							</span>
						</Button>
					</p>
				</UpsellNotice> }
			</div>
		</div>
	);
}
