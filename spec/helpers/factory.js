// Make sure the Jed object is globally available
Jed = require('jed');

_ = require("lodash");

var Analyzer = require( "../../js/analyzer.js" );

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
 * @returns {Analyzer}
 */
FactoryProto.prototype.buildAnalyzer = function ( args ) {

	if ( typeof args.i18n === "undefined" ) {
		args.i18n = Factory.buildJed();
		args.locale = 'en_US';
	}

	return new Analyzer( args );
};

/**
 * Returns a mock element that lodash accepts as an element
 */
FactoryProto.prototype.buildMockElement = function() {
	var mockElement;

	mockElement = [];
	mockElement.nodeType = 1;

	return mockElement;
};

Factory = new FactoryProto;

module.exports = Factory;
