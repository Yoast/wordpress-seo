// Make sure the Jed object is globally available
Jed = require('jed');

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
 * Returns a mock element that lodash accepts as an element
 */
FactoryProto.prototype.buildMockElement = function() {
	var mockElement;

	mockElement = [];
	mockElement.nodeType = 1;

	return mockElement;
};

/**
 * Returns a mock researcher
 *
 * @returns {Researcher}
 */
FactoryProto.prototype.buildMockResearcher = function( expectedValue ) {
	return {
		getResearch: function() {
			return expectedValue;
		}
	};
};

/**
 * This method repeats a string and returns a new string based on the string and the amount of repetitions.
 * @param string
 * @param times
 * @returns {string}
 */
FactoryProto.prototype.buildMockString = function( string, repetitions ) {
	var resultString = "";

	string = string || "Test ";
	repetitions = repetitions || 1;

	for (var i = 0; i < repetitions; i++) {
		resultString += string;
	}

	return resultString;
};

Factory = new FactoryProto;

module.exports = Factory;
