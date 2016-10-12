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
			"assets/js/dist/yoast-premium-social-preview-370.js": [ "assets/js/src/yoast-premium-social-preview.js" ],
			"assets/js/dist/wpseo-premium-contact-support-370.js": [ "assets/js/src/contact-support.js" ],
			"assets/js/dist/wp-seo-premium-admin-redirects-370.js": [ "assets/js/src/admin-redirects.js" ],
			"assets/js/dist/wp-seo-premium-custom-fields-plugin-350.js": [ "assets/js/src/custom-fields-plugin.js" ],
			"assets/js/dist/wp-seo-premium-quickedit-notification-352.js": [ "assets/js/src/quickedit-notification.js" ],
			"assets/js/dist/wpseo-premium-yoast-overlay-350.js": [ "assets/js/src/yoast-overlay.js" ],
			"assets/js/dist/wp-seo-premium-redirect-notifications-352.js": [ "assets/js/src/redirect-notifications.js" ],
			"assets/js/dist/wp-seo-premium-metabox-370.js": [ "assets/js/src/metabox.js" ],
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
