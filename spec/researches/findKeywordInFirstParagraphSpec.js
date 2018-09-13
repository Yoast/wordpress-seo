import Researcher from "../../src/researcher";
import morphologyData from "../../src/morphology/morphologyData.json";
import firstParagraph from "../../src/researches/findKeywordInFirstParagraph.js";
import Paper from "../../src/values/Paper.js";

const keyphraseEN = "walking in nature benefits";
const sentenceWithAllKeywordsEN = "I like to take walks in the nature, because my body and brain benefit from it! ";
const sentenceWithSomeKeywordsEN = "I like to take walks in the nature. ";
const sentenceWithTheOtherKeywordsEN = "My body and brain benefit from it! ";
const sentenceWithoutKeywordsEN = "I also enjoy cycling. ";
const sentenceWithExactMatchOfAllKeywordsEN = "I like walking in the nature, because my brain benefits from it! ";
const sentenceWithExactMatchOfSomeKeywordsEN = "I like walking in the nature. ";
const sentenceWithExactMatchOfTheOtherKeywordsEN = "My brain benefits from it! ";

const paragraphWithSentenceMatchEN = "<p>" + sentenceWithAllKeywordsEN + sentenceWithSomeKeywordsEN + sentenceWithoutKeywordsEN + "/<p>";
const paragraphWithParagraphMatchEN = "<p>" + sentenceWithSomeKeywordsEN + sentenceWithTheOtherKeywordsEN +
	sentenceWithSomeKeywordsEN + sentenceWithoutKeywordsEN + "/<p>";
const paragraphWithExactSentenceMatchEN = "<p>" + sentenceWithExactMatchOfAllKeywordsEN + sentenceWithSomeKeywordsEN + sentenceWithoutKeywordsEN + "/<p>";
const paragraphWithExactParagraphMatchEN = "<p>" + sentenceWithExactMatchOfSomeKeywordsEN + sentenceWithExactMatchOfTheOtherKeywordsEN +
	sentenceWithSomeKeywordsEN + sentenceWithoutKeywordsEN + "/<p>";
const paragraphWithoutMatchEN = "<p>" + sentenceWithoutKeywordsEN + sentenceWithoutKeywordsEN + sentenceWithoutKeywordsEN + "/<p>";

