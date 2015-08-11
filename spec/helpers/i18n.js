// Make sure the Jed object is globally available
Jed = require('jed');

Factory = {
	/**
	 * Returns an analyzer object for testing with default args
	 *
	 * @param {Object} args
	 *
	 * @returns {YoastSEO.Analyzer}
	 */
	buildAnalyzer: function ( args ) {

		if ( typeof args.i18n === "undefined" ) {
			args.i18n = new Jed( {
				"domain": "js-text-analysis",
				"locale_data": {
					"js-text-analysis": {
						"": {}
					}
				}
			} );
		}

		return new YoastSEO.Analyzer( args );
	}
};
