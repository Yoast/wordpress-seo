import domReady from "@wordpress/dom-ready";
import { __, sprintf } from "@wordpress/i18n";
import { createRoot } from "@wordpress/element";
import { ArrowNarrowRightIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { safeCreateInterpolateElement } from "./helpers/i18n";
import { Button } from "@yoast/ui-library";
import { CheckIcon } from "@heroicons/react/solid";

/**
 * The installation success page.
 *
 * @returns {WPElement} The installation success page.
 */
export function InstallationSuccessPage() {
	return (
		<div className="yst-root yst-my-auto yst-flex yst-flex-col yst-min-h-[84vh] yst-py-12 yst-justify-center">
			<div className="yst-bg-green-200 yst-w-20 yst-h-20 yst-rounded-full yst-mx-auto yst-my-0 yst-flex yst-items-center yst-justify-center">
				<CheckIcon className="yst-w-8 yst-text-green-600" />
			</div>
			<h1 className="yst-text-4xl yst-text-slate-900 yst-w-[350px] yst-font-extrabold yst-leading-10 yst-mx-auto yst-mt-8 yst-mb-0 yst-text-center yst-tracking-tight">
				{
					safeCreateInterpolateElement(
						sprintf(
							/* translators: %s expands to Yoast SEO. */
							__( "You've successfully installed %s!", "wordpress-seo" ),
							// The space between 'Yoast' and 'SEO' is a non-breaking space (Unicode 160).
							"<span>Yoast SEO</span>" ),
						{
							span: <span className="yst-text-primary-500" />,
						}
					)
				}
			</h1>
			<p className="yst-font-normal yst-text-slate-600 yst-text-lg yst-text-center yst-mt-4 yst-mb-8">
				{
					__( "Your site is now easier for search engines to find.", "wordpress-seo" )
				}
				<br />
				{
					sprintf(
						/* translators: %s expands to Yoast SEO. */
						__( "Let's finish setup to make the most of %s.", "wordpress-seo" ),
						"Yoast SEO"
					)
				}
			</p>
			<div className="installation-success-content">
				<div className="yst-flex yst-flex-col yst-justify-center yst-items-center yst-gap-8">
					<div id="installation-success-card-configuration" className="yst-shrink-0 yst-shadow-xl yst-bg-primary-500 yst-rounded-lg yst-p-6 yst-flex yst-flex-col yst-max-w-sm yst-h-4/5 yst-leading-6">
						<h2 className=" yst-text-white yst-text-2xl yst-leading-8 yst-font-extrabold">
							{
								__( "Get better results with the First-time configuration", "wordpress-seo" )
							}
						</h2>
						<p className="yst-font-normal yst-text-white yst-text-base yst-mb-4 yst-mt-2">
							{
								__( "Complete quick setup to enable essential SEO settings for your site.", "wordpress-seo" )
							}
						</p>
						<div className="yst-flex yst-grow-1 yst-mt-auto">
							<a
								id="installation-successful-configuration-link"
								href={ window.wpseoInstallationSuccess.firstTimeConfigurationUrl }
								className="yst-inline-flex yst-items-center yst-w-full yst-justify-center yst-no-underline yst-px-6 yst-py-3 yst-border yst-border-transparent yst-text-base yst-font-medium yst-rounded-md yst-shadow-none yst-text-primary-500 yst-bg-white hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-white yst-ring-offset-2 yst-ring-offset-primary-500"
								data-hiive-event-name="clicked_start_first_time_configuration"
							>
								{ __( "Start configuration", "wordpress-seo" ) }
								<ArrowNarrowRightIcon className="yst-w-5 yst-h-5 yst-ms-3 yst-me-1 rtl:yst-rotate-180" />
							</a>
						</div>
						<p className="yst-font-normal yst-italic yst-text-center yst-text-white yst-text-sm yst-mt-3">
							{
								__( "Takes a few minutes · Recommended", "wordpress-seo" )
							}
						</p>
					</div>
					<div id="installation-success-card-optimized-site" className="yst-shrink-0 yst-bg-white yst-rounded-lg yst-p-4 yst-flex yst-flex-col yst-max-w-xs yst-shadow-md yst-h-4/5 yst-leading-6">
						<h2 className="yst-tracking-tight yst-text-primary-500 yst-text-lg yst-leading-8 yst-font-extrabold">
							{ __( "Unlock more powerful SEO tools", "wordpress-seo" ) }
						</h2>
						<p className="yst-text-slate-600 yst-text-sm yst-mb-1">
							{ sprintf(
								/* translators: %s expands to Yoast SEO Premium. */
								__( "Consider %s for faster, easier SEO with AI features that save time.",
									"wordpress-seo" ),
								"Yoast SEO Premium"
							) }
						</p>
						<Button
							as="a"
							variant="secondary"
							size="small"
							href={ window.wpseoInstallationSuccess.explorePremiumUrl }
							className="yst-gap-2 yst-text-xs yst-mt-2"
							target="_blank"
							rel="noopener"
						>
							{ __( "Explore Premium features", "wordpress-seo" ) }
							<span className="yst-sr-only">
								{
									/* translators: Hidden accessibility text. */
									__( "(Opens in a new browser tab)", "wordpress-seo" )
								}
							</span>
							<ExternalLinkIcon className="yst-w-4 yst-h-4 yst-icon-rtl yst-text-slate-400" />
						</Button>
						<p className="yst-font-normal yst-italic yst-text-center yst-text-slate-500 yst-text-xs yst-mt-2">
							{
								__( "Trusted by millions of site owners", "wordpress-seo" )
							}
							<br />
							{
								__( "30-day money-back guarantee", "wordpress-seo" )
							}
						</p>
					</div>
					<a
						id="installation-success-skip-link"
						className="yst-bottom-12 yst-right-0 yst-mr-5 yst-self-end yst-text-base md:yst-absolute"
						href={ window.wpseoInstallationSuccess.dashboardUrl }
						data-hiive-event-name="clicked_skip_button | installation successful screen"
					>
						{
							/* translators: %s expands to ' »'. */
							sprintf( __( "Skip%s", "wordpress-seo" ), " »" )
						}
					</a>
				</div>
			</div>
		</div>
	);
}

domReady( () => {
	const container = document.getElementById( "wpseo-installation-successful-free" );
	if ( container ) {
		const root = createRoot( container );
		root.render( <InstallationSuccessPage /> );
	}
} );
