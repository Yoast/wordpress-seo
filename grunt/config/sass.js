// https://github.com/sindresorhus/grunt-sass
"use strict";

module.exports = {
	build: {
		files: {
			"css/admin-global-<%= pluginVersionSlug %>.css": [ "css/src/admin-global.scss" ],
			"css/adminbar-<%= pluginVersionSlug %>.css": [ "css/src/adminbar.scss" ],
			"css/alerts-<%= pluginVersionSlug %>.css": [ "css/src/alerts.scss" ],
			"css/dashboard-<%= pluginVersionSlug %>.css": [ "css/src/dashboard.scss" ],
			"css/edit-page-<%= pluginVersionSlug %>.css": [ "css/src/edit-page.scss" ],
			"css/featured-image-<%= pluginVersionSlug %>.css": [ " css/src/featured-image.scss" ],
			"css/help-center-<%= pluginVersionSlug %>.css": [ "css/src/help-center.scss" ],
			"css/inside-editor-<%= pluginVersionSlug %>.css": [ "css/src/inside-editor.scss" ],
			"css/kb-search-<%= pluginVersionSlug %>.css": [ "css/src/kb-search.scss" ],
			"css/metabox-<%= pluginVersionSlug %>.css": [ "css/src/metabox.scss" ],
			"css/metabox-primary-category-<%= pluginVersionSlug %>.css": [ "css/src/metabox-primary-category.scss" ],
			"css/snippet-<%= pluginVersionSlug %>.css": [ "css/src/snippet.scss" ],
			"css/toggle-switch-<%= pluginVersionSlug %>.css": [ "css/src/toggle-switch.scss" ],
			"css/wpseo-dismissible-<%= pluginVersionSlug %>.css": [ "css/src/wpseo-dismissible.scss" ],
			"css/yst_plugin_tools-<%= pluginVersionSlug %>.css": [ "css/src/yst_plugin_tools.scss" ],
			"css/yoast-extensions-<%= pluginVersionSlug %>.css": [ "css/src/extensions.scss" ],
			"css/yst_seo_score-<%= pluginVersionSlug %>.css": [ "css/src/yst_seo_score.scss" ],
			"css/yoast-components-<%= pluginVersionSlug %>.css": [ "css/src/yoast-components.scss" ],
		},
	},
};
