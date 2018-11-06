// See https://github.com/jharding/grunt-exec
module.exports = {
	deployToMyYoast: {
		/**
		 * Runs the script to deploy to MyYoast.
		 *
		 * @param {string} name The name part of the url to upload to.
		 * @param {string} file The filename of the file to upload.
		 *
		 * @returns {string} The command to execute.
		 */
		cmd: function( name, file ) {
			return [ "./scripts/deploy_to_myyoast.sh", name, file ].join( " " );
		},
	},
};
