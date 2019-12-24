const fs = require( "fs" );
const IncomingWebhook = require( "@slack/webhook" ).IncomingWebhook;
const fetch = require( "node-fetch" );

const API_BASE = "https://api.github.com/repos/Yoast/wordpress-seo";

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

			if ( stats.size < 5242880 ) {
				done();
			}

			const data = {
				title: "Fix RC zip size",
				body: "The RC zip size should be smaller than 5MB.",
				labels: [
					"type:development",
					"component:tools",
					"fix-before-release",
				],
			};

			const milestone = await getMilestone( "release/1.0" );

			if ( milestone ) {
				data.milestone = milestone.number;
			}

			const response = await fetch( `${ API_BASE }/issues`, {
				method: "POST",
				headers: {
					Authorization: `token ${ process.env.GITHUB_ACCESS_TOKEN }`,
				},
				body: JSON.stringify( data ),
			} );

			const responseData = await response.json();

			// Send a message to the slack plugin channel.
			const slackWebhook = new IncomingWebhook( process.env.SLACK_DEV_PLUGIN_CHANNEL_TOKEN );

			const sizeInMB     = ( stats.size / 1024 / 1024 ).toFixed( 2 );
			await slackWebhook.send( {
				text: `Zip size is too big, it is ${ sizeInMB } MB. ${ responseData.html_url }`,
			} );

			if ( ! response.ok ) {
				grunt.fail.fatal(
					`Zip size is too big (${ sizeInMB } MB). The release process is stopped.\n` +
					`An issue could not be created: ${ responseData.message }`
				);
			}

			if ( ! responseData.milestone ) {
				grunt.log.warn(
					`Zip size is too big (${ sizeInMB } MB). The release process is stopped.\n` +
					`An issue has been created: ${ responseData.html_url }.\n\n`
				);

				grunt.fail.fatal(
					"The milestone could not be attached!"
				);
			}

			grunt.fail.warn(
				`Zip size is too big (${ sizeInMB } MB). The release process is stopped.\n` +
				`An issue has been created: ${ responseData.html_url }.`
			);
		}
	);
};


