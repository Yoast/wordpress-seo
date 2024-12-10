import domReady from "@wordpress/dom-ready";
import { __, sprintf } from "@wordpress/i18n";
import { createInterpolateElement, createRoot } from "@wordpress/element";
import { CheckIcon } from "@heroicons/react/solid";
import { ArrowRightIcon } from "@heroicons/react/outline";

/**
 * The installation success page.
 *
 * @returns {WPElement} The installation success page.
 */
export function InstallationSuccessPage() {
	return (
		<div className="yst-root yst-my-auto yst-flex yst-flex-col yst-h-[90vh] yst-justify-center">
			<h1 className="yst-text-4xl yst-text-gray-900 yst-w-[350px] yst-font-extrabold yst-leading-10 yst-mx-auto yst-mt-6 yst-mb-16 yst-text-center yst-tracking-tight">
				{
					createInterpolateElement(
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
			<div className="installation-success-content">
				<div className="yst-flex yst-flex-col md:yst-flex-row yst-justify-center yst-items-center yst-gap-8">
					<div id="installation-success-card-optimized-site" className="yst-shrink-0 yst-bg-white yst-rounded-lg yst-p-6 yst-flex yst-flex-col yst-max-w-sm yst-shadow-md yst-h-4/5 yst-leading-6">
						<h2 className="yst-tracking-tight yst-text-gray-900 yst-text-2xl yst-leading-8 yst-font-extrabold">{ __( "Your site is now easier for search engines to find.", "wordpress-seo" ) }</h2>
						<p className="yst-text-gray-500 yst-text-base yst-my-4">
							{ sprintf(
								/* translators: %s expands to Yoast SEO. */
								__( "%s rolls out the red carpet for the search bots, which helps your site perform better in search engines.",
									"wordpress-seo" ),
								"Yoast SEO"
							) }
						</p>
						<div className="card-button-section" />
						<div className="yst-bg-green-100 yst-w-20 yst-h-20 yst-rounded-full yst-mx-auto yst-my-2 yst-flex yst-items-center yst-justify-center">
							<CheckIcon className="yst-w-8 yst-text-green-600" />
						</div>
					</div>
					<div>
						<ArrowRightIcon className="yst-w-8 yst-text-gray-500 rtl:yst-rotate-180" />
					</div>
					<div id="installation-success-card-configuration" className="yst-shrink-0 yst-shadow-xl yst-bg-primary-500 yst-rounded-lg yst-p-6 yst-flex yst-flex-col yst-max-w-sm yst-h-4/5 yst-leading-6">
						<h2 className=" yst-text-white yst-text-2xl yst-leading-8 yst-font-extrabold">
							{ sprintf(
								/* translators: %s expands to Yoast SEO. */
								__( "For the best ranking results: configure %s!", "wordpress-seo" ),
								"Yoast SEO"
							) }
						</h2>
						<p className="yst-font-medium yst-text-white yst-text-base yst-my-4">
							{ sprintf(
								/* translators: %s expands to Yoast SEO. */
								__( "Set the essential %s settings for your site in a few steps.", "wordpress-seo" ),
								"Yoast SEO"
							) }
						</p>
						<img
							className="yst-my-6 yst-mx-auto yst-w-[150px] yst-h-[120px]"
							src={ window.wpseoInstallationSuccess.pluginUrl + "/images/indexables_3_left_bubble_optm.svg" }
							alt={ "" }
						/>
						<div className="yst-flex yst-grow-1 yst-mt-auto">
							<a
								id="installation-successful-configuration-link"
								href={ window.wpseoInstallationSuccess.firstTimeConfigurationUrl }
								className="yst-inline-flex yst-items-center yst-w-full yst-justify-center yst-no-underline yst-px-6 yst-py-3 yst-border yst-border-transparent yst-text-base yst-font-medium yst-rounded-md yst-shadow-none yst-text-primary-500 yst-bg-white hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-white yst-ring-offset-2 yst-ring-offset-primary-500"
								data-hiive-event-name="clicked_start_first_time_configuration"
							>
								{ __( "Start first-time configuration!", "wordpress-seo" ) }
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="yst-ms-3 yst-me-1 yst-h-5 yst-w-5 rtl:yst-rotate-180"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
							</a>
						</div>
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
