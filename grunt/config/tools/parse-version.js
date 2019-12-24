function parseVersion( versionNumberString ) {
	const versionNumber = ( /(\d+).(\d+).?(\d+)?/g ).exec( versionNumberString );

	return {
		major: parseInt( versionNumber[ 1 ], 10 ),
		minor: parseInt( versionNumber[ 2 ], 10 ),
		patch: parseInt( versionNumber[ 3 ], 10 ) || 0,
	};
}

module.exports = parseVersion;
