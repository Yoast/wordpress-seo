import ImageCountAssessment from "../../../../src/scoring/assessments/seo/ImageCountAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";

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
	it( "returns true even when the paper is empty.", function() {
		const paper = new Paper( "" );
		expect( imageCountAssessment.isApplicable( paper ) ).toBe( true );
	} );
} );

describe( "tests for the provided-images scope.", function() {
	it( "still assesses an empty text when the counted images come from the paper's provided images.", function() {
		// When the paper provides its own images the researches count paper-level images, so an empty text must not zero the result.
		const assessment = imageCountAssessment.getResult( new Paper( "" ), Factory.buildMockResearcher( {
			imageCount: 4,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Good job!" );
	} );

	it( "ignores text videos when the paper provides its own images, so they cannot mask missing provided images (countVideos is true)", function() {
		// The video count comes from the text, a different surface than the provided images — summing them would score green without any provided image.
		const mockPaper = new Paper( "These are just five words <video src=\"movie.mp4\"></video>", { providedImages: [] } );

		const assessment = new ImageCountAssessment( {}, true ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
			videoCount: 1,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: " +
			"No images appear on this page. <a href='https://yoa.st/4f5' target='_blank'>Add some</a>!" );
	} );

	it( "scores on the provided images alone, with the images-only copy, when the paper provides its own images (countVideos is true)", function() {
		const mockPaper = new Paper( "These are just five words <video src=\"movie.mp4\"></video>", {
			providedImages: [
				{ src: "image1.jpg", alt: "" },
				{ src: "image2.jpg", alt: "" },
				{ src: "image3.jpg", alt: "" },
				{ src: "image4.jpg", alt: "" },
			],
		} );

		const assessment = new ImageCountAssessment( {}, true ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			videoCount: 1,
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Good job!" );
	} );
} );

describe( "tests for retrieving the feedback strings.", function() {
	it( "returns the default feedback strings when no custom callback is provided.", function() {
		const assessment = new ImageCountAssessment( { scores: { okay: 6 }, recommendedCount: 4 } );
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		assessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ) );

		expect( assessment.getFeedbackStrings() ).toEqual( {
			noMedia: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: No images appear on this page. " +
				"<a href='https://yoa.st/4f5' target='_blank'>Add some</a>!",
			okay: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Only 1 image appears on this page. We recommend at least 4. " +
				"<a href='https://yoa.st/4f5' target='_blank'>Add more relevant images</a>!",
			good: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Good job!",
		} );
	} );

	it( "returns the videos wording by default when videos are counted.", function() {
		const assessment = new ImageCountAssessment( { scores: { okay: 6 }, recommendedCount: 4 }, true );
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		assessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			videoCount: 1,
		}, true ) );

		expect( assessment.getFeedbackStrings() ).toEqual( {
			noMedia: "<a href='https://yoa.st/4f4' target='_blank'>Images and videos</a>: No images or videos appear on this page. " +
				"<a href='https://yoa.st/4f5' target='_blank'>Add some</a>!",
			okay: "<a href='https://yoa.st/4f4' target='_blank'>Images and videos</a>: Only 2 images or videos appear on this page. " +
				"We recommend at least 4. <a href='https://yoa.st/4f5' target='_blank'>Add more relevant images or videos</a>!",
			good: "<a href='https://yoa.st/4f4' target='_blank'>Images and videos</a>: Good job!",
		} );
	} );

	it( "returns the custom feedback strings, and passes the counts and the product type, when a callback is provided.", function() {
		const getResultTexts = jest.fn( () => ( { noMedia: "no media", okay: "okay", good: "good" } ) );
		const assessment = new ImageCountAssessment( {
			scores: { okay: 6 },
			recommendedCount: 4,
			callbacks: { getResultTexts },
		} );
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. ", {
			productData: { isVariableProduct: true },
		} );

		const result = assessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 2,
		}, true ) );

		expect( result.getText() ).toEqual( "okay" );
		expect( getResultTexts ).toHaveBeenCalledWith( {
			urlTitleAnchorOpeningTag: "<a href='https://yoa.st/4f4' target='_blank'>",
			urlActionAnchorOpeningTag: "<a href='https://yoa.st/4f5' target='_blank'>",
			mediaCount: 2,
			recommendedCount: 4,
			includeVideos: false,
			isVariableProduct: true,
		} );
	} );

	it( "passes includeVideos true, and a mediaCount that includes the videos, when videos are counted.", function() {
		const getResultTexts = jest.fn( () => ( { noMedia: "no media", okay: "okay", good: "good" } ) );
		const assessment = new ImageCountAssessment( {
			scores: { okay: 6 },
			recommendedCount: 4,
			callbacks: { getResultTexts },
		}, true );
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		assessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 2,
			videoCount: 1,
		}, true ) );

		expect( getResultTexts ).toHaveBeenCalledWith( expect.objectContaining( {
			mediaCount: 3,
			includeVideos: true,
		} ) );
	} );

	// The provided-images scope turns video counting off, so the callback must see the effective value, not the flag.
	it( "passes includeVideos false when the paper provides its own images, even though countVideos is on.", function() {
		const getResultTexts = jest.fn( () => ( { noMedia: "no media", okay: "okay", good: "good" } ) );
		const assessment = new ImageCountAssessment( {
			scores: { okay: 6 },
			recommendedCount: 4,
			callbacks: { getResultTexts },
		}, true );
		const mockPaper = new Paper( "These are just five words <video src=\"movie.mp4\"></video>", {
			providedImages: [ { src: "image.jpg", alt: "" } ],
		} );

		assessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			videoCount: 1,
		}, true ) );

		expect( getResultTexts ).toHaveBeenCalledWith( expect.objectContaining( {
			mediaCount: 1,
			includeVideos: false,
		} ) );
	} );

	it( "reports isVariableProduct as false when the paper carries no product data.", function() {
		const getResultTexts = jest.fn( () => ( { noMedia: "no media", okay: "okay", good: "good" } ) );
		const assessment = new ImageCountAssessment( { callbacks: { getResultTexts } } );
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		assessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ) );

		expect( getResultTexts.mock.calls[ 0 ][ 0 ].isVariableProduct ).toBe( false );
	} );

	it( "derives isVariableProduct from the legacy productType when the producer did not send the boolean.", function() {
		const getResultTexts = jest.fn( () => ( { noMedia: "no media", okay: "okay", good: "good" } ) );
		const assessment = new ImageCountAssessment( { callbacks: { getResultTexts } } );
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. ", {
			customData: { productType: "variable" },
		} );

		assessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ) );

		expect( getResultTexts.mock.calls[ 0 ][ 0 ].isVariableProduct ).toBe( true );
	} );
} );
