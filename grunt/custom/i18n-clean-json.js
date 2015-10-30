module.exports = function( grunt ) {

	grunt.registerTask( 'i18n-clean-json', 'Cleans JSON files', cleanJSON );

	function cleanJSON() {
		var jsStrings = grunt.file.read( 'languages/yoast-seo.json' );
		var filter = [];

		jsStrings = JSON.parse( jsStrings );
		jsStrings = jsStrings.locale_data;
		jsStrings = jsStrings['wordpress-seo'];
		for ( var jsString in jsStrings ) {
			filter.push( jsString );
		}

		var jsonFiles = grunt.file.expand( 'languages/wordpress-seo-*.json' );
		jsonFiles.forEach( function( file ) {
			filterJedJSON( file, filter );
		});
	}

	/**
	 * Filters Jed JSON to only the strings specified in the filter
	 */
	function filterJedJSON( file, filter ) {
		var content = grunt.file.read( file );
		var json = JSON.parse( content );

		var strings = json.locale_data['wordpress-seo'];

		var length = strings.length;

		Object.keys( strings ).forEach( function( key ) {
			if ( -1 === filter.indexOf( key ) ) {
				delete( strings[ key ] );
			}
		});

		json.locale_data['wordpress-seo'] = strings;
		content = JSON.stringify( json );

		grunt.file.write( file, content );
	}
};
