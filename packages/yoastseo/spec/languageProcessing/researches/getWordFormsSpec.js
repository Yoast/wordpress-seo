/* eslint-disable capitalized-comments, spaced-comment */
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import ItalianResearcher from "../../../src/languageProcessing/languages/it/Researcher";
import SwedishResearcher from "../../../src/languageProcessing/languages/sv/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import getWordForms from "../../../src/languageProcessing/researches/getWordForms";
import { primeLanguageSpecificData } from "../../../src/languageProcessing/helpers/morphology/buildTopicStems";
import Paper from "../../../src/values/Paper";
import getMorphologyData from "../../specHelpers/getMorphologyData";
const morphologyDataEN = getMorphologyData( "en" );

const testText = "I walked my dog. The cat walks along. The canine and the feline were walking.";

describe( "A test for getting word forms from the text, based on the stems of a keyphrase", () => {
	it( "returns forms found in the text for multiple keyphrases and synonyms with multiple words;" +
		"English stemmer", () => {
		const text = "A cat's dog and a dog's cat. The feline purrs. The <a href='http://example.com/doggies'>canine</a> is friendly. " +
			"Here's a picture of a cute cat <img src='http://plaatje' alt='The cutest cattest cat' /> " +
			"and a naughty dog <img src='http://plaatje' alt='The naughty dogly dog' />";
		const attributes = {
			keyword: "cats and dogs",
			synonyms: "purring felines, friendly canines",
		};
		const testPaper = new Paper( text, attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats", "cat's", "cat", "cattest" ], [ "dogs", "dog", "dog's", "dogly" ] ],
				synonymsForms: [ [ [ "purring", "purrs" ], [ "felines", "feline" ] ], [ [ "friendly" ], [ "canines", "canine" ] ] ],
			}
		);
	} );

	/*	it( "returns forms found in the text for multiple keyphrases and synonyms with multiple words;" +
		"German stemmer", () => {
		const text = "Eine Orange und eine Heidelbeere. Die Apfelsinen sind sauer. Die Blaubeeren sind süß.";
		const attributes = {
			keyword: "Orangen und Heidelbeeren",
			synonyms: "saure Apfelsine, süße Blaubeere",
			locale: "de_DE",
		};
		const testPaper = new Paper( text, attributes );
		const researcher = new GermanResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataDE );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "orangen", "orange" ], [ "heidelbeeren", "heidelbeere" ] ],
				synonymsForms: [
					[
						[ "saure", "sauer" ],
						[ "apfelsine", "apfelsinen" ],
					],
					[
						[ "süße", "süß" ],
						[ "blaubeere", "blaubeeren" ],
					],
				],
			}
		);
	} );*/

	it( "returns empty structure if no keyword or synonyms are supplied", () => {
		const attributes = {
			keyword: "",
			synonyms: "",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new EnglishResearcher( testPaper );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [],
				synonymsForms: [],
			}
		);
	} );

	it( "returns an empty keyphrase field if only synonyms are supplied", () => {
		const attributes = {
			keyword: "",
			synonyms: "cats and dogs",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new EnglishResearcher( testPaper );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [],
				synonymsForms: [ [ [ "cats" ], [ "dogs" ] ] ],
			}
		);
	} );

	it( "returns keyphrase forms found in the paper", () => {
		const attributes = {
			keyword: "cats and dogs",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats", "cat" ], [ "dogs", "dog" ] ],
				synonymsForms: [],
			}
		);
	} );

	it( "returns forms for a keyphrase and multiple synonyms", () => {
		const attributes = {
			keyword: "cats and dogs",
			synonyms: "felines, canines",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [  "cats", "cat" ], [ "dogs", "dog" ] ],
				synonymsForms: [ [ [ "felines", "feline" ] ], [ [ "canines", "canine" ] ] ],
			}
		);
	} );

	it( "returns the (sanitized) original form of a word if no forms were found in the paper", () => {
		const attributes = {
			keyword: "Cats and dogs",
		};

		const testPaper = new Paper( "", attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats" ], [ "dogs" ] ],
				synonymsForms: [],
			}
		);
	} );

	it( "returns multiple forms of a stem found in the text of the paper and does not break from an empty alt-tag", () => {
		const testTextWalkMultipleForms = "The cat walked quickly." +
			"More cats are walking up there." +
			"They just walk and walk." +
			"<img src='http://plaatje' alt='' /> <img src='http://plaatje2' />";
		const attributes = {
			keyword: "the cat walks",
		};
		const testPaper = new Paper( testTextWalkMultipleForms, attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cat", "cats" ], [ "walks", "walked", "walking", "walk"  ] ],
				synonymsForms: [],
			}
		);
	} );

	it( "returns multiple forms of a stem found in the text, slug, title and meta description of the paper", () => {
		const attributes = {
			keyword: "walk",
			description: "walking",
			title: "walks",
			slug: "walked",
		};

		const testPaper = new Paper( "walk's <img src='http://plaatje' alt='Different types of walkings' />", attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "walk", "walk's", "walks", "walked", "walking", "walkings" ] ],
				synonymsForms: [],
			}
		);
	} );

	it( "returns multiple forms of a stem found in the text, slug, title and meta description of the paper", () => {
		const attributes = {
			keyword: "walk's",
			description: "walking",
			title: "walks",
			slug: "walked",
		};

		const testPaper = new Paper( "walk", attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "walk's", "walk", "walks", "walked", "walking" ] ],
				synonymsForms: [],
			}
		);
	} );

	it( "returns the exact match if the keyphrase is embedded in quotation marks", () => {
		const attributes = {
			keyword: "\"cats and dogs\"",
			synonyms: "felines, canines",
		};
		const testPaper = new Paper( "A canine and a feline are walking.", attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats and dogs" ] ],
				synonymsForms: [ [ [ "felines", "feline"  ] ], [ [ "canines", "canine" ] ] ],
			}
		);
	} );

	it( "returns the exact match if a synonym is embedded in quotation marks", () => {
		const attributes = {
			keyword: "cats and dogs",
			synonyms: "\"some purring felines\", canines",
		};
		const testPaper = new Paper( "A cat and a dog are walking. The canine is friendly. A feline does not purr.", attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats", "cat" ], [ "dogs", "dog" ] ],
				synonymsForms: [ [ [ "some purring felines"  ] ], [ [ "canines", "canine" ] ] ],
			}
		);
	} );

	it( "returns exact matches for all topic phrases if all topic phrases are exact matches", () => {
		const attributes = {
			keyword: "\"cats and dogs\"",
			synonyms: "\"some purring felines\", \"these friendly canines\"",
		};
		const testPaper = new Paper( "A cat and a dog are walking.", attributes );
		const researcher = new EnglishResearcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats and dogs" ] ],
				synonymsForms: [ [ [ "some purring felines"  ] ], [ [ "these friendly canines" ] ] ],
			}
		);
	} );

	it( "returns the keyphrase and synonyms unaltered for a language for which we have a stemmer," +
		"and function word support, but no morphology data is available (e.g., Italian in Free)", () => {
		const attributes = {
			keyword: "cane e gatto",
			synonyms: "felines, canines",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new ItalianResearcher( testPaper );
		primeLanguageSpecificData.cache.clear();

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cane" ], [ "gatto" ] ],
				synonymsForms: [ [ [ "felines" ] ], [ [ "canines" ] ] ],
			}
		);
	} );

	it( "returns unaltered topic words for a language which has neither a stemmer nor morphology data," +
		"but which has function word support", () => {
		const attributes = {
			keyword: "hund och katt",
			locale: "sv_SE",
		};
		const testPaper = new Paper( "Hund och katt. Hundar och katter.", attributes );
		const researcher = new SwedishResearcher( testPaper );
		primeLanguageSpecificData.cache.clear();

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "hund" ], [ "katt" ] ],
				synonymsForms: [  ],
			}
		);
	} );

	it( "returns the keyphrase and synonyms with function words not filtered for a language without morphology" +
		"or function word support", () => {
		const attributes = {
			keyword: "katte en honde",
			locale: "af_ZA",
		};
		const testPaper = new Paper( "", attributes );
		const researcher = new DefaultResearcher( testPaper );
		primeLanguageSpecificData.cache.clear();

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "katte" ], [ "en" ], [ "honde" ] ],
				synonymsForms: [],
			}
		);
	} );
} );

