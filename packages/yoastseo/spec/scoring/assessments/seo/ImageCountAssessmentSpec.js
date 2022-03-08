import ImageCountAssessment from "../../../../src/scoring/assessments/seo/ImageCountAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";

const imageCountAssessment = new ImageCountAssessment();

describe( "An image count assessment, including videos in product pages", function() {
	it( "assesses no images", function() {
		const mockPaper = new Paper( "sample" );

		const assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: " +
			"No images appear on this page. <a href='https://yoa.st/4f5' target='_blank'>Add some</a>!" );
	} );

	it( "assesses a text with one image", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		const assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Good job!" );
	} );

	it( "assesses a text with one image with an additional configuration for orange bullet", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		const config = {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
		};
		const assessment = new ImageCountAssessment( config ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Only 1 image " +
			"appears on this page. We recommend at least 4. <a href='https://yoa.st/4f5' target='_blank'>Add more relevant images</a>!" );
	} );

	it( "assesses a text with two images with an additional configuration for orange bullet", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " +
			"But you need more than five words to describe the beauty of a cat <img src='image.jpg' />." );

		const config = {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
		};
		const assessment = new ImageCountAssessment( config ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 2,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Only 2 images " +
			"appear on this page. We recommend at least 4. <a href='https://yoa.st/4f5' target='_blank'>Add more relevant images</a>!" );
	} );

	it( "assesses a text with 5 images with an additional configuration for orange bullet", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " +
			"But you need more than five words to describe the beauty of a cat <img src='image.jpg' />." +
			"These are just five words <img src='image.jpg' />. " +
			"But you need more than five words to describe the beauty of a cat <img src='image.jpg' />." +
			"These are just five words <img src='image.jpg' />. " );

		const config = {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
		};
		const assessment = new ImageCountAssessment( config ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Good job!" );
	} );

	it( "assesses a text with one video with an additional configuration for orange bullet (countVideos is true)", function() {
		const mockPaper = new Paper( "These are just five words <video width=\"320\" height=\"240\" controls>\n" +
			"  <source src=\"movie.mp4\" type=\"video/mp4\">\n" +
			"  <source src=\"movie.ogg\" type=\"video/ogg\">\n" +
			"Your browser does not support the video tag.\n" +
			"</video> " );

		const productPagesConfig = {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
		};
		const assessment = new ImageCountAssessment( productPagesConfig, true ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
			videoCount: 1,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images and videos</a>: " +
			"Only 1 image or video appears on this page. We recommend at least 4. <a href='https://yoa.st/4f5' target='_blank'>" +
			"Add more relevant images or videos</a>!" );
	} );

	it( "assesses a text with one image and one video with an additional configuration for orange bullet (countVideos is true)", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " +
			"But you need more than five words to describe the beauty of a cat <video width=\"320\" height=\"240\" controls>\n" +
			"  <source src=\"movie.mp4\" type=\"video/mp4\">\n" +
			"  <source src=\"movie.ogg\" type=\"video/ogg\">\n" +
			"Your browser does not support the video tag.\n" +
			"</video>" );

		const productPagesConfig = {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
		};
		const assessment = new ImageCountAssessment( productPagesConfig, true ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			videoCount: 1,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images and videos</a>: " +
			"Only 2 images or videos appear on this page. We recommend at least 4. <a href='https://yoa.st/4f5' target='_blank'>" +
			"Add more relevant images or videos</a>!" );
	} );

	it( "assesses a text with 5 images and 1 video with an additional configuration for orange bullet (countVideos is true)", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " +
			"But you need more than five words to describe the beauty of a cat <img src='image.jpg' />." +
			"These are just five words <img src='image.jpg' />. " +
			"But you need more than five words to describe the beauty of a cat <img src='image.jpg' />." +
			"These are just five words <img src='image.jpg' />." +
			"<video width=\"320\" height=\"240\" controls>\n" +
			"  <source src=\"movie.mp4\" type=\"video/mp4\">\n" +
			"  <source src=\"movie.ogg\" type=\"video/ogg\">\n" +
			"Your browser does not support the video tag.\n" +
			"</video> " );

		const productPagesConfig = {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
		};
		const assessment = new ImageCountAssessment( productPagesConfig, true ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
			videoCount: 1,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images and videos</a>: Good job!" );
	} );
	it( "assesses text without images or videos (countVideos is on)", function() {
		const mockPaper = new Paper( "sample" );

		const assessment = new ImageCountAssessment( {}, true ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
			videoCount: 0,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images and videos</a>: " +
			"No images or videos appear on this page. <a href='https://yoa.st/4f5' target='_blank'>Add some</a>!" );
	} );
} );

describe( "tests for the assessment applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paper = new Paper( "" );
		expect( imageCountAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns true when the paper is not empty.", function() {
		const paper = new Paper( "sample keyword", {
			url: "sample-with-keyword",
			keyword: "kéyword",
		} );
		expect( imageCountAssessment.isApplicable( paper ) ).toBe( true );
	} );
} );
