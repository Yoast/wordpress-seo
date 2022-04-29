import domReady from "@wordpress/dom-ready";
import { __, sprintf } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";
import { renderReactRoot } from "./helpers/reactRoot";
import { ButtonStyledLink } from "@yoast/components";
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
			<h1 className="yst-text-4xl yst-text-gray-900 yst-w-[350px] yst-font-extrabold yst-mx-auto yst-my-6 yst-text-center">
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
				<div className="installation-success-cards">
					<div id="installation-success-card-optimized-site" className="installation-success-card">
						<h2>{ __( "Your site is now easy to find for search engines!", "wordpress-seo" ) }</h2>
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
					<div id="installation-success-card-configuration-workout" className="installation-success-card active">
						<h2>
							{ sprintf(
								/* translators: %s expands to Yoast SEO. */
								__( "Configure %s!", "wordpress-seo" ),
								"Yoast SEO"
							) }
						</h2>
						<p>
							{ sprintf(
								/* translators: %s expands to Yoast SEO. */
								__( "Set the essential %s settings in a few steps.", "wordpress-seo" ),
								"Yoast SEO"
							) }
						</p>
						<img
							src={ window.wpseoInstallationSuccess.pluginUrl + "/images/mirrored_fit_bubble_woman_1_optim.svg" }
							alt={ "" }
						/>
						<div className="card-button-section">
							<ButtonStyledLink
								id="installation-successful-configuration-workout-link"
								href={ window.wpseoInstallationSuccess.configurationWorkoutUrl }
								variant="primary"
							>
								{ __( "Start configuration workout!", "wordpress-seo" ) }
							</ButtonStyledLink>
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
