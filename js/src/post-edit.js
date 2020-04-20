import initTabs from "./initializers/metabox-tabs";
import initPrimaryCategory from "./initializers/primary-category";
import initPostScraper from "./initializers/post-scraper";
import initFeaturedImageIntegration from "./initializers/featured-image";
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";

// Backwards compatibility globals.
window.wpseoPostScraperL10n = window.wpseoScriptData.metabox;

initTabs( jQuery );

if ( typeof wpseoPrimaryCategoryL10n !== "undefined" ) {
	initPrimaryCategory( jQuery );
}

initPostScraper( jQuery );

if ( window.wpseoScriptData && typeof window.wpseoScriptData.featuredImage !== "undefined" ) {
	initFeaturedImageIntegration( jQuery );
}

initAdminMedia( jQuery );
initAdmin( jQuery );
