/* !
 * jsPOS
 *
 * Copyright 2010, Percy Wegmann
 * Licensed under the LGPLv3 license
 * http://www.opensource.org/licenses/lgpl-3.0.html
 */

var TransformationRules = require( "./BrillTransformationRules" );
var transformationRules = new TransformationRules();

module.exports = POSTagger;
function POSTagger() {
	this.lexicon = require( "./lexicon" );
}

POSTagger.prototype.wordInLexicon = function( word ) {
	var ss = this.lexicon[ word ];
	if ( ss != null ) {
		return true;
	}
	// 1/22/2002 mod (from Lisp code): if not in hash, try lower case:
	if ( ! ss ) {
		ss = this.lexicon[ word.toLowerCase() ];
	}
	if ( ss ) {
		return true;
	}
	return false;
};

POSTagger.prototype.tag = function( words ) {
	var taggedSentence = new Array( words.length );

	// Initialise taggedSentence with words and initial categories
	for ( var i = 0, size = words.length; i < size; i++ ) {
		taggedSentence[ i ] = new Array( 2 );
		taggedSentence[ i ][ 0 ] = words[ i ];
		// lexicon maps a word to an array of possible categories
		var ss = this.lexicon[ words[ i ] ];
		// 1/22/2002 mod (from Lisp code): if not in hash, try lower case:
		if ( ! ss ) {
			ss = this.lexicon[ words[ i ].toLowerCase() ];
		}
		if ( ! ss && ( words[ i ].length === 1 ) ) {
			taggedSentence[ i ][ 1 ] = words[ i ] + "^";
		}
		// We need to catch scenarios where we pass things on the prototype
		// that aren't in the lexicon: "constructor" breaks this otherwise
		if ( ! ss || ( Object.prototype.toString.call( ss ) !== "[object Array]" ) ) {
			taggedSentence[ i ][ 1 ] = "NN";
		} else {
			taggedSentence[ i ][ 1 ] = ss[ 0 ];
		}
	}

	// Apply transformation rules
	taggedSentence.forEach( function( taggedWord, index ) {
		transformationRules.getRules().forEach( function( rule ) {
			rule( taggedSentence, index );
		} );
	} );
	return taggedSentence;
};

POSTagger.prototype.prettyPrint = function( taggedWords ) {
	for ( i in taggedWords ) {
		print( taggedWords[ i ][ 0 ] + "(" + taggedWords[ i ][ 1 ] + ")" );
	}
};

POSTagger.prototype.extendLexicon = function( lexicon ) {
	for ( var word in lexicon ) {
		if ( ! this.lexicon.hasOwnProperty( word ) ) {
			this.lexicon[ word ] = lexicon[ word ];
		}
	}
};

// console.log(new POSTagger().tag(["i", "went", "to", "the", "store", "to", "buy", "5.2", "gallons", "of", "milk"]));
