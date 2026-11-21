import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import GermanResearcher from "../../../src/languageProcessing/languages/de/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import RussianResearcher from "../../../src/languageProcessing/languages/ru/Researcher";
import SwedishResearcher from "../../../src/languageProcessing/languages/sv/Researcher";
import TurkishResearcher from "../../../src/languageProcessing/languages/tr/Researcher";
import ArabicResearcher from "../../../src/languageProcessing/languages/ar/Researcher";
import HebrewResearcher from "../../../src/languageProcessing/languages/he/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import IndonesianResearcher from "../../../src/languageProcessing/languages/id/Researcher";
import getMorphologyData from "../../specHelpers/getMorphologyData";
import findKeyphraseInSEOTitle from "../../../src/languageProcessing/researches/findKeyphraseInSEOTitle.js";
import Paper from "../../../src/values/Paper.js";

const morphologyData = getMorphologyData( "en" );
const morphologyDataDE = getMorphologyData( "de" ).de;
const morphologyDataFR = getMorphologyData( "fr" ).fr;
const morphologyDataRU = getMorphologyData( "ru" ).ru;
const morphologyDataTR = getMorphologyData( "tr" ).tr;
const morphologyDataID = getMorphologyData( "id" ).id;
const morphologyDataAR = getMorphologyData( "ar" );
const morphologyDataHE = getMorphologyData( "he" );

let result;

