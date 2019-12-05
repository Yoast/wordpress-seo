/**
 * ...
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

			let version = grunt.option( "plugin-version" );
			let type = grunt.option( "type" );

			// If no type is specified, default to release.
			if ( type !== "hotfix" ) {
				type = "release"
			}

			let basebranch = type === "hotfix" ? 'master' : 'trunk';

			let branchname = type + "/" + version;

			// First switch to either trunk or master to make sure we branch from the correct base branch.
			grunt.config( "gitcheckout.baseBranch.options", {
				branch: basebranch,
			} );

			grunt.task.run( "gitcheckout:baseBranch" );

			grunt.config( "gitcheckout.releaseBranch.options", {
				branch: branchname,
				force: true,
			} );

			grunt.task.run( "gitcheckout:releaseBranch" );

			const execSync = require('child_process').execSync;

			let command = 'git branch --list ' + branchname;
			const output = execSync( command, { encoding: 'utf-8' } );
			console.log('Output was:\n', output);

			if ( output ){
				grunt.config( "gitcheckout.existingBranch.options", {
					branch: branchname,
				} );

				grunt.task.run( "gitcheckout:existingBranch" );
			} else {
				grunt.config( "gitcheckout.newBranch.options", {
					branch: branchname,
					create: true,
				} );

				grunt.task.run( "gitcheckout:newBranch" );
			}

			// Pull the release or hotfix branch to make sure you have the latest commits.
			grunt.config( "gitpull.pull.options", {
				branch: branchname,
			} );

			grunt.task.run( "gitpull:pull" );
		}
	);
};
