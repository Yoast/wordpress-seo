const execSync = require( "child_process" ).execSync;

/**
 * Ensures that the release or hotfix branch is checked out.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"ensure-pre-release-branch",
		"Ensures that the release or hotfix branch is checked out",
		function() {
			// Fetch all existing branches.
			grunt.config( "gitfetch.fetchall.options.all", true );
			grunt.task.run( "gitfetch:fetchall" );
			const version = grunt.option( "plugin-version" );
			const type = grunt.option( "type" );

			// If no version is specified, abort the task.
			if ( ! version ) {
				grunt.fail.fatal( "Missing --plugin-version argument (i.e. x.x.x)" );
			}

			// If no type is specified, abort the task.
			if ( ! type ) {
				grunt.fail.fatal( "Missing --type argument (release or hotfix)" );
			}

			const basebranch = type === "hotfix" ? "master" : "trunk";

			const branchForRC = type + "/" + version;

			// Set a grunt branchForRC variable.
			grunt.config.data.branchForRC = branchForRC;

			// First switch to either trunk or master to make sure we branch from the correct base branch.
			grunt.config( "gitcheckout.baseBranch.options", {
				branch: basebranch,
			} );
			grunt.task.run( "gitcheckout:baseBranch" );

			// Pull master/trunk to have the latest changes.
			grunt.config( "gitpull.pullBaseBranch.options", {
				branch: basebranch,
			} );
			grunt.task.run( "gitpull:pullBaseBranch" );

			const exists = ! ! execSync( "git branch --list " + branchForRC, { encoding: "utf-8" } );

			if ( exists ) {
				// Verify whether this branch already exists on the remote.
				const existsRemotely = ! ! execSync( "git branch --list -r  origin/" + branchForRC, { encoding: "utf-8" } );

				/* If it doesn't exist remotely, cancel the automatic release, because the dev should manually verify why this is the case.
				This is needed because you cannot pull (as we will do below) on a branch that doesn't exist remotely. */
				if ( ! existsRemotely ) {
					grunt.fail.fatal( "The release branch does not exist on the remote (origin). " +
						"Please push your local branch, and run this script again." );
				}

				// Checkout the release or hotfix branch.
				grunt.config( "gitcheckout.existingBranch.options", {
					branch: branchForRC,
				} );
				grunt.task.run( "gitcheckout:existingBranch" );

				// Pull the release or hotfix branch to make sure you have the latest commits.
				grunt.config( "gitpull.pullReleaseBranch.options", {
					branch: branchForRC,
				} );
				grunt.task.run( "gitpull:pullReleaseBranch" );
			} else {
				// If the release or hotfix branch doesn't exist yet, we need to create the branch.
				grunt.config( "gitcheckout.newBranch.options", {
					branch: branchForRC,
					create: true,
				} );
				grunt.task.run( "gitcheckout:newBranch" );
			}
			grunt.log.ok( "Switched to the " + branchForRC + " branch" );
		}
	);
};
