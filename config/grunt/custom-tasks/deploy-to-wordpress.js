/**
 * wrapper for wp_deploy , this adds a enable option.
 * 
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */

module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"deploy-to-wordpress",
		"wrapper function on wp_deploy",
		function() {
			const options = this.options({
                enable: false,
                branch: '',
            });


            if ( options.enable ) {
                grunt.task.run( 'wp_deploy:' + options.branch )
                //grunt.log.writeln('wp_deploy:' + options.branch)
            }
        });
    };
