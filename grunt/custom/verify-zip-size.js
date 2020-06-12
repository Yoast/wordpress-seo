const fs = require( "fs" );
const IncomingWebhook = require( "@slack/webhook" ).IncomingWebhook;
const githubApi = require( "../tools/github-api" );

/**
 * Gets a milestone from the wordpress-seo repo.
 *
 * @param {string} pluginVersion The name of the milestone (milestones are always named after the plugin version).
 *
 * @returns {Promise<object|null>} A promise resolving to a single milestone.
 */
async function getMilestone( pluginVersion ) {
	pluginVersion = pluginVersion.toLowerCase();

	const milestonesResponse = await githubApi( "milestones?state=open" );
	if ( ! milestonesResponse.ok ) {
		return null;
	}

	const milestones = await milestonesResponse.json();

	return milestones.find( milestone => milestone.title.toLowerCase() === pluginVersion ) || null;
}

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

			// Max filesize has been determined to be 5 MB (5242880 bytes).
			const maximumSize = 5242880;

			// Exit early if the filesize is within limits.
			if ( stats.size <= maximumSize ) {
				done();
			}

			const maximumSizeInMB = ( maximumSize / 1024 / 1024 ).toFixed( 1 );
			const sizeInMB = ( stats.size / 1024 / 1024 ).toFixed( 2 );

			const versionString = grunt.option( "plugin-version" );

			const issueData = {
				title: `RC ${ versionString } exceeds maximum size (${ sizeInMB }MB > ${ maximumSizeInMB }MB)`,
				body: `The release candidate zip size should be smaller than ${ maximumSizeInMB }MB, currently ${ sizeInMB }MB.`,
				labels: [
					"type:development",
					"component:tools",
					"fix-before-release",
				],
			};

			const milestone = await getMilestone( versionString );
			if ( milestone ) {
				issueData.milestone = milestone.number;
			}

			const issueResponse = await githubApi( "issues", issueData, "POST" );
			const issueResponseData = await issueResponse.json();

			// Send a message to the slack plugin channel.
			const slackWebhook = new IncomingWebhook( process.env.SLACK_DEV_PLUGIN_CHANNEL_TOKEN );
			const slackMessageIssueLink = issueResponseData.html_url || "_GitHub issue creation failed. Please check your .env config._";
			await slackWebhook.send( {
				text: `Zip size is too big, it is ${ sizeInMB }MB. ${ slackMessageIssueLink }`,
			} );

			const finalMessage = "You can now celebrate, but there is work to be done!";

			grunt.log.warn( `Zip size is too big (${ sizeInMB }MB).\n` );

			if ( ! issueResponse.ok ) {
				grunt.log.warn(
					`An issue could not be created. The GitHub API returned: ${ issueResponseData.message }\n\n` +
					finalMessage
				);
				return done();
			}

			grunt.log.ok( `An issue has been created: ${ issueResponseData.html_url }.\n` );

			if ( ! issueResponseData.milestone ) {
				grunt.log.warn(
					`The milestone could not be attached! (${ versionString })\n\n` +
					finalMessage
				);
				return done();
			}

			grunt.log.warn( finalMessage );
			return done();
		}
	);
};
