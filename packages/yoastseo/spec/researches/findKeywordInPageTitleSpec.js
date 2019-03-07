import Researcher from "../../src/researcher";
import morphologyData from "../../premium-configuration/data/morphologyData.json";
import pageTitleKeyword from "../../src/researches/findKeywordInPageTitle.js";
import Paper from "../../src/values/Paper.js";
let result;

describe( "Match keywords in string, regular analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "disabled";
	} );

	it( "returns the exact match at the start of the title and its position", function() {
		const mockPaper = new Paper( "", {
			keyword: "keyword",
			title: "keyword in a string",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns the exact match and its position, keyphrase in middle", function() {
		const mockPaper = new Paper( "", {
			keyword: "keyword",
			title: "a string with a keyword and another keyword",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 16 );
	} );

	it( "returns the exact match and its position, multiple matches", function() {
		const mockPaper = new Paper( "", {
			keyword: "keyword",
			title: "”a string with a keyword and another keyword”",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( false );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( false );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( false );
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
		expect( result.exactMatchFound ).toBe( false );
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
		expect( result.exactMatchFound ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the title for Swedish", function() {
		const mockPaper = new Paper( "", {
			keyword: "promenader i naturen",
			title: "Jag gillar att ta promenader i naturen.",
			locale: "sw_SE",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 18 );
	} );

	it( "returns an exact match at the beginning", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"Walking in the nature\"",
			title: "Walking in the nature is awesome.",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match not at the beginning", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"Walking in the nature\"",
			title: "My opinion: Walking in the nature is awesome.",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.position ).toBe( 12 );
	} );

	it( "returns an exact match not found", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"Walking in the nature\"",
			title: "My opinion: Walking in nature is awesome.",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.allWordsFound ).toBe( false );
	} );
} );

describe( "Match keywords in string, recalibrated analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "enabled";
	} );

	it( "returns the exact match and its position", function() {
		const mockPaper = new Paper( "", {
			keyword: "keyword",
			title: "keyword in a string",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( false );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( false );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( true );
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
		expect( result.exactMatchFound ).toBe( false );
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
		expect( result.exactMatchFound ).toBe( false );
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
		expect( result.exactMatchFound ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the title for Swedish", function() {
		const mockPaper = new Paper( "", {
			keyword: "promenader i naturen",
			title: "Jag gillar att ta promenader i naturen.",
			locale: "sw_SE",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 18 );
	} );

	it( "returns an exact match at the beginning", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"Walking in the nature\"",
			title: "Walking in the nature is awesome.",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match not at the beginning", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"Walking in the nature\"",
			title: "My opinion: Walking in the nature is awesome.",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.position ).toBe( 12 );
	} );

	it( "returns an exact match not found", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"Walking in the nature\"",
			title: "My opinion: Walking in nature is awesome.",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.allWordsFound ).toBe( false );
	} );

	it( "returns an exact match at place 0, even if the title starts with a function word.", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"walking in nature\"",
			title: "The walking in nature",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match at place 0, even if the title starts with multiple function words.", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"walking in nature\"",
			title: "The first walking in nature",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match at place 0, even if the title and the keyphrase start with (multiple) function words.", function() {
		const mockPaper = new Paper( "", {
			keyword: "the very walking in nature",
			title: "First thing, the very walking in nature",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
} );

