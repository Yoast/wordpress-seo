import urlKeyword from "../../src/researches/keywordCountInUrl.js";
import Paper from "../../src/values/Paper.js";
import Researcher from "../../src/researcher";
import morphologyData from "../../premium-configuration/data/morphologyData.json";

describe( "test to check url for keyword", function() {
	it( "returns simple matches", function() {
		const paper = new Paper( "", { url: "url-with-keyword", keyword: "keyword" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches for double keywords", function() {
		const paper = new Paper( "", { url: "url-with-key-word", keyword: "key word" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "returns no matches for dashed words", function() {
		const paper = new Paper( "", { url: "url-with-key-word", keyword: "keyword" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 0 } );
	} );

	it( "returns matches with diacritics", function() {
		const paper = new Paper( "", { url: "url-with-key-word", keyword: "këyword" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 0 } );
	} );

	it( "returns matches for three-word long keyphrases", function() {
		const paper = new Paper( "", { url: "url-with-yoast-seo-3", keyword: "yoast seo 3" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 3, percentWordMatches: 100 } );
	} );

	it( "returns matches with apostrophes", function() {
		const paper = new Paper( "", { url: "yoasts-analyzer", keyword: "Yoast's analyzer" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "returns matches with apostrophes", function() {
		const paper = new Paper( "", { url: "yoasts-analyzer", keyword: "Yoast's analyzer" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics (no special locale)", function() {
		const paper = new Paper( "", { url: "http://local.wordpress.test/acción/ ‎", keyword: "acción" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics differences", function() {
		const paper = new Paper( "", { url: "http://local.wordpress.test/accion/ ‎", keyword: "acción" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics differences for Spanish", function() {
		const paper = new Paper( "", { url: "http://local.wordpress.test/accion/ ‎", keyword: "acción", locale: "es_ES" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics for Spanish", function() {
		const paper = new Paper( "", { url: "http://local.wordpress.test/acción/ ‎", keyword: "acción", locale: "es_ES" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics for German", function() {
		const paper = new Paper( "", { url: "http://local.wordpress.test/natürlich/ ‎", keyword: "natürlich", locale: "de_DE" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with special diacritics rules for German", function() {
		const paper = new Paper( "", { url: "http://local.wordpress.test/natuerlich/ ‎", keyword: "natürlich", locale: "de_DE" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics differences for German", function() {
		const paper = new Paper( "", { url: "http://local.wordpress.test/naturlich/ ‎", keyword: "natürlich", locale: "de_DE" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 0 } );
	} );

	it( "returns matches with diacritics differences for Swedish", function() {
		const paper = new Paper( "", { url: "bla-bla-oeverlaatelsebesiktning", keyword: "överlåtelsebesiktning", locale: "sv_SE" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches with diacritics differences for Swedish", function() {
		const paper = new Paper( "", { url: "bla-bla-overlatelsebesiktning", keyword: "överlåtelsebesiktning", locale: "sv_SE" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "does not break for English if no morphology is supplied", function() {
		const paper = new Paper( "", { url: "a-a-a-keyphrase-a-a-a", keyword: "keyphrase", locale: "en_EN" } );
		const researcher = new Researcher( paper );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "uses morphology if supplied", function() {
		const paper = new Paper( "", { url: "a-a-a-keyphrase-a-a-a", keyword: "keyphrases", locale: "en_EN" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "works with multi-word keyphrases", function() {
		const paper = new Paper( "", { url: "key-word-in-slug-how-wonderful", keyword: "key words within slugs are always wonderful", locale: "en_EN" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 4, percentWordMatches: 100 } );
	} );

	it( "works with multi-word keyphrases", function() {
		const paper = new Paper( "", { url: "how-wonderful-key-word-in-slug", keyword: "key words within slugs are always wonderful", locale: "en_EN" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 4, percentWordMatches: 100 } );
	} );

	it( "correctly detects partial match with multi-word keyphrases", function() {
		const paper = new Paper( "", { url: "how-wonderful-a-slug", keyword: "key words within slugs are always wonderful", locale: "en_EN" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 4, percentWordMatches: 50 } );
	} );

	it( "correctly deals with multiple matches with multi-word keyphrases", function() {
		const paper = new Paper( "", { url: "how-wonderful-wonderful-a-wonderful-slug", keyword: "key words within slugs are always wonderful", locale: "en_EN" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 4, percentWordMatches: 50 } );
	} );

	it( "returns matches for keywords in double quotes", function() {
		const paper = new Paper( "", { url: "url-with-key-word", keyword: "\"key word\"" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches for keywords in double quotes", function() {
		const paper = new Paper( "", { url: "url-with-key-word-and-cats-and-dogs", keyword: "\"word and cats and dogs\"" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 100 } );
	} );

	it( "returns matches for keywords in double quotes: ignores morphology", function() {
		const paper = new Paper( "", { url: "url-with-key-word-and-cats-and-dogs", keyword: "\"words and cat and dog\"" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 1, percentWordMatches: 0 } );
	} );

	it( "works with dash as word boundary un url", function() {
		const paper = new Paper( "", { url: "cats_and_dogs", keyword: "cats and dogs" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		expect( urlKeyword( paper, researcher ) ).toEqual( { keyphraseLength: 2, percentWordMatches: 100 } );
	} );
} );
