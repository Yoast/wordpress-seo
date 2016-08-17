module.exports = {
	build: {
		options: {
			transform: [
				[ "babelify", { presets: [ "es2015" ] } ],
			],
		},
		files: {
			"js/dist/wp-seo-admin-340.js": [ "js/src/wp-seo-admin.js" ],
			"js/dist/wp-seo-admin-global-340.js": [ "js/src/wp-seo-admin-global.js" ],
			"js/dist/wp-seo-admin-gsc-340.js": [ "js/src/wp-seo-admin-gsc.js" ],
			"js/dist/wp-seo-admin-media-320.js": [ "js/src/wp-seo-admin-media.js" ],
			"js/dist/wp-seo-bulk-editor-340.js": [ "js/src/wp-seo-bulk-editor.js" ],
			"js/dist/wp-seo-dismissible-330.js": [ "js/src/wp-seo-dismissible.js" ],
			"js/dist/wp-seo-featured-image-330.js": [ "js/src/wp-seo-featured-image.js" ],
			"js/dist/wp-seo-metabox-340.js": [ "js/src/wp-seo-metabox.js" ],
			"js/dist/wp-seo-metabox-category-340.js": [ "js/src/wp-seo-metabox-category.js" ],
			"js/dist/wp-seo-post-scraper-341.js": [ "js/src/wp-seo-post-scraper.js" ],
			"js/dist/wp-seo-recalculate-340.js": [ "js/src/wp-seo-recalculate.js" ],
			"js/dist/wp-seo-replacevar-plugin-330.js": [ "js/src/wp-seo-replacevar-plugin.js" ],
			"js/dist/wp-seo-shortcode-plugin-340.js": [ "js/src/wp-seo-shortcode-plugin.js" ],
			"js/dist/wp-seo-term-scraper-341.js": [ "js/src/wp-seo-term-scraper.js" ],
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
