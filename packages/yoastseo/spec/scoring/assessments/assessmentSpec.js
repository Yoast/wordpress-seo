import Assessment from "../../../src/scoring/assessments/assessment";
import Paper from "../../../src/values/Paper";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";


describe( "A test for the isApplicable and getResult methods", () => {
	it( "should return a not implemented exception", () => {
		const mockPaper = new Paper( "" );
		const mockResearcher = new DefaultResearcher( mockPaper );
		const mockAssessment = new Assessment();

		expect( mockAssessment.isApplicable( mockPaper, mockResearcher ) ).toBeTruthy();
		expect( () => mockAssessment.getResult( mockPaper, mockResearcher ) ).toThrowError();
	} );
} );
describe( "test hasEnoughContentForAssessment", () => {
	it( "should return true if text is more than 50 chars and no specification for contentNeededForAssessment", () => {
		const mockPaper = new Paper( "This is a text that contains at least fifty characters." );
		const mockAssessment = new Assessment();

		expect( mockAssessment.hasEnoughContentForAssessment( mockPaper ) ).toBe( true );
	} );

	it( "should return false if text is less than 50 chars and no specification for contentNeededForAssessment", () => {
		const mockPaper = new Paper( "This is a short test." );
		const mockAssessment = new Assessment();

		expect( mockAssessment.hasEnoughContentForAssessment( mockPaper ) ).toBe( false );
	} );

	it( "should return false if text has more than 50 chars but they are inside an element we want to exclude from the analysis", () => {
		const mockPaper = new Paper( "<blockquote>This is a quote that contains at least fifty characters.</blockquote>" );
		const mockAssessment = new Assessment();

		expect( mockAssessment.hasEnoughContentForAssessment( mockPaper ) ).toBe( false );
	} );

	it( "should return false if text has less than 50 chars after shortcodes are removed.", () => {
		const mockPaper = new Paper( "Some text" + "[shortcode] ".repeat( 50 ), { shortcodes: [ "shortcode" ] } );
		const mockAssessment = new Assessment();

		expect( mockAssessment.hasEnoughContentForAssessment( mockPaper ) ).toBe( false );
	} );

	it( "should return false if text is 49 chars and an image and no specification for contentNeededForAssessment", () => {
		const mockPaper = new Paper( "This text contains forty-nine characterssssssssss" +
			"<figure class=\"wp-block-image size-large\"><img src=\"http://basic.wordpress.test/wp-content/uploads/2022/05/70860665-c6b2-4b40-82e9-37b4bea5648e-3-1024x682.jpeg\" alt=\"\" class=\"wp-image-148\"/></figure>" );
		const mockAssessment = new Assessment();

		expect( mockAssessment.hasEnoughContentForAssessment( mockPaper ) ).toBe( false );
	} );

	it( "should return true if text is more than the specified minimum number of characters", () => {
		const mockPaper = new Paper( "This is a short test." );
		const mockAssessment = new Assessment();

		expect( mockAssessment.hasEnoughContentForAssessment( mockPaper, 20 ) ).toBe( true );
	} );

	it( "should return false if text is less than the specified number of characters", () => {
		const mockPaper = new Paper( "This is a short test." );
		const mockAssessment = new Assessment();

		expect( mockAssessment.hasEnoughContentForAssessment( mockPaper, 22 ) ).toBe( false );
	} );
} );

describe( "test formatResultText", () => {
	it( "should return a formatted string", () => {
		const mockAssessment = new Assessment();
		const resultText = "This is a test string with a %1$s and a %2$s";
		const urlTitle = "www.example.com";
		const urlCallToAction = "www.example2.com";

		expect( mockAssessment.formatResultText( resultText, urlTitle, urlCallToAction ) ).toBe( "This is a test string with a www.example.com and a www.example2.com" );
	} );
} );

