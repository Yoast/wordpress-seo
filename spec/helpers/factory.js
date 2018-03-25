// Make sure the Jed object is globally available
let Jed = require( "jed" );
let FactoryProto = function() {};

FactoryProto.prototype.buildJed = function() {
	return new Jed( {
		domain: "js-text-analysis",
		locale_data: {
			"js-text-analysis": {
				"": {},
			},
		},
	} );
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
FactoryProto.prototype.buildMockResearcher = function( expectedValue, multiValue = false ) {
	if( multiValue && typeof expectedValue === "object" ) {
		return {
			getResearch: function( research ) {
				return expectedValue[ research ];
			},
		};
	}
	return {
		getResearch: function() {
			return expectedValue;
		},
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

	for ( var i = 0; i < repetitions; i++ ) {
		resultString += string;
	}

	return resultString;
};

let Factory = new FactoryProto();

module.exports = Factory;
