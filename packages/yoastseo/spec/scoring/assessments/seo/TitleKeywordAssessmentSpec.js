import { enableFeatures, isFeatureEnabled } from "@yoast/feature-flag";
import TitleKeywordAssessment from "../../../../src/scoring/assessments/seo/TitleKeywordAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

enableFeatures( [ "JAPANESE_SUPPORT" ] );
const morphologyDataJA = getMorphologyData( "ja" );

describe( "an assessment to check if the keyword is in the pageTitle", function() {
	it( "returns an assessment result with keyword not found", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "a non-empty title",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatchFound: false, allWordsFound: false, position: -1, exactMatchKeyphrase: false } ),
		);

		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Not all the words from your " +
			"keyphrase \"keyword\" appear in the SEO title. <a href='https://yoa.st/33h' target='_blank'>For the best SEO results " +
			"write the exact match of your keyphrase in the SEO title, and put the keyphrase at the beginning of the title</a>."
		);
	} );

	it( "returns an assessment result with an exact match of the keyword found at start", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "keyword and the rest of this non-empty title",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatchFound: true, allWordsFound: true, position: 0, exactMatchKeyphrase: false } ),
		);

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the " +
			"focus keyphrase appears at the beginning of the SEO title. Good job!"
		);
	} );

	it( "returns an assessment result with an exact match of the keyword found not at start", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "the rest of this non-empty title and the keyword",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatchFound: true, allWordsFound: true, position: 41, exactMatchKeyphrase: false } ),
		);

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the focus " +
			"keyphrase appears in the SEO title, but not at the beginning. " +
			"<a href='https://yoa.st/33h' target='_blank'>Move it to the beginning for the best results</a>."
		);
	} );

	it( "returns an assessment result with keyword not found at all", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "a non-empty title",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatchFound: false, allWordsFound: true, position: -1, exactMatchKeyphrase: false  } ),
		);

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Does not contain the exact match. " +
			"<a href='https://yoa.st/33h' target='_blank'>Try to write the exact match of your keyphrase in the SEO title and put " +
			"it at the beginning of the title</a>."
		);
	} );

	it( "returns a bad result for an exact match keyphrase when the word order of the keyphrase is different in the title", function() {
		const paper = new Paper( "", {
			keyword: "\"cats and dogs\"",
			title: "dogs and cats",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatchFound: false, allWordsFound: false, position: 0, exactMatchKeyphrase: true } ),
		);

		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Does not contain the exact match. " +
			"<a href='https://yoa.st/33h' target='_blank'>Try to write the exact match of your keyphrase in the SEO title and put " +
			"it at the beginning of the title</a>."
		);
	} );
} );

