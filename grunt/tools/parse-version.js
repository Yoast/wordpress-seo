/**
 * @typedef {Object} Version
 * @property {number} major Major version
 * @property {number} minor Minor version
 * @property {number} patch Patch version
 */

/**
 * Splits up the version parts from a version string.
 *
 * @param {string} versionNumberString The version number as a string.
 *
 * @returns {Version} The parsed version number.
 */
function parseVersion( versionNumberString ) {
	const versionNumber = ( /(\d+).(\d+).?(\d+)?/g ).exec( versionNumberString );

	return {
		major: parseInt( versionNumber[ 1 ], 10 ),
		minor: parseInt( versionNumber[ 2 ], 10 ),
		patch: parseInt( versionNumber[ 3 ], 10 ) || 0,
	};
}

module.exports = parseVersion;
