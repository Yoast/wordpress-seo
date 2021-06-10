const path = require( "path" );

// See https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
	/**
	 * Will throw an error if there are uncommitted changes.
	 *
	 * @param {*}        error     A potential error in calling in the git status --porcelain command.
	 * @param {*}        stdout    The response if no errors.
	 * @param {*}        stderr    A stderr.
	 * @param {Function} callback  The callback function.
	 *
	 * @returns {void}
	 */
	function throwUncommittedChangesError( error, stdout, stderr, callback ) {
		if ( stdout ) {
			throw "You have uncommitted changes. Commit, stash or reset the above files.";
		} else {
			grunt.log.ok( "You have no uncommitted changes. Continuing..." );
		}
		callback();
	}

	// Temporarily disable require-jsdoc due to the structure of the code below.
	/* eslint-disable require-jsdoc */
	return {
		"combine-pot-files": {
			fromFiles: [
				"languages/<%= pkg.plugin.textdomain %>-temp.pot",
				"<%= files.pot.yoastseojs %>",
				"<%= files.pot.yoastComponents %>",
			],
			toFile: "languages/<%= pkg.plugin.textdomain %>.pot",
			command: function() {
				var files, toFile;

				files = grunt.config.get( "shell.combine-pot-files.fromFiles" );
				toFile = grunt.config.get( "shell.combine-pot-files.toFile" );

				return "msgcat" +
					// The use-first flag prevents the file header from being messed up.
					" --use-first" +
					" " + files.join( " " ) +
					" > " + toFile;
			},
		},

		"combine-pots-yoast-components": {
			fromFiles: [
				"<%= files.pot.yoastJsAnalysisReport %>",
				"<%= files.pot.yoastJsComponents %>",
				"<%= files.pot.yoastJsConfigurationWizard %>",
				"<%= files.pot.yoastJsHelpers %>",
				"<%= files.pot.yoastJsSearchMetadataPreviews %>",
				"<%= files.pot.yoastComponentsConfigurationWizard %>",
				"<%= files.pot.yoastComponentsRemaining %>",
			],
			toFile: "<%= files.pot.yoastComponents %>",
			command: function() {
				var files, toFile;

				files = grunt.config.get( "shell.combine-pots-yoast-components.fromFiles" );
				toFile = grunt.config.get( "shell.combine-pots-yoast-components.toFile" );

				return "msgcat" +
					// The use-first flag prevents the file header from being messed up.
					" --use-first" +
					" " + files.join( " " ) +
					" > " + toFile;
			},
		},

		"makepot-yoast-js-analysis-report": {
			command: "yarn i18n-yoast-js-analysis-report",
		},
		"makepot-yoast-js-components": {
			command: "yarn i18n-yoast-js-components",
		},
		"makepot-yoast-js-configuration-wizard": {
			command: "yarn i18n-yoast-js-configuration-wizard",
		},
		"makepot-yoast-js-helpers": {
			command: "yarn i18n-yoast-js-helpers",
		},
		"makepot-yoast-js-search-metadata-previews": {
			command: "yarn i18n-yoast-js-search-metadata-previews",
		},

		"makepot-yoast-components-configuration-wizard": {
			fromFiles: [
				// On these 2 folders in yoast-components have the old i18n-calypso system.
				"node_modules/yoast-components/composites/LinkSuggestions/**/*.js",
				"node_modules/yoast-components/composites/OnboardingWizard/**/*.js",

				// Only these 3 files have the old i18n-calypso system:
				"<%= paths.js %>components/MailchimpSignup.js",
				"<%= paths.js %>components/MediaUpload.js",
			],
			textdomain: "yoast-components",
			command: function() {
				let files = grunt.config.get( "shell.makepot-yoast-components-configuration-wizard.fromFiles" );

				files = grunt.file.expand( files );

				return path.normalize( "./node_modules/.bin/i18n-calypso" ) +
					" -o <%= files.pot.yoastComponentsConfigurationWizard %>" +
					" -f POT" +
					" " + files.join( " " );
			},
		},

		"makepot-yoast-components-remaining": {
			command: "yarn i18n-yoast-components",
		},

		"makepot-wordpress-seo": {
			command: "yarn i18n-wordpress-seo",
		},

		"makepot-yoastseojs": {
			potFile: "languages/yoast-seo-js.pot",
			textdomain: "js-text-analysis",
			command: function() {
				var files;

				files = [ "./node_modules/yoastseo/src/**/*.js" ];
				files = grunt.file.expand( files );

				grunt.file.write( "languages/yoastseojsfiles.txt", files.join( "\n" ) );

				return "xgettext" +
					" --default-domain=js-text-analysis" +
					" -o <%= files.pot.yoastseojs %>" +
					" --force-po" +
					" --from-code=UTF-8" +
					" --add-comments=\"translators: \"" +
					" --add-comments=\"Translators: \"" +
					" --files-from=languages/yoastseojsfiles.txt";
			},
		},

		webpack: {
			command: "cross-env NODE_ENV=development yarn run wp-scripts build --config config/webpack/webpack.config.js",
		},

		"webpack-prod": {
			command: "yarn run wp-scripts build --config config/webpack/webpack.config.js",
		},

		"webpack-watch": {
			command: "yarn run wp-scripts start --config config/webpack/webpack.config.js",
		},

		"composer-install-production": {
			command: "composer install --prefer-dist --optimize-autoloader --no-dev --no-scripts",
		},

		"composer-install": {
			command: "composer install",
		},

		"composer-update-yoast-dependencies": {
			command: "composer update yoast/license-manager yoast/i18n-module",
		},

		"compile-dependency-injection-container": {
			command: "composer compile-di",
		},

		"remove-dependency-injection-meta": {
			command: "rm ./src/generated/container.php.meta",
		},

		"php-lint": {
			command: "composer lint-branch",
		},

		phpcs: {
			command: "composer check-branch-cs",
		},

		"unlink-monorepo": {
			command: "yarn unlink-monorepo",
		},

		"get-monorepo-versions": {
			command: "yarn list --pattern 'yoastseo|yoast-components' --depth=0",
		},

		"install-schema-blocks": {
			command: "cd packages/schema-blocks && yarn install && yarn build && cd ../..",
		},

		"check-for-uncommitted-changes": {
			// --porcelain gives the output in an easy-to-parse format for scripts.
			command: "git status --porcelain",
			options: {
				callback: throwUncommittedChangesError,
			},
		},
		"readme-reset-txt": {
			command: "git checkout readme.txt",
			options: {
				failOnError: false,
			},
		},
	};
	/* eslint-enable require-jsdoc */
};
