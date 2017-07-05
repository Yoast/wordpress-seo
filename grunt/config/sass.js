// https://github.com/sindresorhus/grunt-sass
"use strict";

module.exports = {
	build: {
		files: {
			"dist/css/admin-global-<%= pluginVersionSlug %>.css": [ "css/src/admin-global.scss" ],
			"dist/css/adminbar-<%= pluginVersionSlug %>.css": [ "css/src/adminbar.scss" ],
			"dist/css/alerts-<%= pluginVersionSlug %>.css": [ "css/src/alerts.scss" ],
			"dist/css/dashboard-<%= pluginVersionSlug %>.css": [ "css/src/dashboard.scss" ],
			"dist/css/edit-page-<%= pluginVersionSlug %>.css": [ "css/src/edit-page.scss" ],
			"dist/css/featured-image-<%= pluginVersionSlug %>.css": [ " css/src/featured-image.scss" ],
			"dist/css/help-center-<%= pluginVersionSlug %>.css": [ "css/src/help-center.scss" ],
			"dist/css/inside-editor-<%= pluginVersionSlug %>.css": [ "css/src/inside-editor.scss" ],
			"dist/css/kb-search-<%= pluginVersionSlug %>.css": [ "css/src/kb-search.scss" ],
			"dist/css/metabox-<%= pluginVersionSlug %>.css": [ "css/src/metabox.scss" ],
			"dist/css/metabox-primary-category-<%= pluginVersionSlug %>.css": [ "css/src/metabox-primary-category.scss" ],
			"dist/css/snippet-<%= pluginVersionSlug %>.css": [ "css/src/snippet.scss" ],
			"dist/css/toggle-switch-<%= pluginVersionSlug %>.css": [ "css/src/toggle-switch.scss" ],
			"dist/css/wpseo-dismissible-<%= pluginVersionSlug %>.css": [ "css/src/wpseo-dismissible.scss" ],
			"dist/css/yst_plugin_tools-<%= pluginVersionSlug %>.css": [ "css/src/yst_plugin_tools.scss" ],
			"dist/css/yoast-extensions-<%= pluginVersionSlug %>.css": [ "css/src/extensions.scss" ],
			"dist/css/yst_seo_score-<%= pluginVersionSlug %>.css": [ "css/src/yst_seo_score.scss" ],
			"dist/css/yoast-components-<%= pluginVersionSlug %>.css": [ "css/src/yoast-components.scss" ],
		},
	},
};
