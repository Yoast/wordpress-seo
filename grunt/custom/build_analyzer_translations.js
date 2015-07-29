/**
 * Task to generate a PHP translations file based on a json translation file.
 *
 * The format for the file should be:
 * {
 *   "translationKey": {
 *     "text": "The text for this translation",
 *     "comment": "The comment for this translation"
 *   }
 * }
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask( 'build_analyzer_translations', 'Build analyzer PHP translation file', function () {

		var arrayTemplate = "<?php\n" +
		                    "$translations = array(\n" +
		                    "<%= arrayContent %>" +
		                    ");";

		var stringTemplate = "<% if ( stringComment ) { %>" +
		                     "\t/* Translators: <%= stringComment %> */\n" +
		                     "<% } %>" +
		                     "\t'<%= stringName %>' => __( '<%= stringText %>', 'wordpress-seo' ),\n";

		var arrayContent = "", html, data, comment, text, srcJSON, fileContent;

		this.files.forEach( function( file ) {
			file.src.forEach( function( srcFile ) {

				// Read the translations JSON.
				srcJSON = JSON.parse( grunt.file.read( srcFile ) );

				// Generate a translation function for each string.
				Object.keys( srcJSON ).forEach( function( key ) {
					comment = srcJSON[ key ].comment;
					text = srcJSON[ key ].text;

					if ( undefined === text ) {
						grunt.fail.fatal( 'String "' + key + '" has no text defined' );
					}

					console.log( text, escapePHPString( text ) );

					data = {
						stringName: key,
						stringText: escapePHPString( text ),
						stringComment: undefined !== comment ? comment : ''
					};

					html = grunt.template.process( stringTemplate, { "data": data } );

					arrayContent += html;
				});
			});

			fileContent = grunt.template.process( arrayTemplate, { "data": { "arrayContent": arrayContent } } );
			grunt.file.write( file.dest, fileContent );
		});
	});

	/**
	 * Escapes a string for use in PHP
	 *
	 * @param string string
	 * @return string
	 */
	function escapePHPString( string ) {
		string = string.replace( "'", "\\'" );

		return string;
	}
};
