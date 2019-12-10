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
			let type = grunt.option( "type" );

			// If no type is specified, default to release.
			if ( type !== "hotfix" ) {
				type = "release";
			}

			const basebranch = type === "hotfix" ? "master" : "trunk";

			const branchname = type + "/" + version;

			// First switch to either trunk or master to make sure we branch from the correct base branch.
			grunt.config( "gitcheckout.baseBranch.options", {
				branch: basebranch,
			} );
			grunt.task.run( "gitcheckout:baseBranch" );

			// Pull master/trunk to have the latest changes.
			grunt.config( "gitpull.pullBaseBranch.options", {
				branch: branchname,
			} );
			grunt.task.run( "gitpull:pullBaseBranch" );

			const execSync = require( "child_process" ).execSync;
			const command = "git branch --list " + branchname;
			const foundBranchName = execSync( command, { encoding: "utf-8" } );

			// If the release or hotfix branch already existed, it was saved above in foundBranchName.
			if ( foundBranchName ) {
				// Checkout the release or hotfix branch.
				grunt.config( "gitcheckout.existingBranch.options", {
					branch: branchname,
				} );
				grunt.task.run( "gitcheckout:existingBranch" );

				// Todo: if the branch exists locally but not remote, foundBranchName is set, which leads to an error on this pull action.
				// Pull the release or hotfix branch to make sure you have the latest commits.
				grunt.config( "gitpull.pullReleaseBranch.options", {
					branch: branchname,
				} );
				grunt.task.run( "gitpull:pullReleaseBranch" );
			} else {
				// If the release or hotfix branch doesn't exist yet, we need to create the branch.
				grunt.config( "gitcheckout.newBranch.options", {
					branch: branchname,
					create: true,
				} );
				grunt.task.run( "gitcheckout:newBranch" );
			}
			console.log( "Switched to the " + branchname + " branch" );
		}
	);
};
