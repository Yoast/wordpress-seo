const { IncomingWebhook } = require( "@slack/webhook" );

module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"notify-slack",
		"Sends a notification to Slack.",
		function() {
			if ( ! this.data.slackToken ) {
				grunt.task.run( "prompt:slackEnvMissing" );
				return;
			}
			const webhook = new IncomingWebhook( this.data.slackToken );

			const preReleaseURL = grunt.config( "rc.github.url" );

			const done = this.async();
			( async() => {
				try {
					await webhook.send( { text: `${ this.data.message }${ preReleaseURL }` } );
				} catch ( error ) {
					grunt.task.run( "prompt:slackMessageError" );
				}
				done();
			} )();
		}
	);
};
