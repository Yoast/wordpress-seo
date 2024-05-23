/**
 * A mock factory function.
 *
 * @returns {void}
 */
import { isUndefined } from "lodash";

/**
 * Factory prototype.
 *
 * @constructor
 */
const FactoryProto = function() {};

/**
 * Returns a mock element that lodash accepts as an element
 *
 * @returns {object} Mock HTML element.
 */
FactoryProto.prototype.buildMockElement = function() {
	const mockElement = [];
	mockElement.nodeType = 1;

	return mockElement;
};

/**
 * Returns a mock researcher
 *
 * @param {object}  expectedValue 		The expected value or values.
 * @param {boolean} multiValue    		True if multiple values are expected.
 * @param {boolean} hasMorphologyData	True if the researcher has access to morphology data.
 * @param {Object|boolean} config		Optional config to be used for an assessment.
 * @param {Object|boolean} helpers	Optional helpers to be used for an assessment.
 *
 * @returns {Researcher} Mock researcher.
 */
FactoryProto.prototype.buildMockResearcher = function( expectedValue, multiValue = false, hasMorphologyData = false,
	config = false, helpers = false ) {
	if ( multiValue && ( typeof expectedValue === "object" || typeof helpers === "object" || typeof config === "object" ) ) {
		return {
			/**
			 * Return research results by research name for multi-value mock researchers.
			 *
			 * @param {string} research The name of the research.
			 *
			 * @returns {Object} The results of the research.
			 */
			getResearch: function( research ) {
				return expectedValue[ research ];
			},

			/**
			 * Return whether the worker has the research.
			 * @param {string} research The name of the research.
			 * @returns {boolean} Whether the worker has the research.
			 */
			hasResearch: function( research ) {
				return ! isUndefined( expectedValue[ research ] );
			},

			/**
			 * Adds a research.
			 * @param {string} name The name of the research.
			 * @param {Object} research The research to register.
			 *
			 * @returns {void}
			 */
			addResearch: function( name, research ) {
				expectedValue[ name ] = research;
			},

			/**
			 * Check whether morphology data is available.
			 *
			 * @returns {boolean} True if the researcher has access to morphology data.
			 */
			getData: function() {
				return hasMorphologyData;
			},

			/**
			 * Return the helper to be used for the assessment.
			 * @param {string} name The name of the helper.
			 *
			 * @returns {function} The helper for the assessment.
			 */
			getHelper: function( name ) {
				return helpers[ name ];
			},

			/**
			 * Checks whether a helper with the given name exists.
			 * @param {string} name The name to check.
			 *
			 * @returns {boolean} Trye if the helper exists.
			 */
			hasHelper: function( name ) {
				return ! isUndefined( helpers[ name ] );
			},

			/**
			 * Adds a helper under the given name.
			 * @param {string} name The name.
			 * @param {function} helper The helper.
			 *
			 * @returns {void}
			 */
			addHelper: function( name, helper ) {
				if ( ! helpers ) {
					helpers = {};
				}
				helpers[ name ] = helper;
			},

			/**
			 * Return the config to be used for the assessment.
			 * @param {string} name The name of the config.
			 *
			 * @returns {function} The config for the assessment.
			 */
			getConfig: function( name ) {
				return config[ name ];
			},

			/**
			 * Checks if the config exists.
			 * @param {string} name The name of the config
			 *
			 * @returns {boolean} Whether the config exists.
			 */
			hasConfig: function( name ) {
				return ! isUndefined( config[ name ] );
			},

			/**
			 * Adds a configuration.
			 * @param {string} name The name of the config.
			 * @param {Object} researchConfig The config.
			 *
			 * @returns {void}
			 */
			addConfig: function( name, researchConfig ) {
				config[ name ] = researchConfig;
			},
		};
	}
	return {
		/**
		 * Return research results.
		 *
		 * @returns {Object} The results of the research.
		 */
		getResearch: function() {
			return expectedValue;
		},

		/**
		 * Check whether morphology data is available.
		 *
		 * @returns {boolean} True if the researcher has access to morphology data.
		 */
		getData: function() {
			return hasMorphologyData;
		},

		/**
		 * Return the helpers to be used for the assessment.
		 *
		 * @returns {Object} The helpers for the assessment.
		 */
		getHelper: function() {
			return helpers;
		},

		/**
		 * Return whether the worker has the helper.
		 *
		 * @returns {boolean} Whether the worker has the helper.
		 */
		hasHelper: function() {
			return expectedValue;
		},

		/**
		 * Return the config to be used for the assessment.
		 *
		 * @returns {Object} The config for the assessment results.
		 */
		getConfig: function() {
			return config;
		},

		/**
		 * Return whether the worker has the config.
		 * @param {string} research The name of the config.
		 * @returns {boolean} Whether the worker has the research.
		 */
		hasConfig: function( research ) {
			return ! isUndefined( expectedValue[ research ] );
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
	let resultString = "";

	string = string || "Test ";
	repetitions = repetitions || 1;

	for ( let i = 0; i < repetitions; i++ ) {
		resultString += string;
	}

	return resultString;
};

const Factory = new FactoryProto();

export default Factory;
