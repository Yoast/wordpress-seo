import { __, _n, sprintf } from "@wordpress/i18n";
import ImageAltTagsAssessment from "../../../../src/scoring/assessments/seo/ImageAltTagsAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";

const imageAltTagsAssessment = new ImageAltTagsAssessment();

describe( "test to check if all images have alt tags", function() {
	it( "shows the assessment when there is an image but no text and gives the correct feedback", function() {
		const mockPaper = new Paper( "<img src='image.jpg' />" );
		const result = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
			},
		}, true ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='' target='_blank'>Image alt attributes</a>: None of the images have alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!" );
	} );

	it( "shows the assessment when the page is empty and gives the correct feedback", function() {
		const mockPaper = new Paper( "" );
		const result = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
			},
		}, true ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='' target='_blank'>Image alt attributes</a>: This page does not have images with alt attributes. <a href='' target='_blank'>Add some</a>!" );
	} );

	it( "assesses a paper with text but no images is found", () => {
		const mockPaper = new Paper( "This is a test paper" );
		const result = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
			},
		}, true ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='' target='_blank'>Image alt attributes</a>: This page does not have images with alt attributes. <a href='' target='_blank'>Add some</a>!" );
	} );

	it( "assesses text with 4 images and none of them has alt tags", function() {
		const mockPaper = new Paper( "sample" );

		const result = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 4,
				withAlt: 0,
			},
		}, true ) );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='' target='_blank'>Image alt attributes</a>: None of the images have alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!" );
	} );

	it( "assesses text with 4 images and 1 of the doesn't have alt tags", function() {
		const mockPaper = new Paper( "sample" );

		const result = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 1,
				noImagesBad: 1,
				withAlt: 3,
			},
		}, true ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='' target='_blank'>Image alt attributes</a>: One image doesn't have alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!" );
	} );

	it( "assesses text with 4 images and 2 of the doesn't have alt tags", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		const result = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 2,
				withAlt: 2,
			},
		}, true ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual(  "<a href='' target='_blank'>Image alt attributes</a>: Some images don't have alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!" );
	} );

	it( "assesses a text with 4 images and all of them have alt attributes", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		const result = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 0,
				withAlt: 4,
			},
		}, true ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='' target='_blank'>Image alt attributes</a>: All images have alt attributes. Good job!" );
	} );
} );

describe( "tests for retrieving the feedback strings.", function() {
	it( "should return the default feedback strings when no custom callback is provided.", function() {
		const assessment = new ImageAltTagsAssessment();
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		assessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 0,
				withAlt: 4,
			},
		}, true ) );

		expect( assessment.getFeedbackStrings() ).toEqual( {
			good: "<a href='' target='_blank'>Image alt attributes</a>: All images have alt attributes. Good job!",
			noImagesBad: "<a href='' target='_blank'>Image alt attributes</a>: This page does not have images with alt attributes. <a href='' target='_blank'>Add some</a>!",
			noneHasAltBad: "<a href='' target='_blank'>Image alt attributes</a>: None of the images have alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!",
			someHaveAltBad: "<a href='' target='_blank'>Image alt attributes</a>: Some images don't have alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!",
		} );
	} );

	it( "should return the custom feedback strings when a custom callback is provided.", function() {
		/**
		 * Returns the result texts for the Image alt tags assessment.
		 *
		 * @param {string} urlTitleAnchorOpeningTag The anchor opening tag to the article about this assessment.
		 * @param {string} urlActionAnchorOpeningTag The anchor opening tag to the call to action URL to the help article of this assessment.
		 * @param {number} numberOfImagesWithoutAlt The number of images without alt tags.
		 * @param {number} totalNumberOfImages The total number of images found in the text.
		 *
		 * @returns {{good: string, noImagesBad: string, noneHasAltBad: string, someHaveAltBad: string}} The object that contains the result texts as a translation string.
		 */
		const getResultTexts = ( { urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag, numberOfImagesWithoutAlt, totalNumberOfImages } ) => {
			return {
				good: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sImage alt attributes%2$s: All images have alt attributes. Good job!",
						"this-is-a-test-domain"
					),
					urlTitleAnchorOpeningTag,
					"</a>"
				),
				noImagesBad: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sImage alt attributes%3$s: This page does not have images with alt attributes. %2$sAdd some%3$s!",
						"this-is-a-test-domain"
					),
					urlTitleAnchorOpeningTag,
					urlActionAnchorOpeningTag,
					"</a>"
				),
				noneHasAltBad: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sImage alt attributes%3$s: None of the images has alt attributes. %2$sAdd alt attributes to your images%3$s!",
						"this-is-a-test-domain"
					),
					urlTitleAnchorOpeningTag,
					urlActionAnchorOpeningTag,
					"</a>"
				),
				someHaveAltBad: sprintf(
					/* translators: %3$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag, %1$d expands to the number of images without alt tags, %2$d expands to the number of images found in the text, */
					_n(
						"%3$sImage alt attributes%5$s: %1$d image out of %2$d doesn't have alt attributes. %4$sAdd alt attributes to your images%5$s!",
						"%3$sImage alt attributes%5$s: %1$d images out of %2$d don't have alt attributes. %4$sAdd alt attributes to your images%5$s!",
						numberOfImagesWithoutAlt,
						"this-is-a-test-domain"
					),
					numberOfImagesWithoutAlt,
					totalNumberOfImages,
					urlTitleAnchorOpeningTag,
					urlActionAnchorOpeningTag,
					"</a>"
				),
			};
		};
		const assessment = new ImageAltTagsAssessment( {
			callbacks: { getResultTexts },
		} );
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		assessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 0,
				withAlt: 4,
			},
		}, true ) );

		expect( assessment.getFeedbackStrings() ).toEqual( {
			good: "<a href='' target='_blank'>Image alt attributes</a>: All images have alt attributes. Good job!",
			noImagesBad: "<a href='' target='_blank'>Image alt attributes</a>: This page does not have images with alt attributes. <a href='' target='_blank'>Add some</a>!",
			noneHasAltBad: "<a href='' target='_blank'>Image alt attributes</a>: None of the images has alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!",
			someHaveAltBad: "<a href='' target='_blank'>Image alt attributes</a>: 0 images out of 4 don't have alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!",
		} );
	} );
} );
