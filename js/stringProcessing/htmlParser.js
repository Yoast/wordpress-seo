let htmlparser = require( "htmlparser2" );

let textArray;
let inScriptBlock = false;
let inlineTags = [ "script", "style" ];

let parser = new htmlparser.Parser( {
	onopentag: function( name ) {
		if ( inlineTags.includes( name ) ) {
			inScriptBlock = true;
		} else {
			textArray.push( "<" + name + ">" );
		}
	},
	ontext: function( text ) {
		if ( ! inScriptBlock ) {
			textArray.push( text );
		}
	},
	onclosetag: function( name ) {
		if( inlineTags.includes( name ) ) {
			inScriptBlock = false;
		} else {
			textArray.push( "</" + name + ">" );
		}
	},
}, { decodeEntities: true } );

module.exports = function( text ) {
	textArray = [];
	parser.write( text );
	return textArray.join("");
};
