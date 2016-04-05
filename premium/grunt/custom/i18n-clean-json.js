module.exports = function( grunt ) {
	grunt.registerMultiTask( 'i18n-clean-json', 'Cleans JSON files', cleanJSON );

	function cleanJSON() {
		var options = this.options({});
		var textdomain = options.textdomain;
		var baseFile = options.baseFile;

		var jsStrings = grunt.file.read( baseFile );
		var filter = [];

		jsStrings = JSON.parse( jsStrings );
		jsStrings = jsStrings.locale_data;
		jsStrings = jsStrings[textdomain];
		for ( var jsString in jsStrings ) {
			filter.push( jsString );
		}

		this.files.forEach(function(line) {
			line.src.forEach( function(file) {
				filterJedJSON( file, filter, textdomain, textdomain );
			});
		});
	}

	/**
	 * Filters Jed JSON to only the strings specified in the filter
	 *
	 * @param {string} file The file to process.
	 * @param {Array} filter The allowed strings in the output file.
	 * @param {string} oldTextdomain The textdomain with which the strings were translated.
	 * @param {string} newTextdomain The textdomain to put in the output file.
	 */
	function filterJedJSON( file, filter, oldTextdomain, newTextdomain ) {
		var content = grunt.file.read( file );
		var json = JSON.parse( content );

		var strings = json.locale_data[oldTextdomain];

		var length = strings.length;

		Object.keys( strings ).forEach( function( key ) {
			if ( -1 === filter.indexOf( key ) ) {
				delete( strings[ key ] );
			}
		});

		json.locale_data[newTextdomain] = strings;
		content = JSON.stringify( json );

		grunt.file.write( file, content );
	}
};
