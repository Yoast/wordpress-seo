module.exports = {
	build: {
		options: {
			transform: [
				['babelify', { presets: ['es2015']}]
			],
		},
		files: {
			"assets/js/dist/yoast-premium-social-preview-350.js": [ "assets/js/src/yoast-premium-social-preview.js" ],
			"assets/js/dist/wp-seo-premium-multi-keyword-350.js": [ "assets/js/src/multi-keyword.js" ],
			"assets/js/dist/wpseo-premium-contact-support-350.js": [ "assets/js/src/contact-support.js" ],
			"assets/js/dist/wp-seo-premium-admin-redirects-350.js": [ "assets/js/src/admin-redirects.js" ],
			"assets/js/dist/wp-seo-premium-custom-fields-plugin-350.js": [ "assets/js/src/custom-fields-plugin.js" ],
			"assets/js/dist/wp-seo-premium-quickedit-notification-352.js": [ "assets/js/src/quickedit-notification.js" ],
			"assets/js/dist/wpseo-premium-yoast-overlay-350.js": [ "assets/js/src/yoast-overlay.js" ],
			"assets/js/dist/wp-seo-premium-redirect-notifications-352.js": [ "assets/js/src/redirect-notifications.js" ],
		},
	},
};
