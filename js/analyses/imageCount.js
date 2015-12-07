var imageAlttagFunction = require( "../stringProcessing/imageAlttags.js" );
var wordMatch = require( "../stringProcessing/wordMatch.js" );

module.exports = function( text, keyword ) {
	var imageCount = { total: 0, alt: 0, noAlt: 0, altKeyword: 0, altNaKeyword: 0 };
	var alttag;

	//matches everything in the <img>-tag, case insensitive and global
	var imageMatches = text.match( /<img(?:[^>]+)?>/ig );
	if ( imageMatches !== null ) {
		imageCount.total = imageMatches.length;
		for ( var i = 0; i < imageMatches.length; i++ ) {
			alttag = imageAlttagFunction( imageMatches[i] );
			if ( alttag !== "" ) {
				if ( keyword !== "" ) {
					if ( wordMatch( alttag, keyword ) > 0 ) {
						imageCount.altKeyword++;
					} else {

						//this counts all alt-tags w/o the keyword when a keyword is set.
						imageCount.alt++;
					}
				} else {
					imageCount.altNaKeyword++;
				}
			} else {
				imageCount.noAlt++;
			}
		}
	}
	return imageCount;
};
