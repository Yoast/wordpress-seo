const { IncomingWebhook } = require( "@slack/webhook" );

const webhook = new IncomingWebhook( "YOUR_URL_HERE" );

module.exports = function( grunt ) {
	grunt.registerTask(
		"notify-slack",
		"Sends a notification to Slack.",
		function() {
			const config = grunt.config( "notify-slack" );
			console.log( config.options.text );
			const done = this.async();
			( async() => {
				// await webhook.send({ text: "An RC has been deployed:" } );
				done();
			} )();
		}
	);
}
