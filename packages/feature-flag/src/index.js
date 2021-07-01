/**
 * Checks whether the given feature is enabled.
 *
 * @param {string} featureName      The name of the feature to check.
 *
 * @returns {boolean} `true` when the feature is enabled, `false` if not.
 */
const isFeatureEnabled = function( featureName ) {
	if ( self.wpseoFeatureFlags ) {
		return self.wpseoFeatureFlags.includes( featureName );
	}
	return false;
};

/**
 * Enables the features with the given names.
 *
 * @param {string[]} featureNames   A list of names of the features to enable.
 *
 * @returns {void}
 */
const enableFeatures = function( featureNames ) {
	// If no features have been enabled yet, initialize the global array.
	if ( ! self.wpseoFeatureFlags ) {
		self.wpseoFeatureFlags = [];
	}

	// Check whether the features are already enabled, if not: add them.
	featureNames.forEach( name => {
		if ( ! self.wpseoFeatureFlags.includes( name ) ) {
			self.wpseoFeatureFlags.push( name );
		}
	} );
};

/**
 * Returns the list of enabled features.
 *
 * @returns {string[]} The list of enabled features.
 */
const enabledFeatures = function() {
	return self.wpseoFeatureFlags || [];
};


export {
	isFeatureEnabled,
	enableFeatures,
	enabledFeatures,
};
