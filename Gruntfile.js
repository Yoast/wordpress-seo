/* global require, process */
var timeGrunt = require( "time-grunt" );
var path = require( "path" );
var loadGruntConfig = require( "load-grunt-config" );
const { flattenVersionForFile } = require( "./webpack/paths" );

global.developmentBuild = true;

module.exports = function( grunt ) {
	timeGrunt( grunt );

	const pkg = grunt.file.readJSON( "package.json" );
	const pluginVersion = pkg.yoast.pluginVersion;

	// Define project configuration
	var project = {
		pluginVersion: pluginVersion,
		pluginSlug: "wordpress-seo",
		pluginMainFile: "wp-seo.php",
		paths: {
			/**
			 * Gets the config path.
			 *
			 * @returns {string} Config path.
			 */
			get config() {
				return this.grunt + "config/";
			},
			css: "css/dist/",
			sass: "css/src/",
			grunt: "grunt/",
			images: "images/",
			js: "js/src/",
			languages: "languages/",
			logs: "logs/",
			svnCheckoutDir: ".wordpress-svn",
			vendor: "vendor/",
		},
		files: {
			sass: [ "<%= paths.sass %>*.scss" ],
			css: [
				"css/dist/*.css",
			],
			js: [
				"js/src/**/*.js",
			],
			jsTests: [
				"js/tests/**/*.js",
			],
			php: [
				"*.php",
				"admin/**/*.php",
				"frontend/**/*.php",
				"inc/**/*.php",
			],
			pot: {
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
		sassFiles: {
			"css/dist/admin-global-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/admin-global.scss" ],
			"css/dist/adminbar-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/adminbar.scss" ],
			"css/dist/alerts-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/alerts.scss" ],
			"css/dist/dashboard-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/dashboard.scss" ],
			"css/dist/edit-page-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/edit-page.scss" ],
			"css/dist/featured-image-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ " css/src/featured-image.scss" ],
			"css/dist/inside-editor-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/inside-editor.scss" ],
			"css/dist/metabox-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/metabox.scss" ],
			"css/dist/metabox-primary-category-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/metabox-primary-category.scss" ],
			"css/dist/toggle-switch-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/toggle-switch.scss" ],
			"css/dist/wpseo-dismissible-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/wpseo-dismissible.scss" ],
			"css/dist/yst_plugin_tools-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/yst_plugin_tools.scss" ],
			"css/dist/yoast-extensions-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/extensions.scss" ],
			"css/dist/yst_seo_score-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/yst_seo_score.scss" ],
			"css/dist/yoast-components-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/yoast-components.scss" ],
			"css/dist/filter-explanation-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/filter-explanation.scss" ],
			"css/dist/search-appearance-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/search-appearance.scss" ],
			"css/dist/structured-data-blocks-<%= pluginVersionSlug %><%= pluginAssetSuffix %>.css": [ "css/src/structured-data-blocks.scss" ],
		},
		pkg,
	};

	// Used to switch between development and release builds.
	if ( [ "release", "release:js", "artifact", "deploy:trunk", "deploy:master" ].includes( process.argv[ 2 ] ) ) {
		global.developmentBuild = false;
	}

	project.pluginVersionSlug = flattenVersionForFile( pluginVersion );
	project.pluginAssetSuffix = global.developmentBuild ? "" : ".min";

	// Load Grunt configurations and tasks
	loadGruntConfig( grunt, {
		configPath: path.join( process.cwd(), "node_modules/@yoast/grunt-plugin-tasks/config/" ),
		overridePath: path.join( process.cwd(), project.paths.config ),
		data: project,
		jitGrunt: {
			staticMappings: {
				addtextdomain: "grunt-wp-i18n",
				makepot: "grunt-wp-i18n",
				glotpress_download: "grunt-glotpress",
				"update-version": "@yoast/grunt-plugin-tasks",
				"set-version": "@yoast/grunt-plugin-tasks",
			},
			customTasksDir: "grunt/custom",
		},
	} );
};