describe( "a test to check for the assessment's applicability", () => {
	it( "returns false isApplicable for a paper without title", function() {
		const paper = new Paper( "", { keyword: "some keyword", title: "" } );
		const isApplicableResult = new TitleKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "returns false isApplicable for a paper without keyword", function() {
		const paper = new Paper( "", { keyword: "", title: "some title" } );
		const isApplicableResult = new TitleKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "returns true isApplicable for a paper with keyword and title", function() {
		const paper = new Paper( "", { keyword: "keyword", title: "some title" } );
		const isApplicableResult = new TitleKeywordAssessment().isApplicable( paper );
		expect( isApplicableResult ).toBe( true );
	} );
} );

describe( "a test to check if the keyword is in the page title in Japanese", function() {
	// Japanese has a custom research and feedback strings for this assessment.
	describe( "a test with morphology data not available", () => {
		it( "returns an assessment result with a keyphrase in Japanese that is enclosed in double quotes " +
			"and it is in the beginning of the title", function() {
			const paper = new Paper( "", {
				keyword: "『東海道』",
				title: "東海道新幹線の駅構内および列車内に広告を掲出することを",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( paper );

			const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

			expect( assessment.getScore() ).toBe( 9 );
			expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
				"The focus keyphrase appears at the beginning of the SEO title. Good job!" );
		} );
		it( "returns an assessment result with a keyphrase in Japanese that is enclosed in double quotes " +
			"and it is not in the beginning of the title", function() {
			const paper = new Paper( "", {
				keyword: "『東海道』",
				title: "新幹線の駅構内および列車内に広告を掲出することを東海道",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( paper );

			const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

			expect( assessment.getScore() ).toBe( 6 );
			expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
				"Title does not begin with the focus keyphrase. <a href='https://yoa.st/33h' target='_blank'>" +
				"Move your focus keyphrase to the beginning of the title.</a>." );
		} );
		it( "returns an assessment result with a keyphrase in Japanese that is enclosed in double quotes " +
			"and it is preceded by a function word in the beginning of the title", function() {
			const paper = new Paper( "", {
				keyword: "『東海道』",
				title: "さらに東海道新幹線の駅構内および列車内に広告を掲出することを",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( paper );

			const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

			expect( assessment.getScore() ).toBe( 9 );
			expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
				"The focus keyphrase appears at the beginning of the SEO title. Good job!" );
		} );
		it( "returns an assessment result with a keyphrase in Japanese that is enclosed in double quotes " +
			"but no match is found in the title", function() {
			const paper = new Paper( "", {
				keyword: "『東海道』",
				title: "私の猫はとても狡猾です",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( paper );

			const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

			expect( assessment.getScore() ).toBe( 2 );
			expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
				"Does not contain the exact match. <a href='https://yoa.st/33h' target='_blank'>Try to write the exact match of " +
				"your keyphrase in the SEO title and put it at the beginning of the title</a>." );
		} );
		it( "returns an assessment result with a multi-word keyphrase in Japanese where only one of the words is found in the title", function() {
			const paper = new Paper( "", {
				keyword: "東海道新幹線",
				title: "東海道の駅構内および列車内に広告を掲出することを",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( paper );

			const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

			expect( assessment.getScore() ).toBe( 2 );
			expect( assessment.getText() ).toBe(  "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
				"Not all the words from your keyphrase \"東海道新幹線\" appear in the SEO title. <a href='https://yoa.st/33h' " +
				"target='_blank'>For the best SEO results include all words of your keyphrase in the SEO title, and put " +
				"the keyphrase at the beginning of the title</a>." );
		} );
		it( "returns an assessment result with a multi-word keyphrase in Japanese and the keyphrase is not at the beginning", function() {
			const paper = new Paper( "", {
				keyword: "東海道新幹線",
				title: "東京の東海道新幹線の駅や電車内に広告を掲載する",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( paper );

			const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

			expect( assessment.getScore() ).toBe( 6 );
			expect( assessment.getText() ).toBe(  "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
				"Title does not begin with the focus keyphrase. <a href='https://yoa.st/33h' target='_blank'>" +
				"Move your focus keyphrase to the beginning of the title.</a>." );
		} );
		it( "returns an assessment result with a multi-word keyphrase in Japanese but no match in the title", function() {
			const paper = new Paper( "", {
				keyword: "東海道新幹線",
				title: "私の猫はとても狡猾です",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( paper );

			const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

			expect( assessment.getScore() ).toBe( 2 );
			expect( assessment.getText() ).toBe(  "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
				"Not all the words from your keyphrase \"東海道新幹線\" appear in the SEO title. <a href='https://yoa.st/33h' target='_blank'>" +
				"For the best SEO results include all words of your keyphrase in the SEO title, and put the keyphrase at " +
				"the beginning of the title</a>." );
		} );
		it( "returns an assessment result with a keyphrase in Japanese where a different form of the keyphrase is used in the title", function() {
			const paper = new Paper( "", {
				keyword: "読ん一冊の本",
				title: "読まれ一冊の本なにか",
				locale: "ja",
			} );
			const researcher = new JapaneseResearcher( paper );

			const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

			expect( assessment.getScore() ).toBe( 2 );
			expect( assessment.getText() ).toBe(  "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
				"Not all the words from your keyphrase \"読ん一冊の本\" appear in the SEO title. <a href='https://yoa.st/33h' target='_blank'>" +
				"For the best SEO results include all words of your keyphrase in the SEO title, and put the keyphrase at " +
				"the beginning of the title</a>." );
		} );
	} );
	if ( isFeatureEnabled( "JAPANESE_SUPPORT" ) ) {
		describe( "a test with morphology data available", () => {
			it( "returns an assessment result with a keyphrase in Japanese that is enclosed in double quotes " +
				"and it is in the beginning of the title", function() {
				const paper = new Paper( "", {
					keyword: "『東海道』",
					title: "東海道新幹線の駅構内および列車内に広告を掲出することを",
					locale: "ja",
				} );
				const researcher = new JapaneseResearcher( paper );
				researcher.addResearchData( "morphology", morphologyDataJA );

				const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

				expect( assessment.getScore() ).toBe( 9 );
				expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
					"The focus keyphrase appears at the beginning of the SEO title. Good job!" );
			} );
			it( "returns an assessment result with a keyphrase in Japanese that is enclosed in double quotes " +
				"and it is not in the beginning of the title", function() {
				const paper = new Paper( "", {
					keyword: "『東海道』",
					title: "新幹線の駅構内および列車内に広告を掲出することを東海道",
					locale: "ja",
				} );
				const researcher = new JapaneseResearcher( paper );
				researcher.addResearchData( "morphology", morphologyDataJA );

				const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

				expect( assessment.getScore() ).toBe( 6 );
				expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
					"Title does not begin with the focus keyphrase. <a href='https://yoa.st/33h' target='_blank'>" +
					"Move your focus keyphrase to the beginning of the title.</a>." );
			} );
			it( "returns an assessment result with a keyphrase in Japanese that is enclosed in double quotes " +
				"and it is preceded by a function word in the beginning of the title", function() {
				const paper = new Paper( "", {
					keyword: "『東海道』",
					title: "さらに東海道新幹線の駅構内および列車内に広告を掲出することを",
					locale: "ja",
				} );
				const researcher = new JapaneseResearcher( paper );
				researcher.addResearchData( "morphology", morphologyDataJA );

				const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

				expect( assessment.getScore() ).toBe( 9 );
				expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
					"The focus keyphrase appears at the beginning of the SEO title. Good job!" );
			} );
			it( "returns an assessment result with a keyphrase in Japanese that is enclosed in double quotes " +
				"but no match is found in the title", function() {
				const paper = new Paper( "", {
					keyword: "『東海道』",
					title: "私の猫はとても狡猾です",
					locale: "ja",
				} );
				const researcher = new JapaneseResearcher( paper );
				researcher.addResearchData( "morphology", morphologyDataJA );

				const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

				expect( assessment.getScore() ).toBe( 2 );
				expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
					"Does not contain the exact match. <a href='https://yoa.st/33h' target='_blank'>Try to write the exact match of " +
					"your keyphrase in the SEO title and put it at the beginning of the title</a>." );
			} );
			it( "returns an assessment result with a multi-word keyphrase in Japanese where only one of the words is found in the title", function() {
				const paper = new Paper( "", {
					keyword: "東海道新幹線",
					title: "東海道の駅構内および列車内に広告を掲出することを",
					locale: "ja",
				} );
				const researcher = new JapaneseResearcher( paper );
				researcher.addResearchData( "morphology", morphologyDataJA );

				const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

				expect( assessment.getScore() ).toBe( 2 );
				expect( assessment.getText() ).toBe(  "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
					"Not all the words from your keyphrase \"東海道新幹線\" appear in the SEO title. <a href='https://yoa.st/33h' " +
					"target='_blank'>For the best SEO results include all words of your keyphrase in the SEO title, and put " +
					"the keyphrase at the beginning of the title</a>." );
			} );
			it( "returns an assessment result with a multi-word keyphrase in Japanese and the keyphrase is not at the beginning", function() {
				const paper = new Paper( "", {
					keyword: "東海道新幹線",
					title: "東京の東海道新幹線の駅や電車内に広告を掲載する",
					locale: "ja",
				} );
				const researcher = new JapaneseResearcher( paper );
				researcher.addResearchData( "morphology", morphologyDataJA );

				const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

				expect( assessment.getScore() ).toBe( 6 );
				expect( assessment.getText() ).toBe(  "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
					"Title does not begin with the focus keyphrase. <a href='https://yoa.st/33h' target='_blank'>" +
					"Move your focus keyphrase to the beginning of the title.</a>." );
			} );
			it( "returns an assessment result with a multi-word keyphrase in Japanese but no match in the title", function() {
				const paper = new Paper( "", {
					keyword: "読ん一冊の本",
					title: "読まれ私の猫はとても狡猾です",
					locale: "ja",
				} );
				const researcher = new JapaneseResearcher( paper );
				researcher.addResearchData( "morphology", morphologyDataJA );

				const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

				expect( assessment.getScore() ).toBe( 2 );
				expect( assessment.getText() ).toBe(  "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
					"Not all the words from your keyphrase \"読ん一冊の本\" appear in the SEO title. <a href='https://yoa.st/33h' target='_blank'>" +
					"For the best SEO results include all words of your keyphrase in the SEO title, and put the keyphrase at " +
					"the beginning of the title</a>." );
			} );
			it( "returns an assessment result with a keyphrase in Japanese where a different form of the keyphrase is used in the title", function() {
				const paper = new Paper( "", {
					keyword: "読ん一冊の本",
					title: "読まれ一冊の本なにか",
					locale: "ja",
				} );
				const researcher = new JapaneseResearcher( paper );
				researcher.addResearchData( "morphology", morphologyDataJA );

				const assessment = new TitleKeywordAssessment().getResult( paper, researcher );

				expect( assessment.getScore() ).toBe( 9 );
				expect( assessment.getText() ).toBe(  "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: " +
					"The focus keyphrase appears at the beginning of the SEO title. Good job!" );
			} );
		} );
	}
} );
