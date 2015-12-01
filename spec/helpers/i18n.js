// Make sure the Jed object is globally available
Jed = require('jed');

FactoryProto = function(){};

FactoryProto.prototype.buildJed = function() {
	return new Jed({
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	});
};

/**
 * Returns an analyzer object for testing with default args
 *
 * @param {Object} args
 *
 * @returns {YoastSEO.Analyzer}
 */
FactoryProto.prototype.buildAnalyzer = function ( args ) {

	if ( typeof args.i18n === "undefined" ) {
		args.i18n = Factory.buildJed();
		args.locale = 'en_US';
	}

	return new YoastSEO.Analyzer( args );
};

Factory = new FactoryProto;
