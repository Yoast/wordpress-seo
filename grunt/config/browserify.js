module.exports = {
	build: {
		options: {
			transform: [
				[ "babelify", { presets: [ "es2015" ] } ],
			],
			browserifyOptions: {
				debug: true,
			},
		},
		files: {
			"js/dist/configuration-wizard-<%= pluginVersionSlug %>.js": [ "js/src/configuration-wizard.js" ],
			"js/dist/wp-seo-admin-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-admin.js" ],
			"js/dist/wp-seo-admin-global-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-admin-global.js" ],
			"js/dist/wp-seo-admin-gsc-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-admin-gsc.js" ],
			"js/dist/wp-seo-admin-media-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-admin-media.js" ],
			"js/dist/wp-seo-bulk-editor-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-bulk-editor.js" ],
			"js/dist/wp-seo-dismissible-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-dismissible.js" ],
			"js/dist/wp-seo-featured-image-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-featured-image.js" ],
			"js/dist/wp-seo-metabox-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-metabox.js" ],
			"js/dist/wp-seo-metabox-category-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-metabox-category.js" ],
			"js/dist/wp-seo-post-scraper-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-post-scraper.js" ],
			"js/dist/wp-seo-recalculate-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-recalculate.js" ],
			"js/dist/wp-seo-replacevar-plugin-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-replacevar-plugin.js" ],
			"js/dist/wp-seo-shortcode-plugin-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-shortcode-plugin.js" ],
			"js/dist/wp-seo-term-scraper-<%= pluginVersionSlug %>.js": [ "js/src/wp-seo-term-scraper.js" ],
		},
	},
	"release-es6": {
		options: {
			transform: [
				[ "babelify", { presets: [ "es2015" ] } ],

				// This is here to make a production build of React.
				[ "envify", {
					// This makes sure we also transform the React files.
					global: true,
					NODE_ENV: "production",
				} ],
			],
		},
		files: "<%= browserify.build.files %>",
	},
};
