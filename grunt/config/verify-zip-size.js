const fs = require( "fs" );
const IncomingWebhook = require( "@slack/webhook" ).IncomingWebhook;
const parseVersion = require( "./tools/parse-version" );
const githubApi = require( "./tools/github-api" );

/**
 * Gets a milestone from the wordpress-seo repo.
 *
 * @param {string} title The name of the milestone.
 *
 * @returns {Promise<object|null>} A promise resolving to a single milestone.
 */
async function getMilestone( title ) {
	title = title.toLowerCase();

	const milestonesResponse = await githubApi( "milestones?state=open" );
	if ( ! milestonesResponse.ok ) {
		return null;
	}

	const milestones = await milestonesResponse.json();

	return milestones.find( milestone => milestone.title.toLowerCase() === title ) || null;
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
			const version = parseVersion( versionString );

			const issueData = {
				title: `RC ${ versionString } exceeds maximum size (${ sizeInMB }MB > ${ maximumSizeInMB }MB)`,
				body: `The release candidate zip size should be smaller than ${ maximumSizeInMB }MB, currently ${ sizeInMB }MB.`,
				labels: [
					"type:development",
					"component:tools",
					"fix-before-release",
				],
			};

			const milestoneTitle = ( version.patch > 0 ) ? `hotfix/${ versionString }` : `release/${ versionString }`;
			const milestone = await getMilestone( milestoneTitle );
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

			const finalMessage = "The RC process is being stopped.";

			grunt.log.warn( `Zip size is too big (${ sizeInMB }MB).\n` );

			if ( ! issueResponse.ok ) {
				grunt.fail.fatal(
					`An issue could not be created: ${ issueResponseData.message }\n\n` +
					finalMessage
				);
			}

			grunt.log.ok( `An issue has been created: ${ issueResponseData.html_url }.\n` );

			if ( ! issueResponseData.milestone ) {
				grunt.fail.fatal(
					`The milestone could not be attached! (${ milestoneTitle })\n\n` +
					finalMessage
				);
			}

			grunt.fail.fatal( finalMessage );
		}
	);
};
