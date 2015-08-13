// https://github.com/sindresorhus/grunt-shell
module.exports = function(grunt) {
	'use strict';

	return {
		'combine-pot-files': {
			fromFiles: [
				'languages/<%= pkg.plugin.textdomain %>-temp.pot',
				'bower_components/js-text-analysis/languages/js-text-analysis.pot'
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
