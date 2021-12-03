import domReady from "@wordpress/dom-ready";
import { __ } from "@wordpress/i18n";
import { renderReactRoot } from "./helpers/reactRoot";
import { setWordPressSeoL10n } from "./helpers/i18n";
import { ButtonStyledLink } from "@yoast/components";

setWordPressSeoL10n();

/**
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
				<div className="installation-success-card">
					<h2>{ __( "Your site is now easy to find for search engines!", "wordpress-seo" ) }</h2>
					<p>
						{ __( "Yoast SEO rolls out the red carpet for the search bots, which helps your site perform better in search engines.", "wordpress-seo" ) }
					</p>
				</div>
				<div className="installation-success-card">
					<h2>{ __( "Configure Yoast SEO", "wordpress-seo" ) }</h2>
					<p>
						{ __( "Set the essential Yoast SEO settings in a few steps.", "wordpress-seo" ) }
					</p>
					<div className="card-button-section">
						<ButtonStyledLink
							href={ window.wp.api.utils.getRootUrl() + "wp-admin/admin.php?page=wpseo_workouts#configuration" }
							variant="primary"
						>
							{ __( "Start configuration workout!", "wordpress-seo" ) }
						</ButtonStyledLink>
					</div>
				</div>
			</div>
		</div>
	);
}

domReady( () => {
	renderReactRoot( "wpseo-installation-successful-free", <InstallationSuccessPage /> );
} );
