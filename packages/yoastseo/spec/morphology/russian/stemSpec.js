import stem from "../../../src/morphology/russian/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataRU = getMorphologyData( "ru" ).ru;

// The first word in each array is the word, the second one is the expected stem.

const wordsToStem = [
	// Words with perfective gerund suffix.
	[ "прочитав", "прочит" ],
	// Words with noun suffixes
	[ "записей", "запис" ],
	[ "записями", "запис" ],
	[ "арестантов", "арестант" ],
	[ "чистота", "чистот" ],
	// Words with verb suffixes
	[ "читаете", "чита" ],
	[ "читаем", "чита" ],
	[ "читали", "чита" ],
	[ "читал", "чита" ],
	[ "читаю", "чита" ],
	[ "читала", "чита" ],
	// Words with adjective suffixes
	[ "большой", "больш" ],
	[ "синий", "син" ],
	// Words with participle suffixes
	[ "встречавшем", "встреч" ],
	[ "читанный", "чита" ],
	[ "доставшихся", "дост" ],
	// Words with reflexive suffixes
	[ "вымыться", "вым" ],
	[ "оденусь", "оден" ],
	// Words with superlative suffixes
	[ "труднейш", "трудн" ],
	[ "глупейше", "глуп" ],
	// Words with derivational suffixes
	[ "глупость", "глуп" ],
	[ "глупости", "глуп" ],
	[ "глупостью", "глуп" ],
	[ "глупостями", "глуп" ],
	[ "глупостях", "глуп" ],
	[ "бездыханность",  "бездыхан" ],
	[ "восторженностью", "восторжен" ],
];


describe( "Test for stemming Russian words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordPairToCheck = wordsToStem[ i ];
		const wordToStem = wordPairToCheck[ 0 ];
		const expectedStem = wordPairToCheck[ 1 ];
		const realStem = stem( wordToStem, morphologyDataRU );
		it( "stems the word " + wordToStem + " and gets the stem " + realStem, () => {
			expect( realStem ).toBe( expectedStem );
		} );
	}
} );
