module.exports = {
	build: {
		options: {
			transform: [
				['babelify', { presets: ['es2015']}]
			],
		},
		files: {
			"assets/js/dist/yoast-premium-social-preview-340.js": [ "assets/js/src/yoast-premium-social-preview.js" ],
			"assets/js/dist/wp-seo-premium-multi-keyword-341.js": [ "assets/js/src/multi-keyword.js" ],
			"assets/js/dist/wpseo-premium-contact-support.js": [ "assets/js/src/contact-support.js" ],
			"assets/js/dist/wp-seo-premium-admin-redirects-340.js": [ "assets/js/src/admin-redirects.js" ],
			"assets/js/dist/wp-seo-premium-custom-fields-plugin.js": [ "assets/js/src/custom-fields-plugin.js" ],
			"assets/js/dist/wp-seo-premium-quickedit-notification-330.js": [ "assets/js/src/quickedit-notification.js" ],
			"assets/js/dist/wpseo-premium-yoast-overlay.js": [ "assets/js/src/yoast-overlay.js" ]
		},
	},
};
