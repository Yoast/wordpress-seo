// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	dependencies: {
		files: [
			{
				expand: true,
				cwd: "node_modules/select2/dist/js/",
				src: [ "select2.full.min.js", "i18n/*", "!i18n/build.txt" ],
				dest: "js/dist/select2/",
			},
			{
				expand: true,
				cwd: "node_modules/select2/dist/css/",
				src: [ "select2.min.css" ],
				dest: "css/dist/select2",
			},
		],
	},
	artifact: {
		files: [
			{
				expand: true,
				cwd: ".",
				src: [
					"admin/**",
					"css/**/*.min.css",
					"css/xml-sitemap-xsl.php",
					"deprecated/**",
					"frontend/**",
					"images/**",
					"inc/**",
					"js/dist/**/*.min.js",
					"js/dist/select2/i18n/*.js",
					"languages/**",
					"src/**",
					"vendor/**",
					"vendor_prefixed/**/*.php",
					"migrations/*.php",
					"index.php",
					"license.txt",
					"readme.txt",
					"wp-seo.php",
					"wp-seo-main.php",
					"wpml-config.xml",

					"!languages/wordpress-seo.pot",
					"!vendor/bin",
					"!vendor/composer/installed.json",
					"!vendor/composer/installers/**",
					"!vendor/yoast/i18n-module/LICENSE",
					"!vendor/yoast/license-manager/samples/**",
					"!vendor/yoast/license-manager/class-theme-*",
					"!vendor_prefixed/ruckusing/config/**",
					"!vendor_prefixed/ruckusing/tests/**",
					"!vendor_prefixed/ruckusing/ruckus.php",
					"!**/composer.json",
					"!**/README.md",
				],
				dest: "artifact",
			},
		],
	},
};
