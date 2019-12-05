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
				let type = "release"
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
				create: true,
			} );

			grunt.task.run( "gitcheckout:releaseBranch" );



//			if ( 'git branch --list branchname' ) {
//			//	git checkout branchname
//			} else {
//				// git checkout {basebranch}
//				// git checkout -b {type}/{version}
//			}

		}
	);
};
