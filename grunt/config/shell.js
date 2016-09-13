// See https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
	return {
		"combine-pot-files": {
			fromFiles: [
				"languages/<%= pkg.plugin.textdomain %>-temp.pot",
				"node_modules/yoastseo/languages/yoast-seo.pot",
				"languages/yoast-components.pot",
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
			textdomain: "yoast-components",
			command: function() {
				let files = [
					"node_modules/yoast-components/**/*.js",
					"!node_modules/yoast-components/node_modules/**/*.js",
				];
				files = grunt.file.expand( files );

				return "./node_modules/.bin/i18n-calypso" +
					" -o <%= files.pot.yoastComponents %>" +
					" -f POT" +
					" " + files.join( " " );
			},
		},
	};
};
