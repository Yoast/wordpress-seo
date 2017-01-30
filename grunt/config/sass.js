// https://github.com/sindresorhus/grunt-sass
"use strict";

module.exports = {
	build: {
		files: {
			"css/admin-global-<%= pluginVersion %>.css": [ "css/src/admin-global.scss" ],
			"css/adminbar-<%= pluginVersion %>.css": [ "css/src/adminbar.scss" ],
			"css/alerts-<%= pluginVersion %>.css": [ "css/src/alerts.scss" ],
			"css/dashboard-<%= pluginVersion %>.css": [ "css/src/dashboard.scss" ],
			"css/edit-page-<%= pluginVersion %>.css": [ "css/src/edit-page.scss" ],
			"css/featured-image-<%= pluginVersion %>.css": [ " css/src/featured-image.scss" ],
			"css/help-center-<%= pluginVersion %>.css": [ "css/src/help-center.scss" ],
			"css/inside-editor-<%= pluginVersion %>.css": [ "css/src/inside-editor.scss" ],
			"css/kb-search-<%= pluginVersion %>.css": [ "css/src/kb-search.scss" ],
			"css/metabox-<%= pluginVersion %>.css": [ "css/src/metabox.scss" ],
			"css/metabox-primary-category-<%= pluginVersion %>.css": [ "css/src/metabox-primary-category.scss" ],
			"css/snippet-<%= pluginVersion %>.css": [ "css/src/snippet.scss" ],
			"css/taxonomy-meta-<%= pluginVersion %>.css": [ "css/src/taxonomy-meta.scss" ],
			"css/toggle-switch-<%= pluginVersion %>.css": [ "css/src/toggle-switch.scss" ],
			"css/wpseo-dismissible-<%= pluginVersion %>.css": [ "css/src/wpseo-dismissible.scss" ],
			"css/yst_plugin_tools-<%= pluginVersion %>.css": [ "css/src/yst_plugin_tools.scss" ],
			"css/yoast-extensions-<%= pluginVersion %>.css": [ "css/src/extensions.scss" ],
			"css/yst_seo_score-<%= pluginVersion %>.css": [ "css/src/yst_seo_score.scss" ],
			"css/yoast-components-<%= pluginVersion %>.css": [ "css/src/yoast-components.scss" ],
		},
	},
};
