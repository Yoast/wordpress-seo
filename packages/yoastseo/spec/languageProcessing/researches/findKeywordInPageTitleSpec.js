import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import GermanResearcher from "../../../src/languageProcessing/languages/de/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import RussianResearcher from "../../../src/languageProcessing/languages/ru/Researcher";
import SwedishResearcher from "../../../src/languageProcessing/languages/sv/Researcher";
import TurkishResearcher from "../../../src/languageProcessing/languages/tr/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import getMorphologyData from "../../specHelpers/getMorphologyData";
import pageTitleKeyword from "../../../src/languageProcessing/researches/findKeyphraseInSEOTitle.js";
import Paper from "../../../src/values/Paper.js";

const morphologyData = getMorphologyData( "en" );
const morphologyDataDE = getMorphologyData( "de" ).de;
const morphologyDataFR = getMorphologyData( "fr" ).fr;
const morphologyDataRU = getMorphologyData( "ru" ).ru;
const morphologyDataTR = getMorphologyData( "tr" ).tr;

let result;

// eslint-disable-next-line max-statements
describe( "Matches keywords in string", function() {
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
		const researcher = new RussianResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataRU );

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
		const researcher = new GermanResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataDE );

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

	it( "returns the exact match and its position for German for two matches", function() {
		const mockPaper = new Paper( "", {
			keyword: "äbc",
			title: "äbc und abc",
		} );
		const researcher = new GermanResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataDE );

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
		const researcher = new GermanResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataDE );

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
		const researcher = new GermanResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataDE );

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
			title: "They showed interest in the computer science book",
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
		const researcher = new FrenchResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataFR );

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
		const researcher = new SwedishResearcher( mockPaper );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 18 );
	} );
	it( "returns non-exact match for Turkish if the keyphrase starts with an upper case and has a suffix with an apostrophe", function() {
		let mockPaper = new Paper( "", {
			keyword: "atade",
			title: "Atadeniz'in",
			locale: "tr_TR",
		} );
		let researcher = new TurkishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataTR );
		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.position ).toBe( -1 );

		mockPaper = new Paper( "", {
			keyword: "radyo",
			title: "Radyosu'nun",
			locale: "tr_TR",
		} );
		researcher = new TurkishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataTR );
		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.position ).toBe( -1 );
	} );

	it( "returns an exact match for Turkish if the keyphrase has a suffix with an apostrophe", function() {
		const mockPaper = new Paper( "", {
			keyword: "radyosu'nun",
			title: "radyosu'nun",
			locale: "tr_TR",
		} );
		const researcher = new TurkishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataTR );
		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
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

	it( "returns the correct results when function words list is not available", function() {
		const mockPaper = new Paper( "", {
			keyword: "the very walking in nature",
			title: "First thing, the very walking in nature",
		} );
		const researcher = new DefaultResearcher( mockPaper );

		result = pageTitleKeyword( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 13 );
	} );
} );

