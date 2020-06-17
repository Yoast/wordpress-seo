module.exports = function( grunt ) {
	grunt.registerTask(
		"bump-rc-version-and-commit",
		"Bumps the RC version and commits the changes to the current branch.",
		function() {
			grunt.task.run( "bump-rc-version" );

			// Stage the version files.
			grunt.config( "gitadd.versionBump.files", { src: grunt.config.get( 'files.versionFiles' ) } );
			grunt.task.run( "gitadd:versionBump" );

			grunt.config( "gitcommit.versionBump.options.message", "Update the plugin version to " + grunt.config.data.pluginVersion );
			grunt.task.run( "gitcommit:versionBump" );

			grunt.config( "gitpush.versionBump.options", { remote: "origin" } );
			grunt.task.run( "gitpush:versionBump" );
		}
	);
}
