// https://github.com/sindresorhus/grunt-sass
"use strict";

module.exports = {
	build: {
		files: {
			"css/dist/admin-global-<%= pluginVersionSlug %>.css": [ "css/src/admin-global.scss" ],
			"css/dist/adminbar-<%= pluginVersionSlug %>.css": [ "css/src/adminbar.scss" ],
			"css/dist/alerts-<%= pluginVersionSlug %>.css": [ "css/src/alerts.scss" ],
			"css/dist/dashboard-<%= pluginVersionSlug %>.css": [ "css/src/dashboard.scss" ],
			"css/dist/edit-page-<%= pluginVersionSlug %>.css": [ "css/src/edit-page.scss" ],
			"css/dist/featured-image-<%= pluginVersionSlug %>.css": [ " css/src/featured-image.scss" ],
			"css/dist/inside-editor-<%= pluginVersionSlug %>.css": [ "css/src/inside-editor.scss" ],
			"css/dist/metabox-<%= pluginVersionSlug %>.css": [ "css/src/metabox.scss" ],
			"css/dist/metabox-primary-category-<%= pluginVersionSlug %>.css": [ "css/src/metabox-primary-category.scss" ],
			"css/dist/snippet-<%= pluginVersionSlug %>.css": [ "css/src/snippet.scss" ],
			"css/dist/toggle-switch-<%= pluginVersionSlug %>.css": [ "css/src/toggle-switch.scss" ],
			"css/dist/wpseo-dismissible-<%= pluginVersionSlug %>.css": [ "css/src/wpseo-dismissible.scss" ],
			"css/dist/yst_plugin_tools-<%= pluginVersionSlug %>.css": [ "css/src/yst_plugin_tools.scss" ],
			"css/dist/yoast-extensions-<%= pluginVersionSlug %>.css": [ "css/src/extensions.scss" ],
			"css/dist/yst_seo_score-<%= pluginVersionSlug %>.css": [ "css/src/yst_seo_score.scss" ],
			"css/dist/yoast-components-<%= pluginVersionSlug %>.css": [ "css/src/yoast-components.scss" ],
			"css/dist/filter-explanation-<%= pluginVersionSlug %>.css": [ "css/src/filter-explanation.scss" ],
			"css/dist/search-appearance-<%= pluginVersionSlug %>.css": [ "css/src/search-appearance.scss" ],
			"css/dist/structured-data-blocks-<%= pluginVersionSlug %>.css": [ "css/src/structured-data-blocks.scss" ],
		},
	},
};
