import { isUndefined } from "lodash";

/**
 * FactoryProto is a mock factory function.
 *
 */
export default class FactoryProto {
	/**
	 * Returns a mock element that lodash accepts as an element.
	 *
	 * @returns {object} Mock HTML element.
	 */
	static buildMockElement() {
		const mockElement = [];
		mockElement.nodeType = 1;

		return mockElement;
	}

	/**
	 * Returns a mock researcher.
	 *
	 * @param {Object} expectedValue Expected value.
	 * @param {boolean} [multiValue=false] Whether the researcher has multiple values.
	 * @param {boolean} [hasMorphologyData=false] Whether the researcher has morphology data.
	 * @param {Object|boolean} [config=false] Optional config to be used for an assessment.
	 * @param {Object|boolean} [helpers=false] Optional helpers to be used for an assessment.
	 *
	 * @returns {Object} Mock researcher.
	 */
	static buildMockResearcher( expectedValue, multiValue = false, hasMorphologyData = false,
		config = false, helpers = false ) {
		if ( multiValue && ( typeof expectedValue === "object" || typeof helpers === "object" || typeof config === "object" ) ) {
			return {
				/**
				 * Returns research results by research name for multi-value mock researches.
				 *
				 * @param {string} research The name of the research.
				 *
				 * @returns {Object} The results of the research.
				 */
				getResearch: function( research ) {
					return expectedValue[ research ];
				},

				/**
				 * Returns whether the worker has the specified research.
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
				 * Checks whether morphology data is available.
				 *
				 * @returns {boolean} True if the researcher has access to morphology data.
				 */
				getData: function() {
					return hasMorphologyData;
				},

				/**
				 * Returns the helper to be used for the assessment.
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
				 * @returns {boolean} True if the helper exists.
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
				 * Returns the config to be used for the assessment.
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
			 * Returns research results.
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
			 * Returns the helpers to be used for the assessment.
			 *
			 * @returns {Object} The helpers for the assessment.
			 */
			getHelper: function() {
				return helpers;
			},

			/**
			 * Checks whether a helper with the given name exists.
			 * @param {string} name The name to check.
			 *
			 * @returns {boolean} True if the helper exists.
			 */
			hasHelper: function( name ) {
				return ! isUndefined( helpers[ name ] );
			},

			/**
			 * Returns the config to be used for the assessment.
			 *
			 * @returns {Object} The config for the assessment results.
			 */
			getConfig: function() {
				return config;
			},

			/**
			 * Returns whether the worker has the specified config.
			 * @param {string} name The name of the config.
			 * @returns {boolean} Whether the worker has the specified config.
			 */
			hasConfig: function( name ) {
				return ! isUndefined( expectedValue[ name ] );
			},
		};
	}

	/**
	 * This method repeats a string and returns a new string based on the string and the amount of repetitions.
	 *
	 * @param {string} string      String to repeat.
	 * @param {int}    repetitions Number of repetitions.
	 *
	 * @returns {string} The result.
	 */
	static buildMockString( string, repetitions ) {
		let resultString = "";

		string = string || "Test ";
		repetitions = repetitions || 1;

		for ( let i = 0; i < repetitions; i++ ) {
			resultString += string;
		}

		return resultString;
	}
}
