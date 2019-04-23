/**
 * Which features are currently enabled.
 *
 * @type {Object<string,string[]>}
 * @private
 */
const _enabledFeatures = { };

/**
 * Checks whether the given feature is enabled.
 *
 * @param {string} featureName      The name of the feature to check.
 * @param {string} [namespace=""]   An optional namespace to prepend to the feature name. To avoid possible conflicts between packages.
 *
 * @returns {boolean} `true` when the feature is enabled, `false` if not.
 */
const isFeatureEnabled = function( featureName, namespace = "" ) {
	return _enabledFeatures[ namespace ].includes( featureName );
};

/**
 * Enables the features with the given names.
 *
 * @param {string[]} featureNames   A list of names of the features to enable.
 * @param {string} [namespace=""]   An optional namespace to prepend to each feature name. To avoid possible conflicts between packages.
 *
 * @returns {void}
 */
const enableFeatures = function( featureNames, namespace = "" ) {
	// Check whether the features are already enabled, if not: add them.
	featureNames.forEach( name => {
		// Create the namespace if it does not exist yet.
		_enabledFeatures[ namespace ] = _enabledFeatures[ namespace ] || [];

		if ( ! _enabledFeatures[ namespace ].includes( name ) ) {
			_enabledFeatures[ namespace ].push( name );
		}
	} );
};

/**
 * Returns the list of enabled features.
 *
 * @param {string} [namespace=""] An optional namespace. If not provided, only the features on the global namespace are returned.
 *
 * @returns {string[]} The list of enabled features.
 */
const enabledFeatures = function( namespace = "" ) {
	return _enabledFeatures[ namespace ] || [];
};


export {
	isFeatureEnabled,
	enableFeatures,
	enabledFeatures,
};
