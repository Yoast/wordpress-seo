// Make sure the Jed object is globally available
import Jed from "jed";

const FactoryProto = function() {};

FactoryProto.prototype.buildJed = function() {
	return new Jed( {
		domain: "js-text-analysis",
		locale_data: { // eslint-disable-line camelcase
			"js-text-analysis": {
				"": {},
			},
		},
	} );
};

/**
 * Returns a mock element that lodash accepts as an element
 *
 * @returns {object} Mock HTML element.
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
 * @param {object}  expectedValue The expected value or values.
 * @param {boolean} multiValue    True if multiple values are expected.
 *
 * @returns {Researcher} Mock researcher.
 */
FactoryProto.prototype.buildMockResearcher = function( expectedValue, multiValue = false ) {
	if ( multiValue && typeof expectedValue === "object" ) {
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
 *
 * @param {string} string      String to repeat.
 * @param {int}    repetitions Number of repetitions.
 *
 * @returns {string} The result.
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

const Factory = new FactoryProto();

export default Factory;
