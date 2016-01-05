// Make sure the Jed object is globally available
Jed = require('jed');
require("../../js/config/config.js");
require("../../js/config/scoring.js");
require("../../js/analyzer.js");
require("../../js/preprocessor.js");
require("../../js/analyzescorer.js");
require("../../js/stringhelper.js");
require("../../js/app.js");
require("../../js/pluggable.js");

_ = require("lodash");

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

/**
 * Ugly code to make a function App object.
 *
 * @param {Object} args The arguments to pass to the new App
 * @returns {YoastSEO.App}
 */
FactoryProto.prototype.buildApp = function( args ) {
	document = {};

	//var dummyElement = document.createElement('div');
	document.createElement = jasmine.createSpy().and.returnValue({});
	document.getElementById = jasmine.createSpy().and.returnValue({
		appendChild: function() {},
		getElementsByClassName: function() {
			return [
				{
					addEventListener: function() {}
				}
			]
		}
	});
	document.getElementsByClassName = function() {
		return [
			{
				addEventListener: function() {}
			}
		]
	};

	_.defaultsDeep( args, {
		callbacks: {
			getData: function() {
				return {
					text: ""
				}
			},
			bindElementEvents: function() {}
		},
		targets: {
			output: ""
		}
	});
	return new YoastSEO.App( args );
};

Factory = new FactoryProto;
