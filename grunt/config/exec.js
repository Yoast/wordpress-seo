// See https://github.com/jharding/grunt-exec
module.exports = {
	deployToMyYoast: {
		/**
		 * Runs the script to deploy to My Yoast.
		 *
		 * @param {string} name     The name part of the download url.
		 * @param {string} filename The filename of the upload.
		 * @param {string} version  The version of the file.
		 *
		 * @returns {string} The command to execute.
		 */
		cmd: function( name, filename, version ) {
			return [ "./scripts/deploy_to_my_yoast.sh", name, filename, version ].join( " " );
		},
	},
};
