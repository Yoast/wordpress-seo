/* eslint-disable capitalized-comments, spaced-comment */
import metaDescriptionKeyword from "../../../src/languageProcessing/researches/metaDescriptionKeyword.js";
import Paper from "../../../src/values/Paper.js";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "en" );

describe( "the metadescription keyword match research", function() {
	it( "returns the number ( 1 ) of keywords found", function() {
		const paper = new Paper( "", { keyword: "word", description: "a description with a word" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 2 ) of keywords found", function() {
		const paper = new Paper( "", { keyword: "word", description: "a description with a word and a word" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 2 );
	} );

	it( "returns the number ( 0 ) of keywords found", function() {
		const paper = new Paper( "", { keyword: "word", description: "a description with a bla" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 0 );
	} );

	it( "returns the number ( 1 ) of keywords found", function() {
		const paper = new Paper( "", { keyword: "keywörd", description: "a description with a keyword", locale: "en_US" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords found when the keyword begins with $", function() {
		const paper = new Paper( "", { keyword: "$keyword", description: "a description with a $keyword" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords found when the keyword", function() {
		const paper = new Paper( "", { keyword: "key word", description: "a description with a key word and a key" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords and synonyms found", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "a description with a key word and a phrase" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 1 ) of keywords and synonyms found", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "a description with a key phrase" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 3 ) of keywords and synonyms found", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "Keys word. Key wordly. Keys phrases." } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 3 );
	} );

	it( "returns the number ( 3 ) of keywords and synonyms found, even when the keyphrase contains function words", function() {
		const paper = new Paper( "", { keyword: "key and word", synonyms: "key or phrase", description: "Keys word. Key wordly. Keys phrases." } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 3 );
	} );

	it( "returns the number ( 1 ) of keywords and synonyms found, with no morphology data", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "Key word. Key wordly. Keys phrases." } );
		const researcher = new Researcher( paper );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns the number ( 2 ) of keywords and synonyms found, with no morphology data", function() {
		const paper = new Paper( "", { keyword: "key word", synonyms: "key phrase", description: "Key word. Key wordly. Key phrase." } );
		const researcher = new Researcher( paper );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 2 );
	} );

	it( "returns the number ( 2 ) of keywords and synonyms found", function() {
		const paper = new Paper( "", { keyword: "cats and dogs", synonyms: "hounds and felines",
			description: "This is a meta description. It’s about dogs and cats and hounds and felines and more felines. " +
				"A sdfkjhsdk hskdf sd. And hounds." } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 2 );
	} );

	it( "returns 1 when the keyphrase is enclosed in double quotes and there is a match in the text", function() {
		const paper = new Paper( "", { keyword: "\"cats and dogs\"", synonyms: "hounds and felines",
			description: "Cats and dogs are great." }  );
		const researcher = new Researcher( paper );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns 2 when the keyphrase is enclosed in double quotes and there are 2 matches in the text", function() {
		const paper = new Paper( "", { keyword: "\"cats and dogs\"", synonyms: "hounds and felines",
			description: "Cats and dogs are great, cats and dogs." }  );
		const researcher = new Researcher( paper );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 2 );
	} );
	it( "returns 1 when the synonym is enclosed in double quotes and there is 1 match in the text", function() {
		const paper = new Paper( "", { keyword: "hounds and felines", synonyms: "\"cats and dogs\"",
			description: "Cats and dogs are great." }  );
		const researcher = new Researcher( paper );
		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );
} );

describe( "a test for matching focus keyphrase in uppercase that contains period", () => {
	it( "should match keyphrase in upper case with a period in the text", function() {
		let text = "An example text. What is ASP.NET.";
		let paper = new Paper( "", { keyword: "ASP.NET", description: text } );
		let researcher = new Researcher( paper );

		expect( metaDescriptionKeyword( paper, researcher ) ).toEqual( 1 );

		text = "An example text. What is ASP.net.";
		paper = new Paper( "", { keyword: "ASP.NET", description: text } );
		researcher = new Researcher( paper );

		expect( metaDescriptionKeyword( paper, researcher ) ).toEqual( 1 );

		text = "An example text. What is asp.NET?";
		paper = new Paper( "", { keyword: "ASP.NET", description: text } );
		researcher = new Researcher( paper );

		expect( metaDescriptionKeyword( paper, researcher ) ).toEqual( 1 );

		text = "An example text. What is asp.net.";
		paper = new Paper( "", { keyword: "ASP.NET", description: text } );
		researcher = new Researcher( paper );

		expect( metaDescriptionKeyword( paper, researcher ) ).toEqual( 1 );
	} );

	it( "should still match keyphrase in upper case with a period in the text when the keyphrase is in double quote", function() {
		let text = "An example text. What is ASP.NET.";
		let paper = new Paper( "", { keyword: "\"ASP.NET\"", description: text } );
		let researcher = new Researcher( paper );

		expect( metaDescriptionKeyword( paper, researcher ) ).toEqual( 1 );

		text = "An example text. What is ASP.net.";
		paper = new Paper( "", { keyword: "\"ASP.NET\"", description: text } );
		researcher = new Researcher( paper );

		expect( metaDescriptionKeyword( paper, researcher ) ).toEqual( 1 );

		text = "An example text. What is asp.NET?";
		paper = new Paper( "", { keyword: "\"ASP.NET\"", description: text } );
		researcher = new Researcher( paper );

		expect( metaDescriptionKeyword( paper, researcher ) ).toEqual( 1 );

		text = "An example text. What is asp.net.";
		paper = new Paper( "", { keyword: "\"ASP.NET\"", description: text } );
		researcher = new Researcher( paper );

		expect( metaDescriptionKeyword( paper, researcher ) ).toEqual( 1 );
	} );
} );

/*

describe( "the meta description keyphrase match research for keyphrases that contain apostrophe", () => {
	it( "returns 1 for Turkish when the keyphrase has an apostrophe and starts with an uppercase letter and a match " +
		"with a different form is found in the meta description", function() {
		const paper = new Paper( "", { keyword: "madonna", locale: "tr_TR",
			synonyms: "",
			description: "Hatta açılış töreni için Madonna'yı davet ettiğini bile duymuştum." } );
		const researcher = new TurkishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataTR );

		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	it( "returns 1 for Turkish when the keyphrase has an apostrophe and starts with an uppercase letter and a match " +
		"with a different form is found in the meta description", function() {
		const paper = new Paper( "", { keyword: "atade", locale: "tr_TR",
			synonyms: "",
			description: "Kitaplar Atadeniz'in gitti, yenilerine ihtiyacımız olacak." } );
		const researcher = new TurkishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataTR );

		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );

	xit( "returns 1 for Turkish when the keyphrase has an apostrophe and starts with an uppercase letter and a match " +
		"with a different form is found in the meta description (this unit test is skipped for now " +
		"since the word 'universite' is overstemmed, hence no match is found)", function() {
		const paper = new Paper( "", { keyword: "universite", locale: "tr_TR",
			synonyms: "",
			description: "Universitesi'ne büyük araştırmalar yapılıyor." } );
		const researcher = new TurkishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataTR );

		const result = metaDescriptionKeyword( paper, researcher );
		expect( result ).toEqual( 1 );
	} );
} );
*/


// ============


/*

describe( "the meta description keyword match research for languages that have custom helper to match words", function() {
	// Japanese has a custom helper to match words.
	describe( "test the research with morphology data unavailable", () => {
		it( "returns 1 when only the keyword is found in the meta description", function() {
			const paper = new Paper( "", { keyword: "小さい花の刺繍", synonyms: "野生のハーブの刺繡", description: "この記事は小さい花の刺繍をどうやってすてればいいのか、" +
					"基本的な情報を紹介します。私は美しい猫を飼っています。" }  );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 1 );
		} );

		it( "returns 1 when only the synonym is found in the meta description", function() {
			const paper = new Paper( "", { keyword: "小さい花の刺繍", synonyms: "野生のハーブの刺繡", description: "私は美しい猫を飼っています。野生のハーブの刺繡。" }  );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 1 );
		} );

		it( "returns 2 when both the keyword and synonym are found once in the meta description", function() {
			const paper = new Paper( "", { keyword: "小さい花の刺繍", synonyms: "野生のハーブの刺繡", description: "この記事は小さい花の刺繍をどうやってすてればいいのか、" +
					"基本的な情報を紹介します。私は美しい猫を飼っています。 野生のハーブの刺繡。" } );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 2 );
		} );

		it( "shouldn't return NaN/infinity times of keyphrase occurrence when the keyphrase contains only function words and " +
			"there is no match in the text", function() {
			const paper = new Paper( "", { keyword: "ばっかり", description: "この記事は小さい花の刺繍をどうやってすてればいいのか、" +
					"基本的な情報を紹介します。私は美しい猫を飼っています。 野生のハーブの刺繡。" } );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 0 );
		} );

		it( "shouldn't return NaN/infinity times of the synonym occurrence when the synonym contains only function words and " +
			"there is no match in the text", function() {
			const paper = new Paper( "", { keyword: "", synonyms: "ばっかり", description: "私は美しい猫を飼っています。" } );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 0 );
		} );

		it( "shouldn't return NaN/infinity times of keyphrase occurrence when the keyphrase contains spaces and " +
			"there is no match in the text", function() {
			const paper = new Paper( "", { keyword: "かしら かい を ばっかり", description: "この記事は小さい花の刺繍をどうやってすてればいいのか、" +
					"基本的な情報を紹介します。私は美しい猫を飼っています。 野生のハーブの刺繡。" } );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 0 );
		} );

		it( "shouldn't return NaN/infinity times of keyphrase occurrence when the keyphrase contains tabs and " +
			"there is no match in the text", function() {
			const paper = new Paper( "", { keyword: "かしら	かい	を	ばっかり", description: "この記事は小さい花の刺繍をどうやってすてればいいのか、" +
					"基本的な情報を紹介します。私は美しい猫を飼っています。 野生のハーブの刺繡。" } );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 0 );
		} );

		it( "returns 1 when the keyphrase is enclosed in double quotes and there is an exact match in the meta description text", function() {
			const paper = new Paper( "", { keyword: "『小さい花の刺繍』", synonyms: "野生のハーブの刺繡", description: "小さい花の刺繍。" }  );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 1 );
		} );

		it( "returns 2 when the keyphrase is enclosed in double quotes, and when there are 2 matches in the meta description text", function() {
			const paper = new Paper( "", { keyword: "『小さい花の刺繍』",
				synonyms: "野生のハーブの刺繡",
				description: "小さい花の刺繍これによって少しでも夏休み明けの感染者数を抑えたいという事だけど、小さい花の刺繍。" } );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 2 );
		} );

		it( "returns 1 when the synonym is enclosed in double quotes and there is an exact match in the meta description text", function() {
			const paper = new Paper( "", { keyword: "野生のハーブの刺繡", synonyms: "『小さい花の刺繍』", description: "小さい花の刺繍。" }  );
			const researcher = new JapaneseResearcher( paper );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 1 );
		} );
	} );

	describe( "test the research when the morphology data is available", () => {
		it( "returns 1 when the keyword is found once in the meta description (exact match)", function() {
			const paper = new Paper( "", { keyword: "小さい花の刺繍", description: "この記事は小さい花の刺繍をどうやってすてればいいのか、" +
					"基本的な情報を紹介します。私は美しい猫を飼っています。" } );
			const researcher = new JapaneseResearcher( paper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 1 );
		} );

		it( "returns 1 when only synonym is found once in the meta description (exact match)", function() {
			const paper = new Paper( "", { keyword: "野生のハーブの刺繡", synonyms: "小さい花の刺繍", description: "この記事は小さい花の刺繍をどうやってすてればいいのか、" +
					"基本的な情報を紹介します。私は美しい猫を飼っています。" } );
			const researcher = new JapaneseResearcher( paper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 1 );
		} );

		it( "returns 2 when the keyword is found twice in the meta description (exact match)", function() {
			const paper = new Paper( "", { keyword: "小さい花の刺繍", description: "この記事は小さい花の刺繍をどうやってすてればいいのか、" +
					"基本的な情報を紹介します。この記事は小さい花の刺繍をどうやってすてればいいのか、基本的な情報を紹介します。" } );
			const researcher = new JapaneseResearcher( paper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 2 );
		} );

		it( "returns 0 when no keyword is found", function() {
			const paper = new Paper( "", { keyword: "小さい花の刺繍", description: "私は美しい猫を飼っています。" } );
			const researcher = new JapaneseResearcher( paper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 0 );
		} );

		it( "returns 1 when the keyword is found once in the meta description (non-exact match)", function() {
			const paper = new Paper( "", { keyword: "小さい花の刺繍", description: "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。" } );
			const researcher = new JapaneseResearcher( paper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 1 );
		} );

		it( "returns 1 when only synonym is found once in the meta description (non-exact match)", function() {
			const paper = new Paper( "", { keyword: "野生のハーブの刺繡", synonyms: "小さい花の刺繍", description: "小さくて可愛い花の刺繍に関する一般一般の記事です。" +
					"私は美しい猫を飼っています。" } );
			const researcher = new JapaneseResearcher( paper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 1 );
		} );

		it( "returns 2 when both keyphrase and synonym are found in the meta description (exact match)", function() {
			const paper = new Paper( "", { keyword: "小さい花の刺繍", synonyms: "野生のハーブの刺繡", description: "この記事は小さい花の刺繍をどうやってすてればいいのか、" +
					"基本的な情報を紹介します。私は美しい猫を飼っています。 野生のハーブの刺繡。" } );
			const researcher = new JapaneseResearcher( paper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 2 );
		} );

		it( "returns 0 when the keyphrase is enclosed in double quotes, but the meta description text contains " +
			"different form of the keyphrase", function() {
			const paper = new Paper( "", { keyword: "『小さい花の刺繍』",
				synonyms: "野生のハーブの刺繡",
				description: "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。" } );
			const researcher = new JapaneseResearcher( paper );
			researcher.addResearchData( "morphology", morphologyDataJA );

			const result = metaDescriptionKeyword( paper, researcher );
			expect( result ).toEqual( 0 );
		} );
	} );
} );
*/

