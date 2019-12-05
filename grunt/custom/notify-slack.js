const { isUndefined } = require( "lodash" );
const { IncomingWebhook } = require( "@slack/webhook" );
const webhook = new IncomingWebhook( "YOUR_URL_HERE" );

module.exports = function( grunt ) {
	grunt.registerTask(
		"notify-slack",
		"Sends a notification to Slack.",
		function() {
			const preReleaseURL = grunt.config( "rc.github.url" );

			if ( isUndefined( preReleaseURL ) || preReleaseURL === "" ) {
				grunt.fatal( "No URL to pre-release available. Exiting..." );
			}

			const done = this.async();
			( async() => {
				await webhook.send( { text: "An RC has been deployed:" } );
				done();
			} )();
		}
	);
};
