import domReady from "@wordpress/dom-ready";
import { __, sprintf } from "@wordpress/i18n";
import { renderReactRoot } from "./helpers/reactRoot";
import { setWordPressSeoL10n } from "./helpers/i18n";
import { ButtonStyledLink } from "@yoast/components";

setWordPressSeoL10n();

/**
 * The installation success page.
 *
 * @returns {WPElement} The installation success page.
 */
function InstallationSuccessPage() {
	return (
		<div className="installation-success-page">
			<div className="installation-success-steps">
				<p>stepper stuff</p>
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
