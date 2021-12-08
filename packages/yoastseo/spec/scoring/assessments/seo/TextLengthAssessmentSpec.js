import TextLengthAssessment from "../../../../src/scoring/assessments/seo/TextLengthAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import assessmentConfigJapanese from "../../../../src/languageProcessing/languages/ja/config/textLength";
import KeyphraseLengthAssessment from "../../../../src/scoring/assessments/seo/KeyphraseLengthAssessment";

const textLengthAssessment = new TextLengthAssessment();

describe( "A word count assessment", function() {
	it( "assesses a single word", function() {
		const mockPaper = new Paper( "sample" );
		const assessment = textLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 1 ) );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 1 word. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "assesses a low word count", function() {
		const mockPaper = new Paper( "These are just five words" );
		const assessment = textLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 5 ) );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 5 words. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "assesses a medium word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 150 ) );
		const assessment = textLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 150 ) );

		expect( assessment.getScore() ).toEqual( -10 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 150 words. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "assesses a slightly higher than medium word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 225 ) );
		const assessment = textLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 225 ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 225 words. This is below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "assesses an almost at the recommended amount, word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 275 ) );
		const assessment = textLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 275 ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 275 words. This is slightly below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add a bit more copy</a>." );
	} );


	it( "assesses high word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 325 ) );
		const assessment = textLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 325 ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 325 words. Good job!" );
	} );

	const cornerstoneConfig = {
		recommendedMinimum: 900,
		slightlyBelowMinimum: 400,
		belowMinimum: 300,

		scores: {
			belowMinimum: -20,
			farBelowMinimum: -20,
		},

		cornerstoneContent: true,
	};

	it( "different boundaries are applied if the content is cornerstone: very far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 25 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 25 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 25 words. This is far below the recommended minimum of 900 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 125 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 125 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 125 words. This is far below the recommended minimum of 900 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 325 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 325 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 325 words. This is below the recommended minimum of 900 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: slightly below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 425 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 425 ) );

		expect( results.getScore() ).toEqual( 6 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 425 words. This is below the recommended minimum of 900 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: above minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 925 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 925 ) );

		expect( results.getScore() ).toEqual( 9 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 925 words. Good job!" );
	} );

	const productPageConfig = {
		recommendedMinimum: 200,
		slightlyBelowMinimum: 150,
		belowMinimum: 100,
		veryFarBelowMinimum: 50,
	};

	it( "different boundaries are applied for a product page: very far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 25 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 25 ) );

		expect( result.getScore() ).toEqual( -20 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 25 words. This is far below the recommended minimum of 200 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied for a product page: far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 55 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 55 ) );

		expect( result.getScore() ).toEqual( -10 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 55 words. This is far below the recommended minimum of 200 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied for a product page: below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 101 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 101 ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 101 words. This is below the recommended minimum of 200 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied for a product page: slightly below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 155 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 155 ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 155 words. This is slightly below the recommended minimum of 200 words." +
			" <a href='https://yoa.st/34o' target='_blank'>Add a bit more copy</a>." );
	} );


	it( "different boundaries are applied for a product page: above minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 201 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 201 ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 201 words. Good job!" );
	} );

	const cornerstoneProductPageConfig = {
		recommendedMinimum: 400,
		slightlyBelowMinimum: 300,
		belowMinimum: 200,

		scores: {
			belowMinimum: -20,
			farBelowMinimum: -20,
		},

		cornerstoneContent: true,
	};

	it( "different boundaries are applied for a product pagge if the content is cornerstone: very far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 25 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 25 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 25 words. This is far below the recommended minimum of 400 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 190 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 75 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 75 words. This is far below the recommended minimum of 400 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 225 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 225 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 225 words. This is below the recommended minimum of 400 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: slightly below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 380 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 380 ) );

		expect( results.getScore() ).toEqual( 6 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 380 words. This is below the recommended minimum of 400 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: above minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 425 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 425 ) );

		expect( results.getScore() ).toEqual( 9 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 425 words. Good job!" );
	} );
} );