/*
describe( "A test for creating basic morphology forms in supported languages", () => {
	it( "returns all possible prefixed forms for Hebrew keyphrases", () => {
		const attributes = {
			keyword: "בראשית לארץ",
			locale: "he_IL",
		};
		const testPaper = new Paper( "", attributes );
		const researcher = new HebrewResearcher( testPaper );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [
					[
						"בראשית",
						"בבראשית",
						"הבראשית",
						"ובראשית",
						"כבראשית",
						"לבראשית",
						"מבראשית",
						"שבראשית",
						"ראשית",
						"הראשית",
						"וראשית",
						"כראשית",
						"לראשית",
						"מראשית",
						"שראשית",
					],
					[
						"לארץ",
						"בלארץ",
						"הלארץ",
						"ולארץ",
						"כלארץ",
						"ללארץ",
						"מלארץ",
						"שלארץ",
						"ארץ",
						"בארץ",
						"הארץ",
						"וארץ",
						"כארץ",
						"מארץ",
						"שארץ",
					],
				],
				synonymsForms: [],
			}
		);
	} );
} );
*/

/*
describe( "A test for creating basic morphology forms in supported languages", () => {
	it( "returns all possible prefixed forms for Arabic keyphrases", () => {
		const attributes = {
			keyword: "لتجاهل الرسالة",
			locale: "ar",
		};
		const testPaper = new Paper( "", attributes );
		const researcher = new ArabicResearcher( testPaper );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [
					[
						"لتجاهل",
						"للتجاهل",
						"بلتجاهل",
						"كلتجاهل",
						"ولتجاهل",
						"فلتجاهل",
						"سلتجاهل",
						"ألتجاهل",
						"اللتجاهل",
						"وبلتجاهل",
						"وللتجاهل",
						"لللتجاهل",
						"فسلتجاهل",
						"فبلتجاهل",
						"فللتجاهل",
						"وسلتجاهل",
						"واللتجاهل",
						"باللتجاهل",
						"فاللتجاهل",
						"كاللتجاهل",
						"ولللتجاهل",
						"وباللتجاهل",
						"تجاهل",
						"بتجاهل",
						"كتجاهل",
						"وتجاهل",
						"فتجاهل",
						"ستجاهل",
						"أتجاهل",
						"التجاهل",
						"وبتجاهل",
						"فستجاهل",
						"فبتجاهل",
						"وستجاهل",
						"والتجاهل",
						"بالتجاهل",
						"فالتجاهل",
						"كالتجاهل",
						"وبالتجاهل",
					],
					[
						"الرسالة",
						"لالرسالة",
						"بالرسالة",
						"كالرسالة",
						"والرسالة",
						"فالرسالة",
						"سالرسالة",
						"أالرسالة",
						"الالرسالة",
						"وبالرسالة",
						"ولالرسالة",
						"للالرسالة",
						"فسالرسالة",
						"فبالرسالة",
						"فلالرسالة",
						"وسالرسالة",
						"والالرسالة",
						"بالالرسالة",
						"فالالرسالة",
						"كالالرسالة",
						"وللالرسالة",
						"وبالالرسالة",
						"رسالة",
						"لرسالة",
						"برسالة",
						"كرسالة",
						"ورسالة",
						"فرسالة",
						"سرسالة",
						"أرسالة",
						"وبرسالة",
						"ولرسالة",
						"للرسالة",
						"فسرسالة",
						"فبرسالة",
						"فلرسالة",
						"وسرسالة",
						"وللرسالة",
					],
				],
				synonymsForms: [],
			}
		);
	} );
} );
*/
/*

describe( "A test for creating basic morphology forms in supported languages", () => {
	it( "returns all possible prefixed forms for Farsi keyphrases", () => {
		const attributes = {
			keyword: "دانشجوی زرنگی",
			locale: "fa",
		};
		const testPaper = new Paper( "", attributes );
		const researcher = new FarsiResearcher( testPaper );

		expect( getWordForms( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [
					[
						"دانشجوی",
						"ندانشجوی",
						"دانشجوی‌ای",
						"دانشجویمان",
						"دانشجویشان",
						"دانشجویتان",
						"دانشجویش",
						"دانشجویت",
						"دانشجویم",
						"دانشجویی",
						"دانشجو",
						"ندانشجو",
					],
					[
						"زرنگی",
						"نزرنگی",
						"زرنگی‌ای",
						"زرنگیمان",
						"زرنگیشان",
						"زرنگیتان",
						"زرنگیش",
						"زرنگیت",
						"زرنگیم",
						"زرنگیی",
						"زرنگ",
						"نزرنگ",
						"زرنگمان",
						"زرنگشان",
						"زرنگتان",
						"زرنگش",
						"زرنگت",
						"زرنگم",
					],
				],
				synonymsForms: [],
			}
		);
	} );
} );
*/