describe( "Matches keyphrase in SEO title", function() {
	it( "returns the exact match and its position", function() {
		const mockPaper = new Paper( "", {
			keyword: "keyword",
			title: "keyword in a string",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 17 );
	} );

	it( "returns the exact match and its position for keywords with a period in the beginning of a title", function() {
		const mockPaper = new Paper( "", {
			keyword: ".rar",
			title: ".rar files",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns the exact match and its position for keywords with a period not in the beginning of a title", function() {
		const mockPaper = new Paper( "", {
			keyword: ".rar",
			title: "files in .rar",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 10 );
	} );

	it( "returns no match for empty keyword", function() {
		const mockPaper = new Paper( "", {
			keyword: "",
			title: "a string with words",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.position ).toBe( -1 );
	} );

	it( "returns no match with dot", function() {
		const mockPaper = new Paper( "", {
			keyword: "focus keyword",
			title: "focus .keyword",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the SEO title", function() {
		const mockPaper = new Paper( "", {
			keyword: "interesting books about computer science",
			title: "interesting science books on my computer",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the SEO title and used in different forms", function() {
		const mockPaper = new Paper( "", {
			keyword: "interesting books about computer science",
			title: "They showed interest in the computer science book",
			locale: "en_EN",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the SEO title for French", function() {
		const mockPaper = new Paper( "", {
			keyword: "chez Paul",
			title: "Je m'appele Paul",
			locale: "fr_FR",
		} );
		const researcher = new FrenchResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataFR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
	} );

	it( "returns all-words-found match if keyphrase words were shuffled in the SEO title for Swedish", function() {
		const mockPaper = new Paper( "", {
			keyword: "promenader i naturen",
			title: "Jag gillar att ta promenader i naturen.",
			locale: "sw_SE",
		} );
		const researcher = new SwedishResearcher( mockPaper );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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
		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.position ).toBe( -1 );

		mockPaper = new Paper( "", {
			keyword: "radyo",
			title: "Radyosu'nun",
			locale: "tr_TR",
		} );
		researcher = new TurkishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataTR );
		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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
		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.allWordsFound ).toBe( false );
	} );

	it( "returns an exact match at place 0, even if the SEO title starts with a function word.", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"walking in nature\"",
			title: "The walking in nature",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match at place 0, even if the SEO title starts with a function word (Arabic).", function() {
		const mockPaper = new Paper( "", {
			keyword: "القطط",
			title: "بسبب القطط حياتي جيدة",
		} );
		const researcher = new ArabicResearcher( mockPaper );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match at place 0, even if the SEO title starts with a function word (Hebrew).", function() {
		const mockPaper = new Paper( "", {
			keyword: "חתולים",
			title: "בקיצור חתולים הם הטובים ביותר",
		} );
		const researcher = new HebrewResearcher( mockPaper );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match at place 0, even if the SEO title starts with multiple function words.", function() {
		const mockPaper = new Paper( "", {
			keyword: "\"walking in nature\"",
			title: "The first walking in nature",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match at place 0, even if the SEO title and the keyphrase start with (multiple) function words.", function() {
		const mockPaper = new Paper( "", {
			keyword: "the very walking in nature",
			title: "First thing, the very walking in nature",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match at place 0, even if the function word preceding the keyphrase is attached to it with a hyphen", function() {
		const mockPaper = new Paper( "", {
			keyword: "school activities",
			title: "after-school activities",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match at place 0, even if the keyphrase is preceded by function words separated by hyphens", function() {
		const mockPaper = new Paper( "", {
			keyword: "suits for boys",
			title: "three-piece suits for boys",
		} );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "returns an exact match at place 0, even if the keyphrase is preceded by function words separated by hyphens," +
		"also in a language where hyphens should be treated as word boundaries in other cases", function() {
		const mockPaper = new Paper( "", {
			keyword: "ribuan",
			title: "dua-lima ribuan",
		} );
		const researcher = new IndonesianResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataID );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
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

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( false );
		expect( result.allWordsFound ).toBe( true );
		expect( result.position ).toBe( 13 );
	} );
} );

describe( "Matches keyphrase in SEO title for Arabic", () => {
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title", () => {
		const mockPaper = new Paper( "", {
			keyword: "استعمارية أمريكية",
			title: "استعمارية أمريكية: التوسع السياسي والاقتصادي أمريكي والثقافي",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title and it's preceded by a definite article (function word)", () => {
		const mockPaper = new Paper( "", {
			keyword: "استعمارية أمريكية",
			title: "الاستعمارية الأمريكية: التوسع السياسي والاقتصادي أمريكي والثقافي",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title and it's preceded by a definite article (function word)" +
		"and a non-prefixed function word", () => {
		const mockPaper = new Paper( "", {
			keyword: "استعمارية أمريكية",
			title: "ألفا الاستعمارية الأمريكية: التوسع السياسي والاقتصادي أمريكي والثقافي",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );

	it( "should find an exact match at position 0, when each word of the keyphrase is found preceded with prefix" +
		"at the beginning of the SEO title but the prefixes are not the same", () => {
		const mockPaper = new Paper( "", {
			keyword: "استعمارية أمريكية",
			title: "الاستعمارية والأمريكية: التوسع السياسي والاقتصادي أمريكي والثقافي",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should NOT find an exact match at position 0, when the words of the keyphrase are separated by a different word", () => {
		const mockPaper = new Paper( "", {
			keyword: "باندا حمراء",
			title: "الباندا اللواتي حمراء يمكن تلطيفهن",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title and it's preceded by a definite article (function word)", () => {
		const mockPaper = new Paper( "", {
			keyword: "قط ينطق",
			title: "القط ينطق: التوسع السياسي والاقتصادي أمريكي والثقافي",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title and it's preceded by a definite article (function word)", () => {
		const mockPaper = new Paper( "", {
			keyword: "قطط وسيمة",
			title: "والقطط الوسيمة: أفضل مواء ستسمعه على الإطلاق",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title: keyphrase enclosed in double quotes", () => {
		const mockPaper = new Paper( "", {
			keyword: "\"قط ينطق\"",
			title: "قط ينطق: التوسع السياسي والاقتصادي أمريكي والثقافي",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title and preceded by a non-prefixed function word: keyphrase enclosed in double quotes", () => {
		const mockPaper = new Paper( "", {
			keyword: "\"قطط وسيمة\"",
			title: "ألفا قطط وسيمة: أفضل مواء ستسمعه على الإطلاق",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title: long keyphrase", () => {
		const mockPaper = new Paper( "", {
			keyword: "قطة تطير عبر مجرة",
			title: "قطة تطير عبر المجرة: الواحة المخفية في قطر: اكتشاف جديد",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should return the earliest match if there are multiple matches", () => {
		const mockPaper = new Paper( "", {
			keyword: "قطط وسيمة",
			title: "والقطط الوسيمة: أفضل مواء ستسمعه على الإطلاق قطط وسيمة",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should NOT return an exact match if the keyphrase uses function word prefix but its occurrence in the SEO title doesn't:" +
		"This is inline with the behaviour in other languages", () => {
		const mockPaper = new Paper( "", {
			keyword: "القطط الوسيمة",
			title: "قطط وسيمة: أفضل مواء ستسمعه على الإطلاق قطط وسيمة",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.position ).toBe( 0 );
		expect( result.allWordsFound ).toBe( true );
	} );
	it( "should NOT return an exact match if the matched keyphrase has different word forms", () => {
		const mockPaper = new Paper( "", {
			keyword: "الجدول مسؤول",
			title: "الجدولان مسؤولان تقول لا للإنسان",
			locale: "ar_AR",
		} );
		const researcher = new ArabicResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.position ).toBe( 0 );
		expect( result.allWordsFound ).toBe( true );
	} );
} );

describe( "Matches keyphrase in SEO title for Hebrew", () => {
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title", () => {
		const mockPaper = new Paper( "", {
			keyword: "חתולים חמודים",
			title: "חתולים חמודים: הכנסת חתולים חמודים לבית",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataHE );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title and it's preceded by a definite article (function word)", () => {
		const mockPaper = new Paper( "", {
			keyword: "פנדות אדומות",
			title: "הפנדות האדומות: מוצא ובית גידול",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataHE );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title and it's preceded by a definite article (function word)" +
		"and a non-prefixed function word", () => {
		const mockPaper = new Paper( "", {
			keyword: "פנדות אדומות",
			title: "עשרים הפנדות האדומות: מוצא ובית גידול",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataHE );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when both the keyphrase and its occurrence are preceded" +
		" by a definite article (function word) and it's found at the beginning of the SEO title", () => {
		const mockPaper = new Paper( "", {
			keyword: "הפנדות האדומות",
			title: "הפנדות האדומות: מוצא ובית גידול",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataHE );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when each word of the keyphrase is found preceded with prefix" +
		"at the beginning of the SEO title but the prefixes are not the same", () => {
		const mockPaper = new Paper( "", {
			keyword: "פנדות אדומות",
			title: "הפנדות שאדומות: סיפור המעילים שלהם",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataAR );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should NOT find an exact match at position 0, when the words of the keyphrase are separated by a different word", () => {
		const mockPaper = new Paper( "", {
			keyword: "פנדות אדומות",
			title: "הפנדות שהן אדומות חמודות",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataHE );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.position ).toBe( 0 );
	} );
	it( "should NOT find an exact match when matched word forms of the keyphrase are different from the focus keyphrase", () => {
		const mockPaper = new Paper( "", {
			keyword: "בית החוף",
			title: " בתי החוף יקרים",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataHE );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( false );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title and it's preceded by a definite article (function word)", () => {
		const mockPaper = new Paper( "", {
			keyword: "חתול מיאו",
			title: "החתול מיאו: המיאו הכי טוב שתשמעו אי פעם",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataHE );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title: keyphrase enclosed in double quotes", () => {
		const mockPaper = new Paper( "", {
			keyword: "\"החתול מיאו\"",
			title: "החתול מיאו: המיאו הכי טוב שתשמעו אי פעם",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataHE );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
	it( "should find an exact match at position 0, when the exact match of the keyphrase is found" +
		"at the beginning of the SEO title and preceded by a function word: keyphrase enclosed in double quotes", () => {
		const mockPaper = new Paper( "", {
			keyword: "\"החתול מיאו\"",
			title: "עשרים החתול מיאו: המיאו הכי טוב שתשמעו אי פעם",
			locale: "he_IL",
		} );
		const researcher = new HebrewResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataHE );

		result = findKeyphraseInSEOTitle( mockPaper, researcher );
		expect( result.exactMatchFound ).toBe( true );
		expect( result.exactMatchKeyphrase ).toBe( true );
		expect( result.position ).toBe( 0 );
	} );
} );
