var escapeRegExp = require( "lodash/string/escapeRegExp" );

var replaceAll = function( string, mapObject ) {
    var replacementString = escapeRegExp( Object.keys( mapObject ).join( "|" ) ).replace( "\\|", "|" );

    return string.replace( new RegExp( replacementString, "gi" ), function( matched ) {
        return mapObject[ matched.toLowerCase() ];
    } );
};

module.exports = replaceAll;
