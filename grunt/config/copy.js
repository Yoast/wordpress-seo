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
	// The default de_CH is formal on WordPress.org, but that one is not translated enough for wordpress-seo.
	// So we need to copy the `-informal` so we have a good translation.
	"de_CH-informal": {
		files: [
			{
				src: "<%= paths.languages %>/<%= pkg.plugin.textdomain %>-de_CH-informal.po",
				dest: "<%= paths.languages %>/<%= pkg.plugin.textdomain %>-de_CH.po",
			},
			{
				src: "<%= paths.languages %>/<%= pkg.plugin.textdomain %>-de_CH-informal.json",
				dest: "<%= paths.languages %>/<%= pkg.plugin.textdomain %>-de_CH.json",
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
				dest: "<%= files.artifact %>",
			},
		],
	},
	"composer-artifact": {
		files: [ {
			expand: true,
			cwd: "<%= files.artifact %>",
			src: [
				"**/*",
			],
			dest: "<%= files.artifactComposer %>",
		} ],
	},
	"composer-files": {
		files: [ {
			expand: true,
			cwd: ".",
			src: [
				"composer.lock",
				"composer.json",
			],
			dest: "<%= files.artifactComposer %>",
		} ],
		"composer.lock": [ "<%= files.artifact %>/composer.lock" ],
		"composer.json": [ "<%= files.artifact %>/composer.json" ],
	},
};
