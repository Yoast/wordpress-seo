/* eslint-disable capitalized-comments, spaced-comment */
import { merge } from "lodash-es";

import KeyphraseLengthAssessment from "../../../../src/scoring/assessments/seo/KeyphraseLengthAssessment";
import Paper from "../../../../src/values/Paper.js";

import CatalanResearcher from "../../../../src/languageProcessing/languages/ca/Researcher";
import GermanResearcher from "../../../../src/languageProcessing/languages/de/Researcher";
import deProductConfig from "../../../../src/languageProcessing/languages/de/config/keyphraseLength";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";

import { primeLanguageSpecificData } from "../../../../src/languageProcessing/helpers/morphology/buildTopicStems";

describe( "the keyphrase length assessment for product pages", function() {
	const productConfig = {
		parameters: {
			recommendedMinimum: 4,
			recommendedMaximum: 6,
			acceptableMaximum: 8,
			acceptableMinimum: 1,
		},
	};

	it( "should assess a product page without a keyword as extremely bad", function() {
		const paper = new Paper( "", { keyword: "" } );
		const result = new KeyphraseLengthAssessment( productConfig ).getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"No focus keyphrase was set for this page. " +
			"<a href='https://yoa.st/33j' target='_blank'>Set a keyphrase in order to calculate your SEO score</a>." );
	} );

	it( "should show a different feedback text for product pages when no keyphrase is set for a related keyphrase", function() {
		const paper = new Paper( "", { keyword: "" } );
		const rkProductConfig = merge( productConfig, { isRelatedKeyphrase: true } );
		const result = new KeyphraseLengthAssessment( rkProductConfig, true ).getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"<a href='https://yoa.st/33j' target='_blank'>Set a keyphrase in order to calculate your SEO score</a>." );
	} );

	it( "should assess a product page with one-word keyphrase as bad ", function() {
		const paper = new Paper( "", { keyword: "a test" } );
		const result = new KeyphraseLengthAssessment( productConfig, true ).getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 1 content word. That's way less than the recommended minimum of 4 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );

	it( "should assess a product page with a keyphrase that's slightly too short as okay ", function() {
		const paper = new Paper( "", { keyword: "a test ".repeat( 3 ) } );
		const result = new KeyphraseLengthAssessment( productConfig, true ).getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 3 content words. That's less than the recommended minimum of 4 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );

	it( "should assess a product page with a keyphrase that's the correct length", function() {
		const paper = new Paper( "", { keyword: "a test ".repeat( 4 ) } );
		const result = new KeyphraseLengthAssessment( productConfig, true ).getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );

	it( "should assess a product page with a keyphrase that's slightly too long as okay", function() {
		const paper = new Paper( "", { keyword: "a test ".repeat( 7 ) } );
		const result = new KeyphraseLengthAssessment( productConfig, true ).getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 7 content words. That's more than the recommended maximum of 6 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
	it( "should assess a product page with a keyphrase that's too long as bad", function() {
		const paper = new Paper( "", { keyword: "a test ".repeat( 9 ) } );
		const result = new KeyphraseLengthAssessment( productConfig, true ).getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 9 content words. That's way more than the recommended maximum of 6 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
} );

describe( "the keyphrase length assessment for languages with custom configuration", function() {
	it( "should clear the memoized data", function() {
		primeLanguageSpecificData.cache.clear();
		const mockPaper = new Paper( "", { keyword: "ein Test" } );
		const mockResearcher = new GermanResearcher( mockPaper );

		expect( mockResearcher.getConfig( "functionWords" )[ 0 ] ).toEqual( "das" );
	} );

	it( "should assess a German product page with one-word keyphrase as bad ", function() {
		const paper = new Paper( "", { keyword: "ein Test" } );
		const result = new KeyphraseLengthAssessment( deProductConfig, true ).getResult( paper, new GermanResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 1 content word. That's way less than the recommended minimum of 3 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );

	it( "should assess a German product page with a slightly too short keyphrase as okay", function() {
		const paper = new Paper( "", { keyword: "ein Test ".repeat( 2 ) } );
		const result = new KeyphraseLengthAssessment( deProductConfig, true ).getResult( paper, new GermanResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 2 content words. That's less than the recommended minimum of 3 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );

	it( "should assess a German product page with a keyphrase that's the correct length", function() {
		const paper = new Paper( "", { keyword: "ein Test ".repeat( 3 ) } );
		const result = new KeyphraseLengthAssessment( deProductConfig, true ).getResult( paper, new GermanResearcher( paper ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );

	it( "should assess a German product page with a keyphrase that's slightly too long as okay", function() {
		const paper = new Paper( "", { keyword: "ein Test ".repeat( 7 ) } );
		const result = new KeyphraseLengthAssessment( deProductConfig, true ).getResult( paper, new GermanResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 7 content words. That's more than the recommended maximum of 6 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );

	it( "should assess a German product page with a keyphrase that's too long as bad", function() {
		const paper = new Paper( "", { keyword: "ein Test ".repeat( 9 ) } );
		const result = new KeyphraseLengthAssessment( deProductConfig, true ).getResult( paper, new GermanResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 9 content words. That's way more than the recommended maximum of 6 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
} );

describe( "the keyphrase length assessment for languages without function words", function() {
	it( "should clear the memoized data", function() {
		primeLanguageSpecificData.cache.clear();
		const mockPaper = new Paper( "", { keyword: "test" } );
		const mockResearcher = new CatalanResearcher( mockPaper );

		expect( mockResearcher.getConfig( "functionWords" ) ).toEqual( [] );
	} );

	it( "should assess a paper with an 6-word keyphrase as good for a language that doesn't support function words", function() {
		const paper = new Paper( "", { keyword: "test ".repeat( 6 ) } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new CatalanResearcher( paper ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );

	it( "should assess a paper with an 9-word keyphrase as okay for a language that doesn't support function words", function() {
		const paper = new Paper( "", { keyword: "test ".repeat( 9 ) } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new CatalanResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 9 words. That's more than the recommended maximum of 6 words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
} );

describe( "the keyphrase length assessment for regular posts and pages", function() {
	it( "should clear the memoized data", function() {
		primeLanguageSpecificData.cache.clear();
		const mockPaper = new Paper( "", { keyword: "a test" } );
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( mockResearcher.getConfig( "functionWords" )[ 0 ] ).toEqual( "the" );
	} );

	it( "should assess a paper without a keyword as extremely bad", function() {
		const paper = new Paper( "", { keyword: "" } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"No focus keyphrase was set for this page. " +
			"<a href='https://yoa.st/33j' target='_blank'>Set a keyphrase in order to calculate your SEO score</a>." );
	} );

	it( "should show a different feedback text when no keyphrase is set for a related keyphrase", function() {
		const paper = new Paper( "", { keyword: "" } );
		const result = new KeyphraseLengthAssessment( { isRelatedKeyphrase: true } ).getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"<a href='https://yoa.st/33j' target='_blank'>Set a keyphrase in order to calculate your SEO score</a>." );
	} );

	it( "should assess a paper with a keyphrase that's too long as bad", function() {
		const paper = new Paper( "", { keyword: "a test ".repeat( 11 ) } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 11 content words. That's way more than the recommended maximum of 4 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );

	it( "should assess a paper with a keyphrase that's the correct length", function() {
		const paper = new Paper( "", { keyword: "a test" } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );

	it( "should assess a paper with a keyphrase that's a little longer than the correct length", function() {
		const paper = new Paper( "", { keyword: "lost in the awkward space time continuum" } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new EnglishResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 5 content words. That's more than the recommended maximum of 4 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );

	it( "should assess a paper with a keyphrase in quotation marks and return string with 'words' instead of 'content words'", function() {
		const paper = new Paper( "", { keyword: '"lost in the awkward space time continuum"' } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new EnglishResearcher( paper ) );

		// This behaviour is incorrect: we expect the keyphrase to be considered too long, just like the above spec.
		// However, currently, all keyphrases enclosed in double quotes are counted as having length 1.
		expect( result.getScore() ).toEqual( 9 );
	} );
} );

describe( "the keyphrase length assessment for Japanese", function() {
	it( "should clear the memoized data", function() {
		primeLanguageSpecificData.cache.clear();
		const mockPaper = new Paper( "", { keyword: "猫" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );

		expect( mockResearcher.getConfig( "functionWords" )[ 0 ] ).toEqual( "が" );
	} );

	it( "should assess a paper with a good length keyphrase in Japanese", function() {
		const paper = new Paper( "", { keyword: "猫" } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );

	it( "should assess a paper with a slightly too long keyphrase in Japanese", function() {
		const paper = new Paper( "", { keyword: "他の記事執筆者へ執筆の参考例を示すた" } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 18 characters. That's more than the recommended maximum of 12 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );

	it( "should assess a paper with a too long keyphrase in Japanese", function() {
		const paper = new Paper( "", { keyword: "他の記事執筆者へ執筆の参考例を示すために" } );
		const result = new KeyphraseLengthAssessment().getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 20 characters. That's way more than the recommended maximum of 12 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );

	it( "should assess a paper with a good length keyphrase for a product page in Japanese", function() {
		const paper = new Paper( "", { keyword: "犬と猫とハムスター" } );
		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );

	it( "should assess a paper with a slightly too short keyphrase for a product page in Japanese", function() {
		const paper = new Paper( "", { keyword: "モルモット" } );
		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 5 characters. That's less than the recommended minimum of 8 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );

	it( "should assess a paper with a too short keyphrase for a product page in Japanese", function() {
		const paper = new Paper( "", { keyword: "猫" } );
		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 1 character. That's way less than the recommended minimum of 8 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );

	it( "should assess a paper with a slightly too long keyphrase for a product page in Japanese", function() {
		const paper = new Paper( "", { keyword: "他の記事執筆者へ執筆の参考例を示すた" } );
		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 18 characters. That's more than the recommended maximum of 12 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );

	it( "should assess a paper with a too long keyphrase in Japanese", function() {
		const paper = new Paper( "", { keyword: "他の記事執筆者へ執筆の参考例を示すために" } );
		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 20 characters. That's way more than the recommended maximum of 12 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
} );
