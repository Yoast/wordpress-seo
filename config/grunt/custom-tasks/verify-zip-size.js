const fs = require( "fs" );
const IncomingWebhook = require( "@slack/webhook" ).IncomingWebhook;
const githubApi = require( "../lib/github-api" );

/**
 * Checks the size of the created artifact and creates an issue if the zip exceeds 5MB.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"verify-zip-size",
		"Checks the size of the created artifact and creates an issue if the zip exceeds 5MB",
		 function() {
			const stats = fs.statSync( "artifact.zip" );
			const options = this.options({
				enableSlack: false,
				pluginVersion: '',
			});
			
			const parsedVersion = options.pluginVersion.split( "-RC" );
			// From the resulting array, get the first value (the second value is the RC number).
			const strippedVersion = parsedVersion[ 0 ];

			//check  if grunt.config.data.enableSlack is already set, if not set it to the commandline value if that exist.
			if (typeof grunt.config.data.enableSlack === 'undefined') {
				const enableSlackArg = grunt.option( 'enableSlack' ) 
            	grunt.config.data.enableSlack = (typeof enableSlackArg === 'undefined' ) ? options.enableSlack: enableSlackArg ;
			}
						
			// Max filesize has been determined to be 5 MB (5242880 bytes).
			const maximumSize = 5242880;

			// Exit early if the filesize is within limits.
			if ( stats.size <= maximumSize ) {
				
				return;
			}

			const maximumSizeInMB = ( maximumSize / 1024 / 1024 ).toFixed( 1 );
			const sizeInMB = ( stats.size / 1024 / 1024 ).toFixed( 2 );
			const versionString = options.pluginVersion;
			
			//add github issue and
			// Send a message to the slack plugin channel. text is set in "add-git-issue:oversized"
			grunt.config( "add-git-issue.oversized.options", {
				title: `${ versionString } exceeds maximum size (${ sizeInMB }MB > ${ maximumSizeInMB }MB)`,
				body: `The release candidate zip size should be smaller than ${ maximumSizeInMB }MB, currently ${ sizeInMB }MB.`,
				labels: [
					"type:development",
					"component:tools",
					"fix-before-release",
				],
				versionString: strippedVersion,				
			} );
			
			grunt.task.run( ["add-git-issue:oversized", "send-slack-notify:add-git-issue-slack-message"]);
            
			return;
		}
	);
};
