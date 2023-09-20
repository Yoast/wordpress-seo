/**
 * Redirects requests to the old features dashboard tab to the new settins page.
 *
 * @returns {void}
 */
function redirectOldFeaturesTabToNewSettings() {
	if ( window.location.hash === "#top#features" ) {
		const fullUrl = window.location.href;
		const newUrl = fullUrl.replace( "wpseo_dashboard#top#features", "wpseo_page_settings#/site-features" );
		window.location.replace( newUrl );
	}
}

window.wpseoRedirectOldFeaturesTabToNewSettings = redirectOldFeaturesTabToNewSettings;
