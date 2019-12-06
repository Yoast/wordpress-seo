const { isUndefined } = require( "lodash" );
const { IncomingWebhook } = require( "@slack/webhook" );

module.exports = function( grunt ) {
	grunt.registerTask(
		"notify-slack",
		"Sends a notification to Slack.",
		function() {
			//todo: find a way to implement an environment that we can keep secret, add the secret webhook url to that, and replace it here.
			const webhook = new IncomingWebhook( "YOUR_WEBHOOK_URL_HERE" );

			//todo: make sure the pre-release task will fill this config variable.
			const preReleaseURL = grunt.config( "rc.github.url" );

			if ( isUndefined( preReleaseURL ) || preReleaseURL === "" ) {
				grunt.fatal( "No URL to pre-release available. Exiting..." );
			}

			const done = this.async();
			( async() => {
				await webhook.send( { text: `An RC has been deployed: ${ preReleaseURL }` } );
				done();
			} )();
		}
	);
};
