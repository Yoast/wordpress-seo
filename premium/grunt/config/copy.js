// https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	css_social_previews: {
		files: {
			'assets/dist/social_preview/twitter-placeholder.svg': [ 'node_modules/yoast-social-previews/dist/twitter-placeholder.svg' ],
			'assets/dist/social_preview/yoast-social-preview-390.min.css': [ 'node_modules/yoast-social-previews/dist/yoast-social-preview.min.css' ]
		}
	},
	artifact: {
		files: [
			{
				expand: true,
				cwd: "..",
				src: [
					"wp-seo-premium.php",
					"premium/class-premium.php",

					"premium/classes/**",
					"premium/languages/**",
					"premium/assets/dist/**",
					"premium/css/dist/**/*.min.css",
					"premium/js/dist/**/*.min.js",

					"!premium/languages/wordpress-seo-premium.pot",
				],
				dest: "artifact",
			},
		],
	},
};
