module.exports = function( grunt ) {

	/**
	 * Filters Jed JSON to only the strings specified in the filter
	 *
	 * @param {string} file The file path to filter.
	 * @param {string[]} filter The strings to keep.
	 * @param {string} textdomain The textdomain used in the files.
	 * @returns {void}
	 */
	function filterJedJSON( file, filter, textdomain, newTextdomain = "" ) {
		if ( newTextdomain === "" ) {
			newTextdomain = textdomain;
		}

		var content = grunt.file.read( file );
		var json = JSON.parse( content );

		var strings = json.locale_data[ textdomain ];

		Object.keys( strings ).forEach( function( key ) {
			if ( -1 === filter.indexOf( key ) ) {
				delete( strings[ key ] );
			}
		} );

		delete json.locale_data[ textdomain ];
		strings[ "" ].domain = newTextdomain;
		json.locale_data[ newTextdomain ] = strings;

		// This property is added by GlotPress which is unnecessary.
		if ( json.hasOwnProperty( "translation-revision-date" ) ) {
			delete json[ "translation-revision-date" ];
		}

		// This property is added by GlotPress which is unnecessary.
		if ( json.hasOwnProperty( "generator" ) ) {
			delete json.generator;
		}

		json.domain = newTextdomain;

		content = JSON.stringify( json );

		grunt.file.write( file, content );
	}

	/**
	 * Cleans all strings in a Jed JSON files that are not relevant.
	 *
	 * @param {string} relevantStringsJSON   A path to the file that contains the relevant string as a Jed JSON.
	 * @param {string} filesToFilter         A file glob with all files that need to be cleaned.
	 * @param {string} textdomain            The textdomain used in the files.
	 * @param {string} wpGlotPressTextdomain The textdomain that GlotPress puts in te downloaded files.
	 * @param {string} newTextdomain         The desired textdomain in the output files.
	 *
	 * @returns {void}
	 */
	function cleanJSON( relevantStringsJSON, filesToFilter, textdomain, wpGlotPressTextdomain, newTextdomain = "" ) {
		var jsStrings = grunt.file.read( relevantStringsJSON );
		var filter = [];

		jsStrings = JSON.parse( jsStrings );
		jsStrings = jsStrings.locale_data;
		jsStrings = jsStrings[ textdomain ];
		for ( var jsString in jsStrings ) {
			filter.push( jsString );
		}

		var jsonFiles = grunt.file.expand( filesToFilter );
		jsonFiles.forEach( function( file ) {
			filterJedJSON( file, filter, wpGlotPressTextdomain, newTextdomain );
		} );
	}

	/**
	 * Cleans JSON files to remove strings we don't want don't need in a particular file.
	 *
	 * @returns {void}
	 */
	function cleanJSONFiles() {
		cleanJSON( "languages/yoast-seo-js.json", "languages/wordpress-seo-*.json", "wordpress-seo", "messages", "wordpress-seo" );
		cleanJSON( "languages/yoast-components.json", "languages/yoast-components-*.json", "wordpress-seo", "messages", "yoast-components" );
		cleanJSON( "languages/wordpress-seojs.json", "languages/wordpress-seojs-*.json", "wordpress-seo", "messages", "wordpress-seo" );
	}

	grunt.registerTask( "i18n-clean-json", "Cleans JSON files", cleanJSONFiles );
};
