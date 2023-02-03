/*
  Transformation rules for Brill's POS tagger
  Copyright (C) 2015 Hugo W.L. ter Doest

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Usage:
// transformationRules = new BrillTransformationRules();
// transformationRules.rules.forEach(function(ruleFunction) {
//   ruleFunction(taggedSentence, i);
// });
// where taggedSentence is an array of arrays of the form:
// [[the, DET], [red, JJ], [book, NN]] and i the position to be processed

function BrillTransformationRules() {
	this.rules = [ rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8 ];
}

BrillTransformationRules.prototype.getRule = function( index ) {
	return ( this.rules[ index ] );
};

BrillTransformationRules.prototype.setRule = function( index, rule ) {
	this.rules[ index ] = rule;
};

BrillTransformationRules.prototype.appendRule = function( rule ) {
	this.rules[ this.rules.length ] = rule;
};

BrillTransformationRules.prototype.setRules = function( newRules ) {
	this.rules = newRules;
};

BrillTransformationRules.prototype.getRules = function() {
	return ( this.rules );
};

/**
 * Indicates whether or not this string starts with the specified string.
 * @param {Object} string
 */
function startsWith( $this, string ) {
	if ( ! string ) {
		return false;
	}
	return $this.indexOf( string ) == 0;
}

/**
 * Indicates whether or not this string ends with the specified string.
 * @param {Object} string
 */
function endsWith( $this, string ) {
	if ( ! string || string.length > $this.length ) {
		return false;
	}
	return $this.indexOf( string ) == $this.length - string.length;
}

//  rule 1: DT, {VBD | VBP} --> DT, NN
function rule1( taggedSentence, index ) {
	if ( ( index > 0 ) && ( taggedSentence[ index - 1 ][ 1 ] === "DT" ) ) {
		if ( ( taggedSentence[ index ][ 1 ] === "VBD" ) ||
            ( taggedSentence[ index ][ 1 ] === "VBP" ) ||
            ( taggedSentence[ index ][ 1 ] === "VB" ) ) {
			taggedSentence[ index ][ 1 ] = "NN";
		}
	}
}

// rule 2: convert a noun to a number (CD) if "." appears in the word
function rule2( taggedSentence, index ) {
	if ( startsWith( taggedSentence[ index ][ 1 ], "N" ) ) {
		if ( taggedSentence[ index ][ 0 ].indexOf( "." ) > -1 ) {
			// url if there are two contiguous alpha characters
			if ( /[a-zA-Z]{2}/.test( taggedSentence[ index ][ 0 ] ) ) {
				taggedSentence[ index ][ 1 ] = "URL";
			} else {
				taggedSentence[ index ][ 1 ] = "CD";
			}
		}
		// Attempt to convert into a number
		if ( ! isNaN( parseFloat( taggedSentence[ index ][ 0 ] ) ) ) {
			taggedSentence[ index ][ 1 ] = "CD";
		}
	}
}

// rule 3: convert a noun to a past participle if words[i] ends with "ed"
function rule3( taggedSentence, index ) {
	if ( startsWith( taggedSentence[ index ][ 1 ], "N" ) && endsWith( taggedSentence[ index ][ 0 ], "ed" ) ) {
		taggedSentence[ index ][ 1 ] = "VBN";
	}
}

// rule 4: convert any type to adverb if it ends in "ly";
function rule4( taggedSentence, index ) {
	if ( endsWith( taggedSentence[ index ][ 0 ], "ly" ) ) {
		taggedSentence[ index ][ 1 ] = "RB";
	}
}

// rule 5: convert a common noun (NN or NNS) to a adjective if it ends with "al"
function rule5( taggedSentence, index ) {
	if ( startsWith( taggedSentence[ index ][ 1 ], "NN" ) && endsWith( taggedSentence[ index ][ 0 ], "al" ) ) {
		taggedSentence[ index ][ 1 ] = "JJ";
	}
}

// rule 6: convert a noun to a verb if the preceding work is "would"
function rule6( taggedSentence, index ) {
	if ( ( index > 0 ) && startsWith( taggedSentence[ index ][ 1 ], "NN" ) && ( taggedSentence[ index - 1 ][ 0 ].toLowerCase() === "would" ) ) {
		taggedSentence[ index ][ 1 ] = "VB";
	}
}

// rule 7: if a word has been categorized as a common noun and it ends with "s",
//         then set its type to plural common noun (NNS)
function rule7( taggedSentence, index ) {
	if ( ( taggedSentence[ index ][ 1 ] === "NN" ) && ( endsWith( taggedSentence[ index ][ 0 ], "s" ) ) ) {
		taggedSentence[ index ][ 1 ] = "NNS";
	}
}

// rule 8: convert a common noun to a present participle verb (i.e., a gerund)
function rule8( taggedSentence, index ) {
	if ( startsWith( taggedSentence[ index ][ 1 ], "NN" ) && endsWith( taggedSentence[ index ][ 0 ], "ing" ) ) {
		taggedSentence[ index ][ 1 ] = "VBG";
	}
}

module.exports = BrillTransformationRules;
