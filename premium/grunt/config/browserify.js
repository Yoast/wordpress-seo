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
			"assets/js/dist/yoast-premium-site-wide-analysis-<%= pluginVersionSlug %>.js": [ "assets/js/src/site-wide-analysis.js" ],
			"assets/js/dist/yoast-premium-social-preview-<%= pluginVersionSlug %>.js": [ "assets/js/src/yoast-premium-social-preview.js" ],
			"assets/js/dist/wpseo-premium-contact-support-<%= pluginVersionSlug %>.js": [ "assets/js/src/contact-support.js" ],
			"assets/js/dist/wp-seo-premium-admin-redirects-<%= pluginVersionSlug %>.js": [ "assets/js/src/admin-redirects.js" ],
			"assets/js/dist/wp-seo-premium-custom-fields-plugin-<%= pluginVersionSlug %>.js": [ "assets/js/src/custom-fields-plugin.js" ],
			"assets/js/dist/wp-seo-premium-quickedit-notification-<%= pluginVersionSlug %>.js": [ "assets/js/src/quickedit-notification.js" ],
			"assets/js/dist/wpseo-premium-yoast-overlay-<%= pluginVersionSlug %>.js": [ "assets/js/src/yoast-overlay.js" ],
			"assets/js/dist/wp-seo-premium-redirect-notifications-<%= pluginVersionSlug %>.js": [ "assets/js/src/redirect-notifications.js" ],
			"assets/js/dist/yoast-premium-gsc-<%= pluginVersionSlug %>.js": [ "assets/js/src/google-search-console.js" ],
			"assets/js/dist/wp-seo-premium-metabox-<%= pluginVersionSlug %>.js": [ "assets/js/src/metabox.js" ],
		},
	},
	"release-es6": {
		options: {
			transform: [
				[ "babelify", { presets: [ "es2015" ] } ],

				// This is here to make a production build of React.
				[ "envify", {
					global: true,
					NODE_ENV: "production",
				} ],
			],
		},
		files: "<%= browserify.build.files %>",
	},
};
