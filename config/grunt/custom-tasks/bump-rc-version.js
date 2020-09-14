const { flattenVersionForFile } = require( "../../webpack/paths" );

/**
 * Grunt task to bump the RC version.
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"bump-rc-version",
		"Bumps the versions to the next RC and commits the changes to the current branch.",
		function() {
			let options = this.options({
				doGithubPush: true,
				alternativeBranch: 'ci-rc-test',
				alternativeBranchPush: false,
				branchForRC: '',
				type: 'release',
				pluginVersionArg: '',
				noBump: false,
			});
			
			/*
			 * Whenever a merge conflict occurs after the version has bumped when the branch is merged
			 * back into trunk, this needs to be resolved.
			 * To avoid an additional bump (RC1 -> RC2) when continuing the process, this flag should
			 * be used: --no-version-bump.
			 */
			
			// Retrieve the current plugin version from package.json.
			const packageJson = grunt.file.readJSON( "package.json" );
			const pluginVersionPackageJson = packageJson.yoast.pluginVersion;

			// Strip off the RC part from the current plugin version.
			const parsedVersion = pluginVersionPackageJson.split( "-RC" );

			// From the resulting array, get the first value (the second value is the RC number).
			const strippedVersion = parsedVersion[ 0 ];

			// Declare the new plugin version variable.
			let newPluginVersion = options.pluginVersionArg;

			// Setup the bumped version, which is only bumped without the flag being present.
			let bumpedRCVersion = parseInt( parsedVersion[ 1 ] || "0", 10 );

			/*
			If the package.json had a version that contained "-RC", the number following that will be incremented by 1.
			Otherwise, this is the first RC, so we set the RC version to 0, in order to add 1 and end up at "-RC1".
			*/
			if ( options.pluginVersionArg === strippedVersion ) {
				if ( options.noBump ) {
					console.log( "Skipping version bumping, flag --no-version-bump detected." );
				} else {
					bumpedRCVersion += 1;
				}
				newPluginVersion += "-RC" + bumpedRCVersion;
			} else {
				// Else, the RC is 1.
				newPluginVersion += "-RC1";
			}

			if ( pluginVersionPackageJson !== newPluginVersion ) {
				console.log( "Bumped the plugin version to " + newPluginVersion + "." );
				console.log( " To prevent a version bump when resolving a merge conflict, use the '--no-version-bump' flag in your command." );

				// Set the plugin version to the bumped version in package.json.
				grunt.option( "new-version", newPluginVersion );
				grunt.task.run( "set-version" );

				// The below command is needed to make the below 'update-version-trunk' work.
				// This is because 'update-version-trunk' uses 'pluginVersion' from Gruntfile.js.
				// Which is taken from package.json BEFORE package.json is updated by our above code.
				grunt.config.data.pluginVersion = newPluginVersion;
				grunt.config.data.pluginVersionSlug = flattenVersionForFile( newPluginVersion );

				// Set the plugin version to the bumped version in the plugin files.
				grunt.task.run( "update-version-trunk" );

				// Stage the version files.
				grunt.config( "gitadd.versionBump.files", { src: grunt.config.get( 'files.versionFiles' ) } );
				grunt.task.run( "gitadd:versionBump" );

				grunt.config( "gitcommit.versionBump.options.message", "Update the plugin version to " + grunt.config.data.pluginVersion );
				grunt.task.run( "gitcommit:versionBump" );

				if (options.doGithubPush ){
					if (options.alternativeBranchPush){
						grunt.config( "gitpush.versionBump.options", { remote: "origin", branch: options.branchForRC + ":" + options.alternativeBranch, force: true } );
					} else {
						grunt.config( "gitpush.versionBump.options", { remote: "origin", upstream: true, branch: options.branchForRC } );
					}
					grunt.task.run( "gitpush:versionBump" );
				}
			}
		}
	);
};
