const fs = require( "fs" );

/**
 * ...
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"bump-rc-version",
		"Bumps the versions to the next RC",
		function() {
			let pluginVersionFlag = grunt.option( "plugin-version" );
			const packageJson = JSON.parse( fs.readFileSync( "package.json", "utf8" ) ) || {};
			const pluginVersionPackageJson = packageJson.yoast.pluginVersion;

			const versionRegex = /\d+.\d+/gm;
			const strippedVersion = pluginVersionPackageJson.match( versionRegex )[ 0 ];

			// If the passed version matches the version in package.json.
			if ( pluginVersionFlag === strippedVersion ) {
				const currentRCVersion = pluginVersionPackageJson.split( "-RC" )[ 1 ];
				const bumpedRCVersion = parseInt( currentRCVersion, 10 ) + 1;
				pluginVersionFlag = pluginVersionFlag + "-RC" + bumpedRCVersion;
			} else {
				pluginVersionFlag = pluginVersionFlag + "-RC1";
			}
			console.log( pluginVersionFlag );

		}
	);
};
