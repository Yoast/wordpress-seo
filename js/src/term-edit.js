import initTabs from "./initializers/metabox-tabs";
import initTermScraper from "./initializers/term-scraper";
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";

// Backwards compatibility globals.
window.wpseoTermScraperL10n = wpseoScriptData.metabox;

initAdmin( jQuery );
initTabs( jQuery );
initTermScraper( jQuery );
initAdminMedia( jQuery );
