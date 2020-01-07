const fs = require( "fs" );
const IncomingWebhook = require( "@slack/webhook" ).IncomingWebhook;
const fetch = require( "node-fetch" );
const parseVersion = require( "./tools/parse-version" );

const API_BASE = "https://api.github.com/repos/" + process.env.GITHUB_REPOSITORY;

/**
 * Gets a milestone from the wordpress-seo repo.
 *
 * @param {string} title The name of the milestone.
 *
 * @returns {Promise<object|null>} A promise resolving to a single milestone.
 */
async function getMilestone( title ) {
	title = title.toLowerCase();

	const milestonesResponse = await fetch( `${ API_BASE }/milestones?state=open`, {
		headers: {
			Authorization: `token ${ process.env.GITHUB_ACCESS_TOKEN }`,
		},
	} );

	if ( ! milestonesResponse.ok ) {
		return null;
	}

	const milestones = await milestonesResponse.json();

	return milestones.find( milestone => milestone.title.toLowerCase() === title ) || null;
}

/**
 * Creates an issue on GitHub.
 *
 * @param {Object} issueData Data to create the issue with.
 *
 * @returns {Promise<object|null>} GitHub response.
 */
async function createIssue( issueData ) {
	// Create the issue on GitHub.
	const issueResponse = await fetch( `${ API_BASE }/issues`, {
		method: "POST",
		headers: {
			Authorization: `token ${ process.env.GITHUB_ACCESS_TOKEN }`,
		},
		body: JSON.stringify( issueData ),
	} );

	return issueResponse;
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

			const issueResponse = await createIssue( issueData );
			const issueResponseData = await issueResponse.json();

			// Send a message to the slack plugin channel.
			const slackWebhook = new IncomingWebhook( process.env.SLACK_DEV_PLUGIN_CHANNEL_TOKEN );
			await slackWebhook.send( {
				text: `Zip size is too big, it is ${ sizeInMB }MB. ${ issueResponseData.html_url }`,
			} );

			const finalMessage = "The RC process is being stopped.";

			if ( ! issueResponse.ok ) {
				grunt.fail.fatal(
					`Zip size is too big (${ sizeInMB }MB).\n` +
					`An issue could not be created: ${ issueResponseData.message }\n\n` +
					finalMessage
				);
			}

			if ( ! issueResponseData.milestone ) {
				grunt.log.warn(
					`Zip size is too big (${ sizeInMB }MB).\n` +
					`An issue has been created: ${ issueResponseData.html_url }.\n`
				);

				grunt.fail.fatal(
					`The milestone could not be attached! (${ milestoneTitle })\n\n` +
					finalMessage
				);
			}

			grunt.fail.warn(
				`Zip size is too big (${ sizeInMB }MB). The release process is stopped.\n` +
				`An issue has been created: ${ issueResponseData.html_url }.\n\n` +
				finalMessage
			);
		}
	);
};
