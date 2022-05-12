import KeyphraseInImagesAssessment from "../../../../src/scoring/assessments/seo/KeyphraseInImageTextAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";

const keyphraseInImagesAssessment = new KeyphraseInImagesAssessment();

describe( "An image count assessment", function() {
	it( "assesses a single image, without a keyword, but with an alt-tag set", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' />" );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				withAlt: 1,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Images on this page have alt attributes, but you have not set your keyphrase. " +
			"<a href='https://yoa.st/4f6' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses 4 images, without a keyword, but with an alt-tag set", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' /> " +
			"<img src='image.jpg' alt='image2' /> <img src='image.jpg' alt='image3' /> <img src='image.jpg' alt='image4' />" );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				withAlt: 4,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Images on this page have alt attributes, but you have not set your keyphrase. " +
			"<a href='https://yoa.st/4f6' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, with an alt-tag without the presence of a keyword", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='keyword' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 1,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Images on this page do not have alt attributes with at least half of the words from your keyphrase. " +
			"<a href='https://yoa.st/4f6' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses four images, with an alt-tag without the presence of a keyword", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' /> " +
			"<img src='image.jpg' alt='image2' /> <img src='image.jpg' alt='image3' /> <img src='image.jpg' alt='image4' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 4,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Images on this page do not have alt attributes with at least half of the words from your keyphrase. " +
			"<a href='https://yoa.st/4f6' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, with alt-tag containing the keyphrase", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 0,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Good job!" );
	} );

	it( "assesses two images with alt-tags, in which one of the tag contains the keyphrase", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 2,
			altTagCount: {
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 1,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: Good job!" );
	} );

	it( "assesses 6 images with alt-tags, in which 2 images tags contain keyphrase, 1 image tag doesn't contain keyphrase, " +
		"and 3 images without alt tags", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 6,
			altTagCount: {
				noAlt: 3,
				withAlt: 0,
				withAltKeyword: 2,
				withAltNonKeyword: 1,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: Good job!" );
	} );

	it( "assesses 6 images with alt tags that contain the keyphrase", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 6,
			altTagCount: {
				withAlt: 0,
				withAltKeyword: 6,
				withAltNonKeyword: 0,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Out of 6 images on this page, 6 have alt attributes with words from your keyphrase or synonyms. That's a bit much. " +
			"<a href='https://yoa.st/4f6' target='_blank'>Only include the keyphrase or its synonyms when it really " +
			"fits the image</a>." );
	} );

	it( "assesses 6 images, with the keyphrase only added to 1 image alt tag", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 6,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 4,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Out of 6 images on this page, only 1 has an alt attribute that reflects the topic of your text. " +
			"<a href='https://yoa.st/4f6' target='_blank'>Add your keyphrase or synonyms to the alt tags of more " +
			"relevant images</a>!" );
	} );

	it( "assesses 5 images in which 2 images alt tags contain keyphrase, 1 image alt tag doesn't contain keyphrase " +
		"and 2 images without alt tags", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
			altTagCount: {
				noAlt: 2,
				withAlt: 0,
				withAltKeyword: 2,
				withAltNonKeyword: 1,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: Good job!" );
	} );

	it( "assesses 5 images, with alt tags containing keyphrase set to only 4 images", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
				withAltKeyword: 4,
				withAltNonKeyword: 0,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: Good job!" );
	} );

	it( "assesses 5 images, with alt tags containing keyphrase set to all 5 images", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
			altTagCount: {
				noAlt: 0,
				withAlt: 0,
				withAltKeyword: 5,
				withAltNonKeyword: 0,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Out of 5 images on this page, 5 have alt attributes with words from your keyphrase or synonyms. That's a bit much. " +
			"<a href='https://yoa.st/4f6' target='_blank'>Only include the keyphrase or its synonyms when it " +
			"really fits the image</a>." );
	} );

	it( "assesses 5 images, with alt tag containing the keyphrase set to only 1 image", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
				withAltKeyword: 1,
				withAltNonKeyword: 3,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Out of 5 images on this page, only 1 has an alt attribute that reflects the topic of your text. " +
			"<a href='https://yoa.st/4f6' target='_blank'>Add your keyphrase or synonyms to the alt tags of " +
			"more relevant images</a>!" );
	} );

	it( "assesses a single image without an alt-tag", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		const assessment = keyphraseInImagesAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
			altTagCount: {
				noAlt: 1,
				withAlt: 0,
				withAltKeyword: 0,
				withAltNonKeyword: 0,
			},
		}, true ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
			"Images on this page do not have alt attributes that reflect the topic of your text. " +
			"<a href='https://yoa.st/4f6' target='_blank'>Add your keyphrase or synonyms to the alt tags of relevant images</a>!" );
	} );

	// Japanese testers test no additional logic.

	// it( "assesses a single image with alt-tag containing a non-exact match of the keyphrase when the keyphrase is enclosed in double quotes in Japanese", function() {
	// 	const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='小さくて可愛い花の刺繍に関する一般一般の記事です' />", {
	// 		keyword: "『小さい花の刺繍』",
	// 	} );
	//
	// 	const result = keyphraseInImagesAssessment.getResult( mockPaper, new JapaneseResearcher( mockPaper ) );
	//
	// 	expect( result.getScore() ).toEqual( 6 );
	// 	expect( result.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>:" +
	// 		" Images on this page do not have alt attributes with at least half of the words from your keyphrase." +
	// 		" <a href='https://yoa.st/4f6' target='_blank'>Fix that</a>!"  );
	// } );

	// it( "assesses a single image with alt-tag containing an exact match of the keyphrase when the keyphrase is enclosed in double quotes in Japanese", function() {
	// 	const mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='小さい花の刺繍' />", {
	// 		keyword: "『小さい花の刺繍』",
	// 	} );
	//
	// 	const result = keyphraseInImagesAssessment.getResult( mockPaper, new JapaneseResearcher( mockPaper ) );
	//
	// 	expect( result.getScore() ).toEqual( 9 );
	// 	expect( result.getText() ).toEqual( "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: " +
	// 		"Good job!" );
	// } );
} );

describe( "tests for the assessment applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paper = new Paper( "" );
		expect( keyphraseInImagesAssessment.isApplicable( paper, Factory.buildMockResearcher( {
			imageCount: 0,
		}, true ) ) ).toBe( false );
	} );

	it( "returns false when the paper is not empty but there is no image present.", function() {
		const paper = new Paper( "sample keyword", {
			slug: "sample-with-keyword",
			keyword: "kéyword",
		} );
		expect( keyphraseInImagesAssessment.isApplicable( paper, Factory.buildMockResearcher( {
			imageCount: 0,
		}, true ) ) ).toBe( false );
	} );

	it( "returns true when the paper is not empty and there is an image present.", function() {
		const paper = new Paper( "These are just five words <img src='image.jpg' />" );
		expect( keyphraseInImagesAssessment.isApplicable( paper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ) ) ).toBe( true );
	} );
} );
