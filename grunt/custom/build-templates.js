module.exports = function( grunt ) {
	grunt.registerMultiTask( 'build-templates', 'Builds lodash templates', function () {
		var pkg = require('lodash-cli/package.json'),
			bin = pkg.bin.lodash,
			builder = require.resolve('lodash-cli/' + bin);

		var done = this.async();

		var files = "templates/*.jst";

		var args = [ builder,
				'exports=node',
				'template=' + files,
				'moduleId=none',
				'--development',
				'--output',
				'js/templates.js' ];

		grunt.util.spawn({
			'cmd': 'node',
			'args': args
		}, function(error, data) {
			if (error) {
				grunt.log.error(error.toString());
				done(error);
			}
			grunt.verbose.write(data.toString());
			done();
		});
	} );
};
