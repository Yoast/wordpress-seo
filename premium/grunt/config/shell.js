// https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
	'use strict';

	return {
		makepot_social_previews: {
			potFile: 'languages/yoast-social-previews.pot',
			textdomain: 'yoast-social-previews',
			command: function() {
				var files;

				files = [ 'node_modules/yoast-social-previews/js/**/*.js' ];
				files = grunt.file.expand( files );

				return 'xgettext' +
					' --default-domain=<%= shell.makepot_social_previews.textdomain %>' +
					' -o <%= shell.makepot_social_previews.potFile %>' +
					' --package-version=<%= pkg.version %> --package-name=<%= pkg.name %>' +
					' --force-po' +
					' --from-code=UTF-8' +
					' --add-comments=\'translators: \'' +
					' ' + files.join( ' ' );
			}
		},
		'combine-pot-files': {
			fromFiles: [
				'languages/<%= pkg.plugin.textdomain %>-temp.pot',
				'languages/yoast-social-previews.pot'
			],
			toFile: 'languages/<%= pkg.plugin.textdomain %>.pot',
			command: function() {
				var files, toFile;

				files = grunt.config.get('shell.combine-pot-files.fromFiles');
				toFile = grunt.config.get('shell.combine-pot-files.toFile');

				return 'msgcat' +
					' --use-first' +
					' ' + files.join(' ') +
					' > ' + toFile;
			}
		}
	};
};
