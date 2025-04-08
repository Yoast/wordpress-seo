import { keywordCountInSlug as slugKeyword, keywordCountInUrl as urlKeyword } from "../../../src/languageProcessing/researches/keywordCountInUrl.js";
import Paper from "../../../src/values/Paper.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import IndonesianResearcher from "../../../src/languageProcessing/languages/id/Researcher";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyData = getMorphologyData( "en" );
const morphologyDataID = getMorphologyData( "id" );

describe( "test to check slug for keyword", function() {
	it( "returns simple matches", function() {
		const paper = new Paper( "", { slug: "slug-with-keyword", keyword: "keyword" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches for double keywords", function() {
		const paper = new Paper( "", { slug: "slug-with-key-word", keyword: "key word" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "returns no matches for differently dashed words", function() {
		const paper = new Paper( "", { slug: "slug-with-key-word", keyword: "keyword" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 0 } );
	} );

	it( "returns matches for equally dashed words", function() {
		const paper = new Paper( "", { slug: "slug-with-key-word", keyword: "key-word" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "returns matches for equally dashed words with more words around", function() {
		const paper = new Paper( "", { slug: "slug-with-key-word", keyword: "exciting key-word exciting" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 4, percentWordMatches: 50 } );
	} );

	it( "returns matches with diacritics", function() {
		const paper = new Paper( "", { slug: "slug-with-key-word", keyword: "këyword" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 0 } );
	} );

	it( "returns matches for three-word long keyphrases", function() {
		const paper = new Paper( "", { slug: "slug-with-yoast-seo-3", keyword: "yoast seo 3" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 3, percentWordMatches: 100 } );
	} );

	it( "returns matches with apostrophes", function() {
		const paper = new Paper( "", { slug: "yoasts-analyzer", keyword: "Yoast's analyzer" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "returns matches with apostrophes", function() {
		const paper = new Paper( "", { slug: "yoasts-analyzer", keyword: "Yoast's analyzer" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics (no special locale)", function() {
		const paper = new Paper( "", { slug: "acción", keyword: "acción" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics differences", function() {
		const paper = new Paper( "", { slug: "accion", keyword: "acción" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics differences for Spanish", function() {
		const paper = new Paper( "", { slug: "accion", keyword: "acción", locale: "es_ES" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics for Spanish", function() {
		const paper = new Paper( "", { slug: "acción", keyword: "acción", locale: "es_ES" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics for German", function() {
		const paper = new Paper( "", { slug: "natürlich", keyword: "natürlich", locale: "de_DE" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	// it( "returns matches with special diacritics rules for German", function() {
	// 	const paper = new Paper( "", { slug: "natuerlich", keyword: "natürlich", locale: "de_DE" } );
	// 	const researcher = new GermanResearcher( paper );
	// 	researcher.addResearchData( "morphology", morphologyDataDe );
	// 	expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	// } );
	//
	// it( "returns matches with diacritics differences for German", function() {
	// 	const paper = new Paper( "", { slug: "naturlich", keyword: "natürlich", locale: "de_DE" } );
	// 	const researcher = new GermanResearcher( paper );
	// 	researcher.addResearchData( "morphology", morphologyDataDe );
	// 	expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 0 } );
	// } );

	//
	it( "does not break for English if no morphology is supplied", function() {
		const paper = new Paper( "", { slug: "a-a-a-keyphrase-a-a-a", keyword: "keyphrase", locale: "en_EN" } );
		const researcher = new EnglishResearcher( paper );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "uses morphology if supplied", function() {
		const paper = new Paper( "", { slug: "a-a-a-keyphrase-a-a-a", keyword: "keyphrases", locale: "en_EN" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "works with multi-word keyphrases", function() {
		const paper = new Paper( "", { slug: "key-word-in-slug-how-wonderful", keyword: "key words within slugs are " +
				"always wonderful", locale: "en_EN" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 4, percentWordMatches: 100 } );
	} );

	it( "works with multi-word keyphrases", function() {
		const paper = new Paper( "", { slug: "how-wonderful-key-word-in-slug", keyword: "key words within slugs are " +
				"always wonderful", locale: "en_EN" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 4, percentWordMatches: 100 } );
	} );

	it( "correctly detects partial match with multi-word keyphrases", function() {
		const paper = new Paper( "", { slug: "how-wonderful-a-slug", keyword: "key words within slugs are always wonderful", locale: "en_EN" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 4, percentWordMatches: 50 } );
	} );

	it( "correctly deals with multiple matches with multi-word keyphrases", function() {
		const paper = new Paper( "", { slug: "how-wonderful-wonderful-a-wonderful-slug", keyword: "key words within slugs " +
				"are always wonderful", locale: "en_EN" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 4, percentWordMatches: 50 } );
	} );

	it( "returns matches for keywords in double quotes", function() {
		const paper = new Paper( "", { slug: "slug-with-key-word", keyword: "\"key word\"" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches for keywords in double quotes", function() {
		const paper = new Paper( "", { slug: "slug-with-key-word-and-cats-and-dogs", keyword: "\"word and cats and dogs\"" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches for keywords in double quotes: ignores morphology", function() {
		const paper = new Paper( "", { slug: "slug-with-key-word-and-cats-and-dogs", keyword: "\"words and cat and dog\"" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 0 } );
	} );

	it( "works with underscore as word boundary in the slug", function() {
		const paper = new Paper( "", { slug: "cats_and_dogs", keyword: "cats and dogs" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "works with a mix of underscores and hyphens as word boundary in the slug", function() {
		const paper = new Paper( "", { slug: "cats-and_dogs", keyword: "cats and dogs" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "works with a hyphen within the keyword in the slug", function() {
		const paper = new Paper( "", { slug: "buku-buku", keyword: "buku-buku" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "works with multiple hyphens within the keyword in the slug", function() {
		const paper = new Paper( "", { slug: "on-the-go", keyword: "on-the-go" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 3, percentWordMatches: 100 } );
	} );

	it( "works with a hyphen in one of the words within the keyword", function() {
		const paper = new Paper( "", { slug: "two-room-apartment", keyword: "two-room apartment" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		// 'Two' is a function word, that's why the keyphrase length is 2.
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "morphology works for hyphenated keyphrases", function() {
		const paper = new Paper( "", { slug: "ex-husband", keyword: "ex-husbands" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "morphology works for hyphenated keyphrases with function words", function() {
		const paper = new Paper( "", { slug: "husband-to-be", keyword: "husbands-to-be" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		// 'To' and 'be' are function words, that's why the keyphrase length is 1.
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "morphology works for partially hyphenated keyphrases with function words", function() {
		const paper = new Paper( "", { slug: "gift-for-mother-in-law", keyword: "gifts for mothers-in-law" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		// 'For' and 'in' are function words, that's why the keyphrase length is 3.
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 3, percentWordMatches: 100 } );
	} );

	/*
	 * This is an edge case that does not work because 'olds' is not recognized as a form of 'old' (which makes sense),
	 * even though 'two-year-olds' is a valid form of 'two-year-old'.
	 */
	xit( "morphology works for partially hyphenated keyphrases", function() {
		const paper = new Paper( "", { slug: "how-to-entertain-two-year-old", keyword: "how to entertain two-year-olds" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 6, percentWordMatches: 100 } );
	} );

	it( "works with a reduplicated keyphrase in Indonesian", function() {
		const paper = new Paper( "", { slug: "buku-buku", keyword: "buku-buku" } );
		const researcher = new IndonesianResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataID );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "works for reduplicated keyphrase in Indonesian when there's more words in the slug", function() {
		const paper = new Paper( "", { slug: "buku-buku-dan-kucing", keyword: "buku-buku" } );
		const researcher = new IndonesianResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataID );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "works with different forms of a reduplicated keyphrase", function() {
		const paper = new Paper( "", { slug: "buku", keyword: "buku-buku" } );
		const researcher = new IndonesianResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataID );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "works with different forms of a reduplicated keyphrase (with an additional suffix)", function() {
		const paper = new Paper( "", { slug: "buku", keyword: "buku-bukunya" } );
		const researcher = new IndonesianResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataID );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "works with a hyphenated keyphrase that's not a reduplication in Indonesian", function() {
		const paper = new Paper( "", { slug: "kupu-kupu", keyword: "kupu-kupu" } );
		const researcher = new IndonesianResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataID );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "works with different forms of a hyphenated keyphrase in Indonesian that's not a reduplication", function() {
		const paper = new Paper( "", { slug: "pontang-panting", keyword: "berpontang-panting" } );
		const researcher = new IndonesianResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataID );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	/*
	 * 	Cases where one part of a hyphenated form is not a valid form on its own (in this case, "ngayuh") are not matched.
	 *  So in this case, the result for percentWordMatches that we get is 50.
	 */
	xit( "works with different forms of a reduplicated keyphrase in Indonesian, with one word form containing a hyphen" +
		" and the other one not.", function() {
		const paper = new Paper( "", { slug: "kayuh", keyword: "mengayuh-ngayuh" } );
		const researcher = new IndonesianResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataID );
		expect( slugKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );
} );

describe( "tests proper deprecation", function() {
	it( "should return simple matches, but also throw a console warning when using the deprecated research", function() {
		const paper = new Paper( "", { slug: "slug-with-keyword", keyword: "keyword" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const expected = { keyphraseLength: 1, percentWordMatches: 100 };

		const consoleSpy = jest.spyOn( console, "warn" ).mockImplementation();
		expect( urlKeyword( paper, researcher ) ).toEqual( expected );
		expect( consoleSpy ).toHaveBeenCalled();
		expect( consoleSpy ).toHaveBeenCalledTimes( 1 );

		// Also test the alternative way of calling the research via getResearch
		expect( researcher.getResearch( "keywordCountInUrl" ) ).toEqual( expected );
		expect( consoleSpy ).toHaveBeenCalledTimes( 2 );
	} );
} );
