/* global require, module */
/**
 * Flattens a version for usage in a filename.
 *
 * @param {string} version The version to flatten.
 *
 * @returns {string} The flattened version.
 */
function flattenVersionForFile( version ) {
    let versionParts = version.split( "." );
    if ( versionParts.length === 2 && /^\d+$/.test( versionParts[ 1 ] ) ) {
        versionParts.push( 0 );
    }

    return versionParts.join( "" );
}

module.exports = {
    flattenVersionForFile,
};
