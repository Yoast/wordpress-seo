const githubApi = require( "../lib/github-api" );

/**
 * Gets a milestone from the repo.
 *
 * @param {string} pluginVersion The name of the milestone (milestones are always named after the plugin version).
 *
 * @returns {Promise<object|null>} A promise resolving to a single milestone.
 */
async function getMilestone( pluginVersion, githubRepository ) {
	pluginVersion = pluginVersion.toLowerCase();

	const milestonesResponse = await githubApi( githubRepository + "/milestones?state=open" );
	if ( ! milestonesResponse.ok ) {
		return null;
	}

	const milestones = await milestonesResponse.json();

	return milestones.find( milestone => milestone.title.toLowerCase() === pluginVersion ) || null;
}

/**
 * Checks the size of the created artifact and creates an issue if the zip exceeds 5MB.
 * it will try to link the issue to the RCs main milestone
 * 
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"add-git-issue",
		"Add issue to github, linked to the release version milestone",
		async function() {
			const done = this.async();
			const options = this.options({
				title: 'title',
				body: 'body',
				labels: [],
				versionString: '',
				githubOwner:  '',
			    githubRepo: '',				
			});
			
			const issueData = {
				title: options.title,
				body: options.body,
				labels: options.labels,
			};

			const milestone = await getMilestone( options.versionString, options.githubOwner + "/" + options.githubRepo );
			if ( milestone ) {
				issueData.milestone = milestone.number;
			}
			const finalMessage = "You can now celebrate, but there is work to be done!";
			const issueResponse = await githubApi( options.githubOwner + "/" + options.githubRepo + "/issues", issueData, "POST" );
			const issueResponseData = await issueResponse.json();

			if ( ! issueResponse.ok ) {
				grunt.log.warn(
					`An issue could not be created. The GitHub API returned: ${ issueResponseData.message }\n\n` +
					finalMessage
				);
				// setup slack message
				grunt.config.data.slackMessage = `${ options.body } release ${ options.versionString } : "_GitHub issue creation failed. Please check your .env config._"` ;
				return done();
			}

			grunt.log.ok( `An issue has been created: ${ issueResponseData.html_url }.\n` );
			
			if ( ! issueResponseData.milestone ) {
				grunt.log.warn(
					`The issue could not be attached to The milestone! (${ options.versionString })\n\n` +
					finalMessage		
				);
				// setup slack message
				grunt.config.data.slackMessage = `${ options.body } ${ issueResponseData.html_url }\n\nThe issue could not be attached to The milestone! (${ options.versionString })`;
				return done();
			}
			
			// prepeair a message to the slack plugin channel.
			grunt.config.data.slackMessage = `${ options.body } release ${ options.versionString } : ${ issueResponseData.html_url }` ;
			grunt.log.warn( finalMessage );
			return done();
		}
	);
};
