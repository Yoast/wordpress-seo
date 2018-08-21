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
	"json-translations": {
		files: [
			{
				expand: true,
				cwd: "languages/",
				src: [ "wordpress-seo-*.json" ],
				dest: "languages/",
				rename: ( dest, src ) => {
					return dest + src.replace( "wordpress-seo", "yoast-components" );
				},
			},
			{
				expand: true,
				cwd: "languages/",
				src: [ "wordpress-seo-*.json" ],
				dest: "languages/",
				rename: ( dest, src ) => {
					return dest + src.replace( "wordpress-seo", "wordpress-seojs" );
				},
			},
		],
	},
	"makepot-wordpress-seo": {
		src: "gettext.pot",
		dest: "<%= files.pot.wordpressSeoJs %>",
	},
	artifact: {
		files: [
			{
				expand: true,
				cwd: ".",
				src: [
					"admin/**",
					"css/**/*.min.css",
					"css/main-sitemap.xsl",
					"deprecated/**",
					"frontend/**",
					"images/**",
					"inc/**",
					"cli/**",
					"js/vendor/**/*.js",
					"js/dist/**/*.min.js",
					"js/dist/select2/i18n/*.js",
					"languages/**",
					"vendor/**",
					"index.php",
					"license.txt",
					"readme.txt",
					"wp-seo.php",
					"wp-seo-main.php",
					"wpml-config.xml",
					"!vendor/bin",
					"!vendor/composer/installed.json",
					"!vendor/composer/installers/**",
					"!vendor/yoast/i18n-module/LICENSE",
					"!vendor/yoast/license-manager/samples/**",
					"!vendor/yoast/license-manager/class-theme-*",
					"!**/composer.json",
					"!**/README.md",
				],
				dest: "artifact",
			},
		],
	},
};
