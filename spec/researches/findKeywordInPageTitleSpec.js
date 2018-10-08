import Researcher from "../../src/researcher";
import morphologyData from "../../src/morphology/morphologyData.json";
import pageTitleKeyword from "../../src/researches/findKeywordInPageTitle.js";
import Paper from "../../src/values/Paper.js";
let result;

describe( "Match keywords in string", function() {
	it( "returns the exact match and its position", function() {
		const mockPaper = new Paper( "", {
			keyword: "keyword",
			title: "keyword in a string",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns the exact match and its position", function() {
		const mockPaper = new Paper( "", {
			keyword: "keyword",
			title: "a string with a keyword and another keyword",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 16 );
	} );

	it( "returns the exact match and its position", function() {
		const mockPaper = new Paper( "", {
			keyword: "keyword",
			title: "”a string with a keyword and another keyword”",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 17 );
	} );

	it( "returns no match for empty keyword", function() {
		const mockPaper = new Paper( "", {
			keyword: "",
			title: "a string with words",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( false );
		expect( result.allWordsFound ).toBe( false );
	} );

	it( "returns the exact match and its position for cyrillic", function() {
		const mockPaper = new Paper( "", {
			keyword: "нечто",
			title: "ст, чтобы проверить нечто Test текст, чтобы ",
			locale: "ru_RU",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 20 );
	} );

	it( "returns the exact match and its position for German", function() {
		const mockPaper = new Paper( "", {
			keyword: "äbc",
			title: "äbc",
			locale: "de_DE",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns no match with dash", function() {
		const mockPaper = new Paper( "", {
			keyword: "focus keyword",
			title: "focus-keyword",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( false );
		expect( result.position ).toBe( -1 );
	} );

	it( "returns the exact match and its position with different cases", function() {
		const mockPaper = new Paper( "", {
			keyword: "Focus Keyword",
			title: "focus keyword",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns the exact match and its position for matches with special characters", function() {
		const mockPaper = new Paper( "", {
			keyword: "$keyword",
			title: "A title with a $keyword",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 15 );
	} );

	it( "returns the exact match and its position for Turkish", function() {
		const mockPaper = new Paper( "", {
			keyword: "Istanbul",
			title: "İstanbul and the rest of Turkey",
			locale: "tr_TR",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns the exact match and its position for Turkish", function() {
		const mockPaper = new Paper( "", {
			keyword: "İstanbul",
			title: "İstanbul and the rest of Turkey",
			locale: "tr_TR",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns the exact match and its position for German for two matches", function() {
		const mockPaper = new Paper( "", {
			keyword: "äbc",
			title: "äbc und abc",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns number of matches and position for German for two matches", function() {
		const mockPaper = new Paper( "", {
			keyword: "äbc",
			title: "äbc und abc",
			locale: "de_DE",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns number of matches and position for German for two matches", function() {
		const mockPaper = new Paper( "", {
			keyword: "äbc",
			title: "äbc und Äbc",
			locale: "de_DE",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the title", function() {
		const mockPaper = new Paper( "", {
			keyword: "interesting books about computer science",
			title: "interesting science books on my computer",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the title and used in different forms", function() {
		const mockPaper = new Paper( "", {
			keyword: "interesting books about computer science",
			title: "interestingly, I have a science book on my computer",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the title for French", function() {
		const mockPaper = new Paper( "", {
			keyword: "chez Paul",
			title: "Je m'appele Paul",
			locale: "fr_FR",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the title for French", function() {
		const mockPaper = new Paper( "", {
			keyword: "promenader i naturen",
			title: "Jag gillar att ta promenader i naturen.",
			locale: "sw_SE",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatch ).toBe( true );
		expect( result.position ).toBe( 18 );
	} );
} );

