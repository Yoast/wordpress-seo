import Assessment from "../../../src/scoring/assessments/assessment";
import Paper from "../../../src/values/Paper";


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

	it( "should return false if text is 49 chars and an image and no specification for contentNeededForAssessment", () => {
		const mockPaper = new Paper( "This text contains forty nine characterssssssssss" +
			// eslint-disable-next-line max-len
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

