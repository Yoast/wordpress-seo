/**
 * A mock factory function.
 *
 * @returns {void}
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
			 * Return the config to be used for the assessment.
			 * @param {string} name The name of the config.
			 *
			 * @returns {function} The config for the assessment.
			 */
			getConfig: function( name ) {
				return config[ name ];
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
		 * Return the config to be used for the assessment.
		 *
		 * @returns {Object} The config for the assessment results.
		 */
		getConfig: function() {
			return config;
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
