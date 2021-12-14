// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	"js-dependencies": {
		files: [
			{
				expand: true,
				cwd: "node_modules/select2/dist/js/",
				src: [ "select2.full.min.js", "i18n/*", "!i18n/build.txt" ],
				dest: "<%= paths.jsDist %>select2/",
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
	"makepot-yoast-js-social-metadata-forms": {
		src: "gettext.pot",
		dest: "<%= files.pot.yoastJsSocialMetadataForms %>",
	},
	"makepot-yoast-js-replacement-variable-editor": {
		src: "gettext.pot",
		dest: "<%= files.pot.yoastJsReplacementVariableEditor %>",
	},
	"makepot-yoastseojs": {
		src: "gettext.pot",
		dest: "<%= files.pot.yoastseojs %>",
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
					"css/dist/**/*.css",
					"css/main-sitemap.xsl",
					"deprecated/**",
					"frontend/**",
					"images/**",
					"packages/js/images/**",
					"inc/**",
					"<%= paths.jsDist %>/**/*.js",
					"languages/**",
					"src/**",
					"lib/**",
					"vendor/**",
					"vendor_prefixed/**/*.php",
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
					"!**/composer.json",
					"!**/README.md",
				],
				dest: "<%= files.artifact %>",
			},
		],
	},
};
