const path = require( "path" );

// See https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
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

		"makepot-yoast-components-configuration-wizard": {
			fromFiles: [
				// On these 2 folders in yoast-components have the old i18n-calypso system.
				"node_modules/yoast-components/composites/LinkSuggestions/**/*.js",
				"node_modules/yoast-components/composites/OnboardingWizard/**/*.js",

				// Only these 3 files have the old i18n-calypso system:
				"<%= paths.js %>components/ConnectGoogleSearchConsole.js",
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

		"composer-install-production": {
			command: "composer install --prefer-dist --optimize-autoloader --no-dev",
		},

		"remove-prefixed-sources": {
			command: "composer remove league/oauth2-client j4mie/idiorm pimple/pimple ruckusing/ruckusing-migrations psr/log " +
			"--update-no-dev --optimize-autoloader",
		},

		"composer-install-dev": {
			command: "composer install",
		},

		"composer-reset-config": {
			command: "git checkout composer.json",
			options: {
				failOnError: false,
			},
		},

		"composer-reset-lock": {
			command: "git checkout composer.lock",
			options: {
				failOnError: false,
			},
		},

		"production-prefix-dependencies": {
			command: "composer install",
		},

		"php-lint": {
			command: "find -L . " +
				"-path ./vendor -prune -o " +
				"-path ./vendor_prefixed -prune -o " +
				"-path ./node_modules -prune -o " +
				"-path ./artifact -prune -o " +
				"-name '*.php' -print0 | xargs -0 -n 1 -P 4 php -l",
		},
	};
};
