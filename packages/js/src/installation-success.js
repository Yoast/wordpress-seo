import domReady from "@wordpress/dom-ready";
import { __, sprintf } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";
import { renderReactRoot } from "./helpers/reactRoot";
import { Button } from "@yoast/components";
import { ActiveCircle, SavedCircle } from "./first-time-configuration/tailwind-components/step-circle";

/**
 * The non-functional, decorative steppers for the installation success page.
 * Inspired by the Tailwind stepper. https://tailwindui.com/components/application-ui/navigation/steps#component-9a29a1d37a37b90f0b926478e8706004
 *
 * @returns {WPElement} The decorative steppers.
 */
export default function Steppers() {
	return (
		<ul className="yst-flex-col yst-mx-auto yst-mt-6">
			<div className="yst-inset-0 yst-mx-auto yst-my-6 yst-flex yst-items-center yst-w-[376px]" aria-hidden="true">
				<span
					className={ "yst-relative yst-shrink-0 yst-z-10 yst-w-8 yst-h-8 yst-rounded-full" }
				>
					<SavedCircle isVisible={ true } />
				</span>
				<div className="yst-h-0.5 yst-w-full yst-bg-primary-500" />
				<span
					className={ "yst-relative yst-shrink-0 yst-z-10 yst-w-8 yst-h-8 yst-rounded-full" }
				>
					<ActiveCircle isVisible={ true } />
				</span>
			</div>
		</ul>
	);
}

/**
 * The installation success page.
 *
 * @returns {WPElement} The installation success page.
 */
function InstallationSuccessPage() {
	return (
		<div className="yst-root yst-flex yst-flex-col yst-h-full yst-justify-start yst-pt-2">
			<h1 className="yst-text-4xl yst-text-gray-900 yst-w-[350px] yst-font-extrabold yst-mx-auto yst-my-6 yst-text-center yst-tracking-tight">
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
				<div className="yst-block">
					<Steppers />
				</div>
				<div className="yst-flex yst-justify-center yst-gap-6">
					<div id="installation-success-card-optimized-site" className="installation-success-card yst-shadow-md">
						<h2 className="yst-tracking-tight">{ __( "Your site is already easier to find for search engines.", "wordpress-seo" ) }</h2>
						<p>
							{ sprintf(
								/* translators: %s expands to Yoast SEO. */
								__( "%s rolls out the red carpet for the search bots, which helps your site perform better in search engines.",
									"wordpress-seo" ),
								"Yoast SEO"
							) }
						</p>
						<div className="card-button-section">
							<img
								className="man-with-tablet"
								src={ window.wpseoInstallationSuccess.pluginUrl + "/images/man_with_tablet.png" }
								alt={ __( "Man holding a tablet.", "wordpress-seo" ) }
							/>
						</div>
					</div>
					<div id="installation-success-card-configuration-workout" className="installation-success-card yst-h-[392px] yst-bg-primary-500 yst-yst-shadow-xl">
						<h2 className=" yst-text-white">
							{ sprintf(
								/* translators: %s expands to Yoast SEO. */
								__( "For the best ranking results: configure %s!", "wordpress-seo" ),
								"Yoast SEO"
							) }
						</h2>
						<p className="yst-font-medium yst-tracking-tight yst-text-white">
							{ sprintf(
								/* translators: %s expands to Yoast SEO. */
								__( "Set the essential %s settings for your site in a few steps.", "wordpress-seo" ),
								"Yoast SEO"
							) }
						</p>
						<img
							src={ window.wpseoInstallationSuccess.pluginUrl + "/images/indexables_3_left_bubble_optm.svg" }
							alt={ "" }
						/>
						<div className="flex yst-justify-center yst-grow-1 yst-mt-auto">
							<Button
								className="yst-flex yst-items-center yst-px-3 yst-py-0 yst-border yst-border-transparent yst-text-base yst-font-medium yst-rounded-md yst-shadow-sm yst-text-primary-500 yst-bg-white"
								id="installation-successful-configuration-workout-link"
								href={ window.wpseoInstallationSuccess.configurationWorkoutUrl }
								variant="primary"
							>
								{ __( "Start first-time configuration!", "wordpress-seo" ) }
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="yst-ml-3 yst-mr-1 yst-h-5 yst-w-5"
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
							</Button>
						</div>
					</div>
				</div>
			</div>
			<a id="installation-success-skip-link" href={ "/wp-admin/admin.php?page=wpseo_dashboard" }>
				{
					/* translators: %s expands to ' »'. */
					sprintf( __( "Skip%s", "wordpress-seo" ), " »" )
				}
			</a>
		</div>
	);
}

domReady( () => {
	renderReactRoot( "wpseo-installation-successful-free", <InstallationSuccessPage /> );
} );
