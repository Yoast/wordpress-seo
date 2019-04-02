/**
 * A task which removes the vendor_prefixed folder mention from the composer.json in the artifact.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"remove-vendor-prefixed-folder",
		"Removes the vendor_prefixed mention from the composer.json in the artifact",
		function() {
			const composerJsonPath = grunt.config.process( "<%= files.artifactComposer %>/composer.json" );
			// Get the copied composer.json from the artifact-composer folder.
			const currentComposerJson = grunt.file.read( composerJsonPath );

			// Parse the json to make removal of the mention possible.
			const parsedComposerJson = JSON.parse( currentComposerJson );

			// Find the classmap in the composer.json.
			const classmap = parsedComposerJson.autoload.classmap;

			const vendorPrefixedIndex = classmap.indexOf( "vendor_prefixed/" );

			// Make sure we don't get errors when there is no vendor_prefixed mention.
			if ( vendorPrefixedIndex !== -1 ) {
				// Remove the vendor_prefixed mention from the classmap.
				classmap.splice( vendorPrefixedIndex, 1 );
			}

			// Stringify the json again to prepare it for being written to the composer.json file.
			const newComposerJson = JSON.stringify( parsedComposerJson, null, "\t" );

			// Write the changed json content to the composer.json file.
			grunt.file.write( composerJsonPath, newComposerJson );
		}
	);
};
