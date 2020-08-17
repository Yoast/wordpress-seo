const { IncomingWebhook } = require( "@slack/webhook" );

module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"send-slack-notify",
		"Sends a notification to Slack.",
		function() {
			const options = this.options({
				message: 'slack message',
				enable: false
			});
			if ( ! options.enable) {
				return
			}
			if ( ! options.slackToken ) {
				grunt.task.run( "prompt:slackEnvMissing" );
				return;
			}
			const webhook = new IncomingWebhook( "https://hooks.slack.com/services/" + options.slackToken );
			const done = this.async();
			( async() => {
				try {
					await webhook.send( { text: options.message } );
				} catch ( error ) {
					grunt.verbose.writeln(error);
					grunt.task.run( "prompt:slackMessageError" );
				}
				done();
			} )();
		},
	);
};
