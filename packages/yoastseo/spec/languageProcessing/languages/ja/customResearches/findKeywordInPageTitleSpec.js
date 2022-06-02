import JapaneseResearcher from "../../../../../src/languageProcessing/languages/ja/Researcher";
import pageTitleKeywordResearch from "../../../../../src/languageProcessing/languages/ja/customResearches/findKeyphraseInSEOTitle";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" );
let result;


describe( "a test for matching keyphrase in page title for Japanese", () => {
	describe( "a test for when the morphology data is not available", () => {
		it( "returns the result a keyphrase in Japanese that is enclosed in quotation mark " +
			"and it is in the beginning of the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "『東海道』",
				title: "東海道新幹線の駅構内および列車内に広告を掲出することを",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.exactMatchKeyphrase ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result a keyphrase in Japanese that is enclosed in quotation mark " +
			"and it is preceded by a function word in the beginning of the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "『東海道』",
				title: "さらに東海道新幹線の駅構内および列車内に広告を掲出することを",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.exactMatchKeyphrase ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result a keyphrase in Japanese that is enclosed in quotation mark " +
			"but no match is found in the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "『東海道』",
				title: "私の猫はとても狡猾です",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( false );
			expect( result.exactMatchKeyphrase ).toBe( true );
			expect( result.position ).toBe( -1 );
		} );

		it( "returns the result for one-word keyphrase in Japanese in the beginning of the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "東海道",
				title: "東海道新幹線の駅構内および列車内に広告を掲出することを",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result for one-word keyphrase in Japanese preceded by a function word in the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "東海道",
				title: "さらに東海道新幹線の駅構内および列車内に広告を掲出することを",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result for multi-word keyphrase in Japanese where one of the words is " +
			"in the beginning of the title and the other is not", function() {
			const mockPaper = new Paper( "", {
				keyword: "東海道新幹線",
				title: "東海道の駅構内および列車内に広告を掲出することを新幹線",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result for multi-word keyphrase in Japanese where only one of the words is found in the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "東海道新幹線",
				title: "東海道の駅構内および列車内に広告を掲出することを",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( false );
			expect( result.position ).toBe( -1 );
		} );

		it( "returns the result for multi-word keyphrase in Japanese when the keyphrase is not at the beginning", function() {
			const mockPaper = new Paper( "", {
				keyword: "東海道新幹線",
				title: "東京の東海道新幹線の駅や電車内に広告を掲載する",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 3 );
		} );

		it( "returns the result for multi-word keyphrase in Japanese when the title starts with a function word", function() {
			const mockPaper = new Paper( "", {
				keyword: "東海道新幹線",
				title: "さらに東海道新幹線の駅構内および列車内に広告を掲出することを",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result for a Japanese multi-word keyphrase containing a function word", function() {
			const mockPaper = new Paper( "", {
				keyword: "東海道を新幹線",
				title: "東海道新幹線の駅構内および列車内に広告を掲出することを。",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result for a Japanese keyphrase using a different form in the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "読ん一冊の本",
				title: "読まれ一冊の本なにか",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( false );
			expect( result.position ).toBe( -1 );
		} );

		it( "returns an assessment result with a keyphrase in Japanese enclosed in double quotes: " +
			"the same forms of the keyphrase are used in the title but they don't occur exactly in the same order as the keyphrase", function() {
			const mockPaper = new Paper( "", {
				keyword: "「小さく花の刺繍」",
				title: "小さくて可愛い花の刺繍に関する一般一般の記事です",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( false );
			expect( result.position ).toBe( -1 );
		} );
	} );

	describe( "a test for when the morphology data is available", () => {
		it( "returns the result a keyphrase in Japanese that is enclosed in quotation mark " +
			"and it is in the beginning of the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "『東海道』",
				title: "東海道新幹線の駅構内および列車内に広告を掲出することを。",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.exactMatchKeyphrase ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result a keyphrase in Japanese that is enclosed in quotation mark " +
			"and it is preceded by a function word in the beginning of the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "『東海道』",
				title: "さらに東海道新幹線の駅構内および列車内に広告を掲出することを。",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.exactMatchKeyphrase ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result a keyphrase in Japanese that is enclosed in quotation mark " +
			"but no match is found in the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "『東海道』",
				title: "さらに新幹線の駅構内および列車内に広告を掲出することを。",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( false );
			expect( result.exactMatchKeyphrase ).toBe( true );
			expect( result.position ).toBe( -1 );
		} );

		it( "returns the result for a Japanese multi-word keyphrase containing a function word", function() {
			const mockPaper = new Paper( "", {
				keyword: "東海道を新幹線",
				title: "東海道新幹線の駅構内および列車内に広告を掲出することを。",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result for a Japanese multi-word keyphrase with a function word in the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "東海道新幹線",
				title: "東海道を新幹線の駅構内および列車内に広告を掲出することを。",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result for a Japanese keyphrase using a different form in the title, but not all words are found", function() {
			const mockPaper = new Paper( "", {
				keyword: "読ん一冊の本",
				title: "なにか読まれ",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( false );
			expect( result.position ).toBe( -1 );
		} );

		it( "returns the result for a Japanese keyphrase using a different form in the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "読ん一冊の本",
				title: "読まれ一冊の本なにか",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );

		it( "returns the result for a Japanese keyphrase enclosed in double quotes " +
			"and a different form of the keyphrase is used in the title", function() {
			const mockPaper = new Paper( "", {
				keyword: "「読ん一冊の本」",
				title: "読ん一冊の本なにか",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );

			result = pageTitleKeywordResearch( mockPaper, researcher );
			expect( result.allWordsFound ).toBe( true );
			expect( result.position ).toBe( 0 );
		} );
	} );
} );
