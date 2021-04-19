import stem from "../../../src/morphology/portuguese/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataPT = getMorphologyData( "pt" ).pt;

const wordsToStem = [
	// Words with suffixes from the first stemming step
	[ "abrasador", "abras" ],
	[ "acessível", "acess" ],
	[ "antropologia", "antropolog" ],
	[ "aparências", "aparent" ],
	[ "comparativamente", "compar" ],
	[ "completamente", "complet" ],
	[ "predominantemente", "predomin" ],
	[ "publicidade", "public" ],
	[ "qualitativas", "qualit" ],
	[ "roubalheiras", "roubalheir" ],
	[ "aeronáutica", "aeronáut" ],
	// Words with verb suffixes
	[ "produziremos", "produz" ],
	[ "proliferaram", "prolifer" ],
	[ "entijolem", "entijol" ],
	// Word ending in -ci after removing a verb suffix
	[ "influenciem", "influenc" ],
	// Word ending in -ci after removing a standard suffix
	[ "financiador", "financ" ],
	// Word ending in -os after removing a verb suffix
	[ "influenciem", "influenc" ],
	// Words with suffixes that should be removed if there were no verb or standard suffixes
	[ "abertos", "abert" ],
	[ "abresi", "abres" ],
	// Words with residual suffixes
	[ "açougue", "açoug" ],
	[ "superfície", "superfíc" ],
	[ "telefone", "telefon" ],
	[ "taça", "tac" ],
];

describe( "Test for stemming Portuguese words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataPT ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );
