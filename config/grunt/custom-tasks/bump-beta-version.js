/* eslint-disable no-console */
const { flattenVersionForFile } = require( "../../webpack/paths" );

/**
 * Grunt task to bump the Beta version.
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"bump-beta-version",
		"Bumps the versions to the next beta and commits the changes to the current branch.",
		// eslint-disable-next-line max-statements
		function() {
			// Parse the command line options.
			const pluginVersionArgument = grunt.option( "plugin-version" );
			const releaseTypeArgument = grunt.option( "type" );

			// Check if arguments were passed.
			if ( ! pluginVersionArgument ) {
				grunt.fail.fatal( "Missing --plugin-version argument" );
			}

			if ( ! releaseTypeArgument ) {
				grunt.fail.fatal( "Missing --type argument" );
			}

			/*
			 * Whenever a merge conflict occurs after the version has bumped when the branch is merged
			 * back into trunk, this needs to be resolved.
			 * To avoid an additional bump (beta1 -> beta2) when continuing the process, this flag should
			 * be used: --no-version-bump.
			 */
			const gruntFlags = grunt.option.flags();
			const noBump = -1 !== gruntFlags.indexOf( "--no-version-bump" );

			// Retrieve the current plugin version from package.json.
			const packageJson = grunt.file.readJSON( "package.json" );
			const pluginVersionPackageJson = packageJson.yoast.pluginVersion;

			// Strip off the beta part from the current plugin version.
			const parsedVersion = pluginVersionPackageJson.split( "-beta" );

			// From the resulting array, get the first value (the second value is the beta number).
			const strippedVersion = parsedVersion[ 0 ];

			// Declare the new plugin version variable.
			let newPluginVersion = pluginVersionArgument;

			// Setup the bumped version, which is only bumped without the flag being present.
			let bumpedBetaVersion = parseInt( parsedVersion[ 1 ] || "0", 10 );

			// Set the previousPluginVersion, we need this variable for the GitHub release entry.
			grunt.config.data.previousPluginVersion = grunt.config.get( "pluginVersion" );

			/*
			If the package.json had a version that contained "-beta", the number following that will be incremented by 1.
			Otherwise, this is the first beta, so we set the beta version to 0, in order to add 1 and end up at "-beta1".
			*/
			if ( pluginVersionArgument === strippedVersion ) {
				if ( noBump ) {
					console.log( "Skipping version bumping, flag --no-version-bump detected." );

					// Adapt the previousPluginVersion because there was no version bump.
					const previousBetaVersion = bumpedBetaVersion - 1;
					grunt.config.data.previousPluginVersion = strippedVersion + "-beta" + previousBetaVersion;
				} else {
					bumpedBetaVersion += 1;
				}

				newPluginVersion += "-beta" + bumpedBetaVersion;
			} else {
				// Else, the Beta is 1.
				newPluginVersion += "-beta1";
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
				grunt.config( "gitadd.versionBump.files", { src: grunt.config.get( "files.versionFiles" ) } );
				grunt.task.run( "gitadd:versionBump" );

				grunt.config( "gitcommit.versionBump.options.message", "Update the plugin version to " + grunt.config.data.pluginVersion );
				grunt.task.run( "gitcommit:versionBump" );

				grunt.config( "gitpush.versionBump.options", { remote: "origin", upstream: true, branch: grunt.config.data.branchForRC } );
				grunt.task.run( "gitpush:versionBump" );
			}
		}
	);
};
