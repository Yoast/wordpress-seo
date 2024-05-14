import Paper from "../../../../src/values/Paper.js";
import { getTextLengthAssessment } from "../../../../src/scoring/assessors/taxonomyAssessor.js";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";
import assessmentConfigJapanese from "../../../../src/languageProcessing/languages/ja/config/textLength.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher.js";

describe( "A TextLengthAssessment for a taxonomy page in Japanese", function() {
	let assessment;
	beforeEach( () => {
		assessment = getTextLengthAssessment();
	} );
	it( "should use language-specific configuration for taxonomy pages", function() {
		const paper = new Paper( "こんにちは。" );
		const japaneseResearcher = new JapaneseResearcher( paper );
		// Running getResult will apply language-specific configuration.
		assessment.getResult( paper, japaneseResearcher );

		expect( assessment._config.recommendedMinimum ).toEqual( assessmentConfigJapanese.taxonomyAssessor.recommendedMinimum );
		expect( assessment._config.slightlyBelowMinimum ).toEqual( assessmentConfigJapanese.taxonomyAssessor.slightlyBelowMinimum );
		expect( assessment._config.veryFarBelowMinimum ).toEqual( assessmentConfigJapanese.taxonomyAssessor.veryFarBelowMinimum );
	} );
	it( "should return a good result for taxonomy pages in Japanese when the text is 60 characters or more", function() {
		const paper = new Paper( "欧米では、かつては不吉の象徴とする迷信があり、魔女狩りなどによって黒猫が殺されることがあった。たとえばベルギー・ウェス。" );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const result = assessment.getResult( paper, japaneseResearcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>:" +
			" The text contains 60 characters. Good job!" );
	} );
	it( "should return an okay result for taxonomy pages in Japanese when the text is between 20-60 characters", function() {
		const paper = new Paper( "欧米では、かつては不吉の象徴とする迷信があり、魔女狩りなどによって黒猫が殺されることがあった。" );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const result = assessment.getResult( paper, japaneseResearcher );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: " +
			"The text contains 47 characters. This is slightly below the recommended minimum of 60 characters." +
			" <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );
	it( "should return a bad result for taxonomy pages in Japanese when the text is between 1-20 characters", function() {
		const paper = new Paper( "欧米では、かつては不吉の象徴とする迷。" );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const result = assessment.getResult( paper, japaneseResearcher );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 19 characters." +
			" This is below the recommended minimum of 60 characters. <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );
	it( "should return a really bad result for taxonomy pages in Japanese when the text is 0 characters", function() {
		const paper = new Paper( "" );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const result = assessment.getResult( paper, japaneseResearcher );

		expect( result.getScore() ).toEqual( -20 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: " +
			"<a href='https://yoa.st/34k' target='_blank'>Please add some content</a>." );
	} );
} );

describe( "A TextLengthAssessment for a taxonomy page in English", function() {
	let assessment;
	beforeEach( () => {
		assessment = getTextLengthAssessment();
	} );
	it( "should use custom configuration for taxonomy pages", function() {
		const paper = new Paper( "Get all of our latest global human rights news, blogs and analysis, updated daily.\n" );
		const englishResearcher = new EnglishResearcher( paper );
		// Running getResult will apply language-specific configuration.
		assessment.getResult( paper, englishResearcher );

		expect( assessment._config.recommendedMinimum ).toEqual( 30 );
		expect( assessment._config.slightlyBelowMinimum ).toEqual( 10 );
		expect( assessment._config.veryFarBelowMinimum ).toEqual( 1 );
	} );
	it( "should return a good result for taxonomy pages in English when the text is more than 30 words", function() {
		const paper = new Paper( "You know what they say: It's always Happy Hour somewhere. " +
			"Whether you're perfecting your favorite at-home cocktail, enjoying brunch with friends, " +
			"or looking to celebrate the season ahead, our cocktail (and mocktail!) ideas are here to give you all the inspo you need. Cheers!" );
		const englishResearcher = new EnglishResearcher( paper );
		const result = assessment.getResult( paper, englishResearcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 44 words. Good job!" );
	} );
	it( "should return an okay result for taxonomy pages in English when the text is between 10-30 words", function() {
		const paper = new Paper( "Adults and kids will love these easy, healthy vegetarian recipes." +
			" The best vegetarian mains, sides and so much more, with many ready in 30 minutes or less!" );
		const englishResearcher = new EnglishResearcher( paper );
		const result = assessment.getResult( paper, englishResearcher );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: " +
			"The text contains 27 words. This is slightly below the recommended minimum of 30 words." +
			" <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );
	it( "should return a bad result for taxonomy pages in English when the text is between 1-10 words", function() {
		const paper = new Paper( "Tips and techniques from your colleagues" );
		const englishResearcher = new EnglishResearcher( paper );
		const result = assessment.getResult( paper, englishResearcher );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 6 words. " +
			"This is below the recommended minimum of 30 words. <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );
	it( "should return a bad result for taxonomy pages in English when the text consists of 1 word", function() {
		const paper = new Paper( "Tips" );
		const englishResearcher = new EnglishResearcher( paper );
		const result = assessment.getResult( paper, englishResearcher );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 1 word. " +
			"This is below the recommended minimum of 30 words. <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );
	it( "should return a really bad result for taxonomy pages in English when the text is 0 characters", function() {
		const paper = new Paper( "" );
		const englishResearcher = new EnglishResearcher( paper );
		const result = assessment.getResult( paper, englishResearcher );

		expect( result.getScore() ).toEqual( -20 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: " +
			"<a href='https://yoa.st/34k' target='_blank'>Please add some content</a>." );
	} );
} );

