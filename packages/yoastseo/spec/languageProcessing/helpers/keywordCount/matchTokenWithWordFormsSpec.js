import matchTokenWithWordForms from "../../../../src/languageProcessing/helpers/keywordCount/matchTokenWithWordForms";
import Token from "../../../../src/parse/structure/Token";

/* eslint-disable max-len */
const testCases = [ [ "The wordforms contain the token",  [ "keyword" ] , new Token( "keyword" ), "en_US", true ],
	[ "The wordforms do not contain the token", [  "keyword" ] , new Token( "notkeyword" ), "en_US", false ],
	[ "The wordforms contain the token in a different form: singular matches plural", [  "keyword", "keywords"  ], new Token( "keyword" ), "en_US", true ],
	[ "The wordforms contain the token in a different form: plural matches singular", [ "keyword", "keywords"  ], new Token( "keywords" ), "en_US", true ],
	[ "The wordforms contain the token but with a capital letter", [ "Keyword" ], new Token( "keyword" ), "en_US", true ],
	[ "The wordforms contain the token in a different form: singular matches plural (different locale)", [  "anahtar", "anahtarlar"  ], new Token( "Anahtar" ), "tr_TR", true ],
];
/* eslint-enable max-len */

describe.each( testCases )( "matchTokenWithWordForms", ( testDescription, wordForms, token, locale, expectedResult ) => {
	it( testDescription, () => {
		expect( matchTokenWithWordForms( wordForms, token, locale ) ).toBe( expectedResult );
	} );
} );

