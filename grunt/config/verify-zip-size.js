const fs = require( "fs" );
const execSync = require( "child_process" ).execSync;
const IncomingWebhook = require( "@slack/webhook" ).IncomingWebhook;

/**
 * Checks the size of the created artifact and creates an issue if the zip exceeds 5MB.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"verify-zip-size",
		"Checks the size of the created artifact and creates an issue if the zip exceeds 5MB",
		async function() {
			const done = this.async();
			const stats = fs.statSync( "artifact.zip" );
			if ( stats.size >= 5242880 ) {
				const data = {
					title: "Fix RC zip size",
					body: "The RC zip size should be smaller than 5MB.",
					labels: [
						"type:development",
						"component:tools",
					],
				};

				// TODO: get the github token from somewhere.
				const url = `https://api.github.com/repos/Yoast/wordpress-seo/issues?access_token=${ GITHUB_TOKEN }`;
				// TODO: Fix the curl command: probably some encoding that needs to be done?
				execSync( `curl ${ url } --data ${ JSON.stringify( data ) } --header "application/vnd.github.symmetra-preview+json"` );

				// Send a message to the slack plugin channel.
				const slackWebhook = new IncomingWebhook( process.env.SLACK_DEV_PLUGIN_CHANNEL_TOKEN );

				const sizeInMB     = ( stats.size / 1024 / 1024 ).toFixed( 2 );
				await slackWebhook.send( {
					text: `Zip size is too big, it is ${ sizeInMB } mb. [LINK TO ISSUE]`,
				} );

				done();

				grunt.fail.fatal( `Zip size is too big (${ stats.size } bytes). The release process is stopped.` );
			}
		}
	);
};
