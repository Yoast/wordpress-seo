import ImageCountAssessment from "../../src/assessments/seo/TextImagesAssessment";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
var i18n = Factory.buildJed();

const imageCountAssessment = new ImageCountAssessment();

describe( "An image count assessment for regular analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "disabled";
	} );

	it( "assesses no images", function() {
		var mockPaper = new Paper( "sample" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!" );
	} );

	it( "assesses a single image, without a keyword and alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, without a keyword, but with an alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 0,
				withAlt: 1,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses 4 images, without a keyword, but with an alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' /> <img src='image.jpg' alt='image2' /> <img src='image.jpg' alt='image3' /> <img src='image.jpg' alt='image4' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 0,
				withAlt: 4,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, with a keyword and alt-tag set, but with a non-keyword alt-tag", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='keyword' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 1,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses four images, with a keyword and alt-tag set, but with a non-keyword alt-tag", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' /> <img src='image.jpg' alt='image2' /> <img src='image.jpg' alt='image3' /> <img src='image.jpg' alt='image4' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 4,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, with a keyword and alt-tag set to keyword", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Some images on this page contain alt attributes with words from your keyphrase! Good job!" );
	} );

	it( "assesses two image, with a keyword and alt-tag set to keyword for 1 of 2 images", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 2,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 1,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Some images on this page contain alt attributes with words from your keyphrase! Good job!" );
	} );

	it( "assesses 6 images, with a keyword and alt-tag set to keyword for 1 image, alt-tag set to non-keyword for 1 image and 4 images without alt tags", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 6,
			altTagCount: {
				noAlt: 4,
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 1,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Some images on this page contain alt attributes with words from your keyphrase! Good job!" );
	} );
} );

describe( "An image count assessment for Recalibration analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "enabled";
	} );

	it( "assesses no images", function() {
		var mockPaper = new Paper( "sample" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!" );
	} );

	it( "assesses a single image, without a keyword and alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, without a keyword, but with an alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 0,
				withAlt: 1,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page have alt attributes, but you have not set your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses 4 images, without a keyword, but with an alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' /> <img src='image.jpg' alt='image2' /> <img src='image.jpg' alt='image3' /> <img src='image.jpg' alt='image4' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 0,
				withAlt: 4,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page have alt attributes, but you have not set your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, with a keyword and alt-tag set, but with a non-keyword alt-tag", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='keyword' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 1,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with at least half of the words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses four images, with a keyword and alt-tag set, but with a non-keyword alt-tag", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' /> <img src='image.jpg' alt='image2' /> <img src='image.jpg' alt='image3' /> <img src='image.jpg' alt='image4' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 4,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with at least half of the words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, with a keyword and alt-tag set to keyword", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: The image on this page contains an alt attribute with at least half of the words from the keyphrase. Good job!" );
	} );

	it( "assesses two images, with a keyword and alt-tag set to keyword for 1 of 2 images", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 2,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 1,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Out of 2 images on this page, 1 has an alt attribute with at least half of the words from the keyphrase. Good job!" );
	} );

	it( "assesses 6 images, with a keyword and alt-tag set to keyword for 2 images, alt-tag set to non-keyword for 1 image and 3 images without alt tags", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 6,
			altTagCount: {
				noAlt: 3,
				withAlt: 0,
				withAltKeyword: 2,
				withAltNonKeyword: 1,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Out of 6 images on this page, 2 have alt attributes with at least half of the words from the keyphrase. Good job!" );
	} );

	it( "assesses 6 images, with a keyword and alt-tag set to keyword for all 6 images", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 6,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 6,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Out of 6 images on this page, 6 have alt attributes with at least half of the words from the keyphrase. That's a bit much. <a href='https://yoa.st/33d' target='_blank'>Only include the focus keyphrase when it really fits the image</a>." );
	} );

	it( "assesses 6 images, with a keyword and alt-tag set to keyword for only 1 image", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 6,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 4,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Out of 6 images on this page, only 1 has an alt attribute with at least half of the words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses 5 images, with a keyword and alt-tag set to keyword for 2 images, alt-tag set to non-keyword for 1 image and 2 images without alt tags", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
			altTagCount: {
				noAlt: 2,
				withAlt: 0,
				withAltKeyword: 2,
				withAltNonKeyword: 1,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Out of 5 images on this page, 2 have alt attributes with at least half of the words from the keyphrase. Good job!" );
	} );

	it( "assesses 5 images, with a keyword and alt-tag set to keyword for 4 images", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
				withAltKeyword: 4,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Out of 5 images on this page, 4 have alt attributes with at least half of the words from the keyphrase. Good job!" );
	} );

	it( "assesses 5 images, with a keyword and alt-tag set to keyword for all 5 images", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 5,
				withAltNonKeyword: 0,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Out of 5 images on this page, 5 have alt attributes with at least half of the words from the keyphrase. That's a bit much. <a href='https://yoa.st/33d' target='_blank'>Only include the focus keyphrase when it really fits the image</a>." );
	} );

	it( "assesses 5 images, with a keyword and alt-tag set to keyword for only 1 image", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 3,
			}
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Out of 5 images on this page, only 1 has an alt attribute with at least half of the words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );
} );