describe( "In Japanese, the text length assessment should give a score based on character length and use language-specific boundaries", function() {
	const character = "あ";
	const textVeryFarBelowMinimum = character.repeat( 199 );
	const textFarBelowMinimum = character.repeat( 399 );
	const textBelowMinimum = character.repeat( 499 );
	const textSlightlyBelowMinimum = character.repeat( 599 );
	const textAboveMinimum = character.repeat( 600 );

	it( "assesses a text in the veryFarBelowMinimum category", function() {
		const paper = new Paper( textVeryFarBelowMinimum );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const assessment = new TextLengthAssessment();

		const results = assessment.getResult( paper, japaneseResearcher );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 199 characters. " +
			"This is far below the recommended minimum of 600 characters. " +
			"<a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a text in the farBelowMinimum category", function() {
		const paper = new Paper( textFarBelowMinimum );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const assessment = new TextLengthAssessment();

		const results = assessment.getResult( paper, japaneseResearcher );

		expect( results.getScore() ).toEqual( -10 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 399 characters. " +
			"This is far below the recommended minimum of 600 characters. " +
			"<a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a text in the belowMinimum category", function() {
		const paper = new Paper( textBelowMinimum );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const assessment = new TextLengthAssessment();

		const results = assessment.getResult( paper, japaneseResearcher );

		expect( results.getScore() ).toEqual( 3 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 499 characters. " +
			"This is below the recommended minimum of 600 characters. " +
			"<a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a text in the slightlyBelowMinimum category", function() {
		const paper = new Paper( textSlightlyBelowMinimum );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const assessment = new TextLengthAssessment();

		const results = assessment.getResult( paper, japaneseResearcher );

		expect( results.getScore() ).toEqual( 6 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 599 characters. " +
			"This is slightly below the recommended minimum of 600 characters. " +
			"<a href='https://yoa.st/34o' target='_blank'>Add a bit more copy</a>." );
	} );

	it( "assesses a text in the aboveMinimum category", function() {
		const paper = new Paper( textAboveMinimum );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const assessment = new TextLengthAssessment();

		const results = assessment.getResult( paper, japaneseResearcher );

		expect( results.getScore() ).toEqual( 9 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 600 characters. Good job!"  );
	} );
} );

describe( "Language-specific configuration for specific types of content is used", function() {
	const paper = new Paper( "こんにちは。" );
	const japaneseResearcher = new JapaneseResearcher( paper );

	it( "checks whether language-specific cornerstone configuration is used", function() {
		const assessment = new TextLengthAssessment( { cornerstoneContent: true } );
		// Running getResult will apply language-specific configuration.
		assessment.getResult( paper, japaneseResearcher );

		expect( assessment._config.recommendedMinimum ).toEqual( assessmentConfigJapanese.defaultCornerstone.recommendedMinimum );
		expect( assessment._config.slightlyBelowMinimum ).toEqual( assessmentConfigJapanese.defaultCornerstone.slightlyBelowMinimum );
		expect( assessment._config.belowMinimum ).toEqual( assessmentConfigJapanese.defaultCornerstone.belowMinimum );
		expect( assessment._config.scores.belowMinimum ).toEqual( assessmentConfigJapanese.defaultCornerstone.scores.belowMinimum );
		expect( assessment._config.scores.farBelowMinimum ).toEqual( assessmentConfigJapanese.defaultCornerstone.scores.farBelowMinimum );
	} );

	it( "checks whether language-specific configuration for a custom content type is used (example: taxonomy page)", function() {
		const assessment = new TextLengthAssessment( { customContentType: "taxonomyAssessor" } );
		// Running getResult will apply language-specific configuration.
		assessment.getResult( paper, japaneseResearcher );

		expect( assessment._config.recommendedMinimum ).toEqual( assessmentConfigJapanese.taxonomyAssessor.recommendedMinimum );
		expect( assessment._config.slightlyBelowMinimum ).toEqual( assessmentConfigJapanese.taxonomyAssessor.slightlyBelowMinimum );
		expect( assessment._config.belowMinimum ).toEqual( assessmentConfigJapanese.taxonomyAssessor.belowMinimum );
		expect( assessment._config.veryFarBelowMinimum ).toEqual( assessmentConfigJapanese.taxonomyAssessor.veryFarBelowMinimum );
	} );

	it( "checks whether language-specific configuration for a custom content type is used when the assessor is a custom corner stone assessor" +
		" (example: product page cornerstone)", function() {
		const assessment = new TextLengthAssessment( { customContentType: "productCornerstoneSEOAssessor", cornerstoneContent: true } );
		// Running getResult will apply language-specific configuration.
		assessment.getResult( paper, japaneseResearcher );

		expect( assessment._config.recommendedMinimum ).toEqual( assessmentConfigJapanese.productCornerstoneSEOAssessor.recommendedMinimum );
		expect( assessment._config.slightlyBelowMinimum ).toEqual( assessmentConfigJapanese.productCornerstoneSEOAssessor.slightlyBelowMinimum );
		expect( assessment._config.belowMinimum ).toEqual( assessmentConfigJapanese.productCornerstoneSEOAssessor.belowMinimum );
		expect( assessment._config.scores.belowMinimum ).toEqual( assessmentConfigJapanese.productCornerstoneSEOAssessor.scores.belowMinimum );
		expect( assessment._config.scores.farBelowMinimum ).toEqual( assessmentConfigJapanese.productCornerstoneSEOAssessor.scores.farBelowMinimum );
	} );
} );
