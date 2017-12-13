/* global require, module */
const path = require( "path" );

const jsDistPath = path.resolve( "js", "dist" );
const jsSrcPath = path.resolve( "js", "src" );
const cssDistPath = path.resolve( "css", "dist" );

// Output filename: Entry file (relative to jsSrcPath)
const entryAll = {
	"configuration-wizard": "./configuration-wizard.js",
	"wp-seo-admin-global": "./wp-seo-admin-global.js",
	"wp-seo-admin-gsc": "./wp-seo-admin-gsc.js",
	"wp-seo-admin-media": "./wp-seo-admin-media.js",
	"wp-seo-admin": "./wp-seo-admin.js",
	"wp-seo-babel-polyfill": "./wp-seo-babel-polyfill.js",
	"wp-seo-bulk-editor": "./wp-seo-bulk-editor.js",
	"wp-seo-edit-page": "./wp-seo-edit-page.js",
	"wp-seo-featured-image": "./wp-seo-featured-image.js",
	"wp-seo-metabox-category": "./wp-seo-metabox-category.js",
	"wp-seo-metabox": "./wp-seo-metabox.js",
	"wp-seo-post-scraper": "./wp-seo-post-scraper.js",
	"wp-seo-recalculate": "./wp-seo-recalculate.js",
	"wp-seo-reindex-links": "./wp-seo-reindex-links.js",
	"wp-seo-replacevar-plugin": "./wp-seo-replacevar-plugin.js",
	"wp-seo-shortcode-plugin": "./wp-seo-shortcode-plugin.js",
	"wp-seo-term-scraper": "./wp-seo-term-scraper.js",
	"wp-seo-api": "./wp-seo-api.js",
	"wp-seo-dashboard-widget": "./wp-seo-dashboard-widget.js",
	"wp-seo-filter-explanation": "./wp-seo-filter-explanation.js",
};

// Output filename: Entry file (relative to jsSrcPath)
const entry = {
	"configuration-wizard": "./configuration-wizard.js",
	"wp-seo-dashboard-widget": "./wp-seo-dashboard-widget.js",
	"wp-seo-help-center": "./wp-seo-help-center.js",
	"wp-seo-metabox": "./wp-seo-metabox.js",
};

module.exports = {
	entry,
	entryAll,
	jsDist: jsDistPath,
	jsSrc: jsSrcPath,
	cssDist: cssDistPath,
	select2: path.resolve( "node_modules", "select2", "dist" ),
};
