// https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
	"use strict";

	return {
		makepot: {
			potFile: "languages/yoast-seo.pot",
			textdomain: "js-text-analysis",
			command: function() {
				var files;

				files = [ "js/*.js", "js/config/*.js" ];
				files = grunt.file.expand( files );

				return "xgettext" +
					" --default-domain=<%= shell.makepot.textdomain %>" +
					" -o <%= shell.makepot.potFile %>" +
					" --package-version=<%= pkg.version %> --package-name=<%= pkg.name %>" +
					" --force-po" +
					" --from-code=UTF-8" +
					" --add-comments=\"translators: \"" +
					" " + files.join( " " );
			}
		}
	};
};
