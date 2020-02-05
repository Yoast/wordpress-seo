// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	"js-dependencies": {
		files: [
			{
				expand: true,
				cwd: "node_modules/select2/dist/js/",
				src: [ "select2.full.min.js", "i18n/*", "!i18n/build.txt" ],
				dest: "js/dist/select2/",
			},
		],
	},
	"css-dependencies": {
		files: [
			{
				expand: true,
				cwd: "node_modules/select2/dist/css/",
				src: [ "select2.min.css" ],
				dest: "css/dist/select2",
			},
		],
	},
	"css-files": {
		files: [
			{
				expand: true,
				cwd: "css/src",
				src: [ "**.css" ],
				dest: "css/dist/",
				rename: ( dest, src ) => {
					return dest + src.replace( ".css", "-<%= pluginVersionSlug %>.css" );
				},
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
					return dest + src.replace( "wordpress-seo", "configuration-wizard.scss" );
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
	"makepot-yoast-js-analysis-report": {
		src: "gettext.pot",
		dest: "<%= files.pot.yoastJsAnalysisReport %>",
	},
	"makepot-yoast-js-components": {
		src: "gettext.pot",
		dest: "<%= files.pot.yoastJsComponents %>",
	},
	"makepot-yoast-js-configuration-wizard": {
		src: "gettext.pot",
		dest: "<%= files.pot.yoastJsConfigurationWizard %>",
	},
	"makepot-yoast-js-helpers": {
		src: "gettext.pot",
		dest: "<%= files.pot.yoastJsHelpers %>",
	},
	"makepot-yoast-js-search-metadata-previews": {
		src: "gettext.pot",
		dest: "<%= files.pot.yoastJsSearchMetadataPreviews %>",
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
					"config/**",
					"css/**/*.css",
					"css/main-sitemap.xsl",
					"deprecated/**",
					"frontend/**",
					"images/**",
					"inc/**",
					"cli/**",
					"js/vendor/**/*.js",
					"js/dist/**/*.js",
					"js/dist/select2/i18n/*.js",
					"languages/**",
					"src/**",
					"polyfills/**",
					"vendor/**",
					"vendor_prefixed/**/*.php",
					"vendor_prefixed/dependencies-prefixed.txt",
					"migrations/*.php",
					"migrations/ruckusing/**/why",
					"index.php",
					"license.txt",
					"readme.txt",
					"wp-seo.php",
					"wp-seo-main.php",
					"wpml-config.xml",
					"!vendor/bin/**",
					"!vendor/composer/installed.json",
					"!vendor/composer/installers/**",
					"!vendor/yoast/i18n-module/LICENSE",
					"!vendor/yoast/license-manager/samples/**",
					"!vendor/yoast/license-manager/class-theme-*",
					"!vendor_prefixed/ruckusing/config/**",
					"!vendor_prefixed/ruckusing/tests/**",
					"!vendor_prefixed/ruckusing/ruckus.php",
					"!vendor_prefixed/j4mie/idiorm/demo.php",
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
				"!vendor_prefixed/**",
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