describe( "checks for the content words from the keyphrase in the first paragraph (English)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper(
			paragraphWithSentenceMatchEN, {
				keyword: keyphraseEN,
				locale: "en_EN",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithParagraphMatchEN, {
				keyword: keyphraseEN,
				locale: "en_EN",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithoutMatchEN, {
				keyword: keyphraseEN,
				locale: "en_EN",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

describe( "checks for the content words from the keyphrase in the first paragraph (English, but no morphology data provided)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper(
			paragraphWithExactSentenceMatchEN, {
				keyword: keyphraseEN,
				locale: "en_EN",
			}
		);
		const researcher = new Researcher( paper );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithExactParagraphMatchEN, {
				keyword: keyphraseEN,
				locale: "en_EN",
			}
		);
		const researcher = new Researcher( paper );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithoutMatchEN, {
				keyword: keyphraseEN,
				locale: "en_EN",
			}
		);
		const researcher = new Researcher( paper );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

describe( "checks for the content words from a synonym phrase in the first paragraph (English)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper(
			paragraphWithSentenceMatchEN, {
				keyword: "something unrelated",
				synonyms: keyphraseEN,
				locale: "en_EN",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithParagraphMatchEN, {
				keyword: "something unrelated",
				synonyms: keyphraseEN,
				locale: "en_EN",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithoutMatchEN, {
				keyword: "something unrelated",
				synonyms: keyphraseEN,
				locale: "en_EN",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

const keyphraseFR = "se promener dans la nature avantages";
const sentenceWithAllKeywordsFR = "J'aime a me promener dans la nature pour toutes les avantages pour mon corps et mon cerveau! ";
const sentenceWithSomeKeywordsFR = "J'aime a me promener dans la nature. ";
const sentenceWithTheOtherKeywordsFR = "Il'y a pleusieurs d'avantages pour mon corps et mon cerveau! ";
const sentenceWithoutKeywordsFR = "J'aime a cycler aussi. ";

const paragraphWithSentenceMatchFR = "<p>" + sentenceWithAllKeywordsFR + sentenceWithSomeKeywordsFR + sentenceWithoutKeywordsFR + "/<p>";
const paragraphWithParagraphMatchFR = "<p>" + sentenceWithSomeKeywordsFR + sentenceWithTheOtherKeywordsFR +
	sentenceWithSomeKeywordsFR + sentenceWithoutKeywordsFR + "/<p>";
const paragraphWithoutMatchFR = "<p>" + sentenceWithoutKeywordsFR + sentenceWithoutKeywordsFR + sentenceWithoutKeywordsFR + "/<p>";

describe( "checks for the content words from the keyphrase in the first paragraph (French - no morphology)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper(
			paragraphWithSentenceMatchFR, {
				keyword: keyphraseFR,
				locale: "fr_FR",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithParagraphMatchFR, {
				keyword: keyphraseFR,
				locale: "fr_FR",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithoutMatchFR, {
				keyword: keyphraseFR,
				locale: "fr_FR",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

describe( "checks for the content words from a synonym phrase in the first paragraph (French - no morphology)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper(
			paragraphWithSentenceMatchFR, {
				keyword: "quelque chose de irrelevant",
				synonyms: keyphraseFR,
				locale: "fr_FR",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithParagraphMatchFR, {
				keyword: "quelque chose de irrelevant",
				synonyms: keyphraseFR,
				locale: "fr_FR",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithoutMatchFR, {
				keyword: "quelque chose de irrelevant",
				synonyms: keyphraseFR,
				locale: "fr_FR",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

const keyphraseSW = "promenader i naturen gynnar";
const sentenceWithAllKeywordsSW = "Jag gillar att ta promenader i naturen, eftersom det gynnar min hjärna och min kropp. ";
const sentenceWithSomeKeywordsSW = "Jag gillar att ta promenader i naturen. ";
const sentenceWithTheOtherKeywordsSW = "Eftersom det gynnar min hjärna och min kropp. ";
const sentenceWithoutKeywordsSW = "Jag gillar också att cykla. ";

const paragraphWithSentenceMatchSW = "<p>" + sentenceWithAllKeywordsSW + sentenceWithSomeKeywordsSW + sentenceWithoutKeywordsSW + "/<p>";
const paragraphWithParagraphMatchSW = "<p>" + sentenceWithSomeKeywordsSW + sentenceWithTheOtherKeywordsSW +
	sentenceWithSomeKeywordsSW + sentenceWithoutKeywordsSW + "/<p>";
const paragraphWithoutMatchSW = "<p>" + sentenceWithoutKeywordsSW + sentenceWithoutKeywordsSW + sentenceWithoutKeywordsSW + "/<p>";

describe( "checks for all words from the keyphrase or synonyms in the first paragraph (Swedish - no morphology or function words)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper(
			paragraphWithSentenceMatchSW, {
				keyword: keyphraseSW,
				locale: "sw_SE",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithParagraphMatchSW, {
				keyword: keyphraseSW,
				locale: "sw_SE",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithoutMatchSW, {
				keyword: keyphraseSW,
				locale: "sw_SE",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

describe( "checks for the content words from a synonym phrase in the first paragraph (Swedish - no morphology or function words)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper(
			paragraphWithSentenceMatchSW, {
				keyword: "något orelaterat",
				synonyms: keyphraseSW,
				locale: "sw_SE",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithParagraphMatchSW, {
				keyword: "något orelaterat",
				synonyms: keyphraseSW,
				locale: "sw_SE",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper(
			paragraphWithoutMatchSW, {
				keyword: "något orelaterat",
				synonyms: keyphraseSW,
				locale: "sw_SE",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

describe( "tests for edge cases", function() {
	it( "returns not found if no keyphrase or synonyms were specified", function() {
		const paper = new Paper(
			"something", {
				keyword: "",
				synonyms: "",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns not found if there is no text", function() {
		const paper = new Paper(
			"", {
				keyword: "keyword",
				synonyms: "synonyms",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns not found if the paragraph has no text", function() {
		const paper = new Paper(
			"<p></p>", {
				keyword: "keyword",
				synonyms: "synonyms",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns not found if the paragraph has no text (with double-new-line)", function() {
		const paper = new Paper(
			" \n\n ", {
				keyword: "keyword",
				synonyms: "synonyms",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns correct result if the first paragraph has no text, but the second one does and contains the keyphrase", function() {
		const paper = new Paper(
			"<p></p><p>something keyword something else</p>", {
				keyword: "keyword",
				synonyms: "synonyms",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns correct result if the first paragraph has no text, but the second one does and contains the keyphrase (with double-new-line)", function() {
		const paper = new Paper(
			"\n\nsomething keyword something else", {
				keyword: "keyword",
				synonyms: "synonyms",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "skips the first paragraph if there is nothing but an image there", function() {
		const paper = new Paper(
			"<p><img class=\"alignnone size-medium wp-image-95\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" /></p>" +
			"<p></p>" +
			"<p><img class=\"alignnone size-medium wp-image-95\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" /></p></p>" +
			"<p></p>" +
			"<p>A sentence with a keyword</p>", {
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "skips paragraphs until there is text", function() {
		const paper = new Paper(
			"<p><img class=\"alignnone size-medium wp-image-95\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" /></p>" +
			"<p>A sentence with a keyword</p>", {
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns correct result if the first paragraph has text, but the keyphrase is only in the second paragraph", function() {
		const paper = new Paper(
			"<p>something</p><p>something keyword something else</p>", {
				keyword: "keyword",
				synonyms: "synonyms",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns correct result if the first paragraph has text, but the keyphrase is only in the second paragraph (with double-new-line)", function() {
		const paper = new Paper(
			"Something meaningful.\n\nSomething keyword something else", {
				keyword: "keyword",
				synonyms: "synonyms",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns correct result for Turkish with dotted I", function() {
		const paper = new Paper(
			"<p>Bu yıldız, Vikipedi'deki seçkin içeriği sembolize eder İstanbul.</p>", {
				keyword: "İstanbul",
				locale: "tr_TR",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns correct result for Turkish with dotless I", function() {
		const paper = new Paper(
			"<p>Bu yıldız, Vikipedi'deki seçkin içeriği sembolize eder Istanbul.</p>", {
				keyword: "istanbul",
				locale: "tr_TR",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns correct result for German", function() {
		const paper = new Paper(
			"<p>äbc und Äbc</p>", {
				keyword: "äbc",
				locale: "de_DE",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );
		expect( firstParagraph( paper, researcher ) ).toEqual( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );
} );
