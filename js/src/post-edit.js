import initTabs from "./initializers/metabox-tabs";
import initPrimaryCategory from "./initializers/primary-category";
import initPostScraper from "./initializers/post-scraper";
import initFeaturedImageIntegration from "./initializers/featured-image";
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";

initTabs( jQuery );

if ( typeof wpseoPrimaryCategoryL10n !== "undefined" ){
	initPrimaryCategory( jQuery );
}

initPostScraper( jQuery );

if ( wpseoScriptData && typeof wpseoScriptData.featuredImage !== "undefined" ){
	initFeaturedImageIntegration( jQuery );
}

initAdminMedia( jQuery );
initAdmin( jQuery );
