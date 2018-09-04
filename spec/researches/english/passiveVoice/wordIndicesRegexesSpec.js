import wordIndicesRegexes from "../../../../src/researches/passiveVoice/periphrastic/getIndicesWithRegex.js";

import cannotDirectlyPrecedePassiveParticipleFactory from "../../../../src/researches/english/functionWords.js";
var cannotDirectlyPrecedePassiveParticiple = cannotDirectlyPrecedePassiveParticipleFactory().cannotDirectlyPrecedePassiveParticiple;
import arrayToRegex from "../../../../src/stringProcessing/createRegexFromArray.js";

var directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticiple );

describe( "a test for matching words that cannot directly precede a participle.", function() {
	it( "matches a single word that cannot directly precede a participle in a sentence part", function() {
		var directPrecedenceExceptionWords = wordIndicesRegexes( "A boy.", directPrecedenceExceptionRegex );
		expect( directPrecedenceExceptionWords ).toEqual(
			[
				{ match: "A", index: 0 },
			]
		);
	} );

	it( "matches multiple words that cannot directly precede a participle in a sentence part", function() {
		var directPrecedenceExceptionWords = wordIndicesRegexes( "The boy, the girl, a dog.", directPrecedenceExceptionRegex );
		expect( directPrecedenceExceptionWords ).toEqual(
			[
				{ match: "The", index: 0 },
				{ match: " the", index: 8 },
				{ match: " a", index: 18 },
			]
		);
	} );

	it( "does not match anything in a sentence part without any words that cannot directly precede a participle", function() {
		var directPrecedenceExceptionWords = wordIndicesRegexes( "was chosen.", directPrecedenceExceptionRegex );
		expect( directPrecedenceExceptionWords ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		var directPrecedenceExceptionWords = wordIndicesRegexes( "", directPrecedenceExceptionRegex );
		expect( directPrecedenceExceptionWords ).toEqual( [] );
	} );
} );

