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

		"makepot-yoast-components": {
			fromFiles: [
				"node_modules/yoast-components/**/*.js",
				"!node_modules/yoast-components/node_modules/**/*.js",
				"<%= paths.js %>components/*.js",
			],
			textdomain: "yoast-components",
			command: function() {
				let files = grunt.config.get( "shell.makepot-yoast-components.fromFiles" );

				files = grunt.file.expand( files );

				return "./node_modules/.bin/i18n-calypso" +
					" -o <%= files.pot.yoastComponents %>" +
					" -f POT" +
					" " + files.join( " " );
			},
		},

		"makepot-yoastseojs": {
			potFile: "languages/yoast-seo-js.pot",
			textdomain: "js-text-analysis",
			command: function() {
				var files;

				files = [ "./node_modules/yoastseo/js/**/*.js" ];
				files = grunt.file.expand( files );

				return "xgettext" +
					" --default-domain=js-text-analysis" +
					" -o <%= files.pot.yoastseojs %>" +
					" --force-po" +
					" --from-code=UTF-8" +
					" --add-comments=\"translators: \"" +
					" --add-comments=\"Translators: \"" +
					" " + files.join( " " );
			},
		},

		"production-composer-install": {
			command: "composer install --prefer-dist --optimize-autoloader --no-dev",
		},
	};
};
