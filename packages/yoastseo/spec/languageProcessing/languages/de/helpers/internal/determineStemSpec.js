import determineStem from "../../../../../../src/languageProcessing/languages/de/helpers/internal/determineStem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;

const wordsToStem = [
	// Default stemmer
	[ "studenten", "student" ],
	// Nouns: exceptionStems with one plural matching multiple singulars
	[ "stadium", "stadi" ],
	[ "stadion", "stadi" ],
	[ "stadien", "stadi" ],
	// Adjectives: elStemChange
	[ "inakzeptabl", "inakzeptabel" ],
	// Adjectives: erStemChangeClass1
	[ "integr", "integ" ],
	// Adjectives: erStemChangeClass2
	[ "saur", "sau" ],
	// Adjectives: erStemChangeClass3
	[ "tapfr", "tapf" ],
	// Adjectives: secondStemCompSup
	[ "jüng", "jung" ],
	// Adjectives: bothStemsCompSup
	[ "glätt", "glatt" ],
	// Verbs: strongVerbs
	[ "fraß", "fress" ],
	// Verbs: strongVerbs prefixed
	[ "überfraß", "überfress" ],
	// Verbs: strongVerbs, not treated as prefixed
	[ "berg", "berg" ],
	// Participles
	[ "heraufgeholt", "heraufhol" ],
	[ "gefürchtet", "fürcht" ],
	// Irregular verbs
	[ "brennst", "brenn" ],
	[ "brachten", "bring" ],
	[ "brenne", "brenn" ],
	[ "brenntest", "brenn" ],
	[ "standen", "stand" ],
	[ "stehest", "steh" ],
	[ "wissen", "wiss" ],
	// Some more tests
	[ "häuser", "haus" ],
	[ "personen", "person" ],
	[ "züge", "zug" ],
	[ "sonderzüge", "sonderzug" ],
	[ "abgötter", "abgott" ],
	[ "Altbauwohnungen", "Altbauwohnung" ],
	[ "Altersdiskriminierung", "Altersdiskriminierung" ],
	[ "Kraftwerke", "Kraftwerk" ],
];

describe.each( wordsToStem )( "Test for determining stems for German words", ( word, stem ) => {
	it( "stems for German word " + word + " to " + stem, () => {
		expect( determineStem( word, morphologyDataDE ) ).toBe( stem );
	} );
} );

const umlautExceptions = [
	// A noun that gets umlaut in plural
	[ "vögel", "vogel" ],
	[ "läden", "laden" ],
	// A noun that gets umlaut and an irregular plural dative suffix
	[ "müttern", "mutter" ],
	[ "schwägern", "schwager" ],
	// A noun that gets umlaut and a regular case suffix
	[ "bädern", "bad" ],
	[ "ängsten", "angst" ],
	[ "hände", "hand" ],
	// A noun that gets umlaut and -e in plural
	[ "häuse", "haus" ],
	[ "ängste", "angst" ],
	// A noun that gets umlaut and -er in plural
	[  "männer", "mann" ],
	[ "wörter", "wort" ],
	// compound noun that gets umlaut in plural
	[ "raubvögel", "raubvogel" ],
	// compound noun that gets umlaut and -e in plural
	[ "landflüchte", "landflucht" ],
	[ "geschwülst", "geschwulst" ],
	[ "feuersbrünst", "feuersbrunst" ],
	[ "hirschbrünft", "hirschbrunft" ],
	[ "brünst", "brunst" ],
	[ "lebensbrünst", "lebensbrunst" ],
	[ "liebesbrünst", "liebesbrunst" ],
	// More umlaut nouns from all groups
	[ "schwäger", "schwager" ],
	[ "schäden", "schaden" ],
	[ "töchter", "tochter" ],
	[ "brünst", "brunst" ],
	[ "brüder", "bruder" ],
	[ "gärten", "garten" ],
	[ "gräben", "graben" ],
	[ "kästen", "kasten" ],
	[ "mütter", "mutter" ],
	[ "läden", "laden" ],
	[ "väter", "vater" ],
	[ "füchs", "fuchs" ],
	[ "ärzte", "arzt" ],
	[ "gäns", "gans" ],
	[ "häls", "hal" ],
	[ "äxte", "axt" ],
	[ "äste", "ast" ],
];

describe.each( umlautExceptions )( "Test for determining stems for German words with umlauts", ( word, stem ) => {
	it( "stems for German word with umlaut " + word + " to " + stem, () => {
		expect( determineStem( word, morphologyDataDE ) ).toBe( stem );
	} );
} );
