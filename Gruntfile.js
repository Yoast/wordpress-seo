/* global require, process */
var timeGrunt = require( "time-grunt" );
var path = require( "path" );
var loadGruntConfig = require( "load-grunt-config" );
const { flattenVersionForFile } = require( "./config/webpack/paths" );
require( "dotenv" ).config();

module.exports = function( grunt ) {
	timeGrunt( grunt );

	const pkg = grunt.file.readJSON( "package.json" );
	const pluginVersion = pkg.yoast.pluginVersion;

	/* Used to switch between development and release builds.
	Switches based on the grunt command (which is the third 'argv', after node and grunt,  so index 2).*/
	const developmentBuild = ! [ "create-rc", "release", "release:js", "artifact", "deploy:trunk", "deploy:master" ].includes( process.argv[ 2 ] );

	// Define project configuration.
	const project = {
		developmentBuild,
		pluginVersion,
		pluginVersionSlug: flattenVersionForFile( pluginVersion ),
		pluginSlug: "wordpress-seo",
		pluginMainFile: "wp-seo.php",
		paths: {
			/**
			 * Gets the config path.
			 *
			 * @returns {string} Config path.
			 */
			get config() {
				return this.grunt + "task-config/";
			},
			css: "css/dist/",
			grunt: "config/grunt/",
			images: "images/",
			js: "packages/js/src/",
			jsDist: "js/dist/",
			logs: "logs/",
			svnCheckoutDir: ".wordpress-svn",
			assets: "svn-assets",
			vendor: "vendor/",
			vendorPrefixed: "vendor_prefixed/",
		},
		files: {
			css: [
				"css/src/*.css",
			],
			cssMap: [
				"css/dist/*.css.map",
			],
			js: [
				"packages/js/src/**/*.js",
			],
			jsTests: [
				"packages/js/tests/**/*.js",
			],
			php: [
				"*.php",
				"admin/**/*.php",
				"frontend/**/*.php",
				"inc/**/*.php",
				"src/**/*.php",
				"config/**/*.php",
			],
			versionFiles: [
				"package.json",
				"wp-seo-main.php",
				"wp-seo.php",
			],
			pot: {

				/*
				 * Yoast JS are the @yoast JavaScript packages.
				 * They (currently) have the `yoast-components` textdomain.
				 * They get combined with the `yoastComponents` translations to one yoast-components.pot file.
				 */
				yoastJsAnalysisReport: "<%= paths.languages %>yoast-js-analysis-report.pot",
				yoastJsComponents: "<%= paths.languages %>yoast-js-components.pot",
				yoastJsConfigurationWizard: "<%= paths.languages %>yoast-js-configuration-wizard.pot",
				yoastJsHelpers: "<%= paths.languages %>yoast-js-helpers.pot",
				yoastJsSearchMetadataPreviews: "<%= paths.languages %>yoast-js-search-metadata-previews.pot",
				yoastJsSocialMetadataForms: "<%= paths.languages %>yoast-js-social-metadata-forms.pot",
				yoastJsReplacementVariableEditor: "<%= paths.languages %>yoast-js-replacement-variable-editor.pot",

				yoastseojs: "<%= paths.languages %>yoast-seo-js.pot",
				yoastComponents: "<%= paths.languages %>yoast-components.pot",
				yoastComponentsConfigurationWizard: "<%= paths.languages %>yoast-components1.pot",
				yoastComponentsRemaining: "gettext.pot",
				wordpressSeoJs: "<%= paths.languages %>wordpress-seojs.pot",

				php: {
					yoastseojs: "<%= paths.languages %>yoast-seo-js.php",
					yoastComponents: "<%= paths.languages %>yoast-components.php",
					wordpressSeoJs: "<%= paths.languages %>wordpress-seojs.php",
				},
			},
			artifact: "artifact",
			artifactComposer: "artifact-composer",
			phptests: "tests/**/*.php",
			/**
			 * Gets the config path glob.
			 *
			 * @returns {string} Config path glob.
			 */
			get config() {
				return project.paths.config + "*.js";
			},
			/**
			 * Gets the changelog path file.
			 *
			 * @returns {string} Changelog path file.
			 */
			get changelog() {
				return project.paths.theme + "changelog.txt";
			},
			grunt: "Gruntfile.js",
		},
		pkg,
	};

	// Load Grunt configurations and tasks.
	loadGruntConfig( grunt, {
		configPath: path.join( process.cwd(), "node_modules/@yoast/grunt-plugin-tasks/config/" ),
		overridePath: path.join( process.cwd(), project.paths.config ),
		data: project,
		jitGrunt: {
			staticMappings: {
				addtextdomain: "grunt-wp-i18n",
				makepot: "grunt-wp-i18n",
				/* eslint-disable-next-line camelcase */
				glotpress_download: "grunt-glotpress",
				gittag: "grunt-git",
				gitfetch: "grunt-git",
				gitadd: "grunt-git",
				gitstatus: "grunt-git",
				gitcommit: "grunt-git",
				gitcheckout: "grunt-git",
				gitpull: "grunt-git",
				gitpush: "grunt-git",
				postcss: "@lodder/grunt-postcss",
				"update-version": "@yoast/grunt-plugin-tasks",
				"set-version": "@yoast/grunt-plugin-tasks",
				"update-changelog-with-latest-pr-texts": "@yoast/grunt-plugin-tasks",
				"get-latest-pr-texts": "@yoast/grunt-plugin-tasks",
				"update-changelog": "@yoast/grunt-plugin-tasks",
				"build-qa-changelog": "@yoast/grunt-plugin-tasks",
				"download-qa-changelog": "@yoast/grunt-plugin-tasks",
				"extract-extra-pr-texts-from-yoast-cli-md": "@yoast/grunt-plugin-tasks",
				"update-package-changelog": "@yoast/grunt-plugin-tasks",
				"update-changelog-to-latest": "@yoast/grunt-plugin-tasks",
				"register-prompt": "grunt-prompt",
				"notify-slack": "notify-slack",
			},
			customTasksDir: "config/grunt/custom-tasks",
		},
	} );
};
