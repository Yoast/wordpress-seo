/**
 * A task that updates all the version numbers in the plugin according to the WPSEO_VERSION
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	let versionConfig = [
		{
			versionLineRegEx: /(Stable tag: )(\d(\.\d)?(\.\d)?(\.\d)?)(.*\n)/,
			filePath: "readme.txt"
		},
		{
			versionLineRegEx: /(\* Version: )(\d(\.\d)?(\.\d)?(\.\d)?)(.*\n)/,
			filePath: "wp-seo.php"
		},
		{
			versionLineRegEx: /(define\( \'WPSEO_VERSION\'\, \')(\d(\.\d)?(\.\d)?(\.\d)?)(\' \)\;.*\n)/,
			filePath: "wp-seo-main.php"
		}
	]
	let buildFilePath="build.json";

	let updateVersion = function() {
		let version = JSON.parse(grunt.file.read( buildFilePath )).version;

		versionConfig.forEach( (vc) => {
			let contents = grunt.file.read( vc.filePath ).replace(
				vc.versionLineRegEx,
				'$1' + version + '$6'
			);
			grunt.file.write( vc.filePath, contents );
		} )
	};

	grunt.registerTask(
		"update-version",
		"Updates the version tags in all the right places.",
		updateVersion
	);
}
