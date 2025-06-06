import SubheadingDistributionTooLong from "../../../../src/scoring/assessments/readability/SubheadingDistributionTooLongAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
import CornerstoneContentAssessor from "../../../../src/scoring/assessors/cornerstone/contentAssessor.js";
import ProductCornerstoneContentAssessor from "../../../../src/scoring/assessors/productPages/cornerstone/contentAssessor.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher.js";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";
import japaneseConfig from "../../../../src/languageProcessing/languages/ja/config/subheadingsTooLong.js";

const shortText = "a ".repeat( 200 );
const fairlyLongText = "a ".repeat( 260 );
const longText = "a ".repeat( 330 );
const veryLongText = "a ".repeat( 360 );
const shortTextJapanese = "熱".repeat( 599 );
const longTextJapanese = "熱".repeat( 601 );
const subheading = "<h2> some subheading </h2>";

describe( "An assessment for scoring too long text fragments without a subheading.", function() {
	it( "Scores a short text (<300 words), which does not have subheadings.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( shortText ),
			Factory.buildMockResearcher( [] )
		);
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	} );

	it( "returns a good score when the paper has no text", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( [] )
		);
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	} );

	it( "Scores a text that's short (<300 words) after excluding elements we don't want to analyze," +
		" and which does not have subheadings.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( shortText + "<blockquote>" + shortText + "</blockquote>" ),
			Factory.buildMockResearcher( [] )
		);
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	} );

	it( "Scores a text that's short (<300 words) after excluding shortcodes, and which does not have subheadings.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( shortText + "[shortcode] ".repeat( 150 ) + "[/shortcode] ".repeat( 150 ), { shortcodes: [ "shortcode" ] } ),
			Factory.buildMockResearcher( [] )
		);
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	} );

	it( "Scores a short text (<300 words), which has subheadings.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( "a " + subheading + shortText ),
			Factory.buildMockResearcher(  [
				{ subheading: subheading,
					text: shortText,
					index: 2,
					countLength: 202,
				},
			] )
		);
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	} );

	it( "Scores a long text (>300 words), which does not have subheadings.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( longText ),
			Factory.buildMockResearcher( [] )
		);
		expect( result.getScore() ).toBe( 2 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, although your text is rather long. <a href='https://yoa.st/34y' target='_blank'>" +
			"Try and add some subheadings</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( shortText + subheading + shortText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: shortText,
					countLength: 200,
				},
				{ subheading: subheading,
					text: shortText,
					index: 200,
					countLength: 200,
				},
			] )
		);
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for one, " +
		"which is between 300 and 350 words long.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( shortText + subheading + longText + subheading + shortText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: longText,
					countLength: 200,
				},
				{ subheading: subheading,
					text: longText,
					index: 200,
					countLength: 330,
				},
				{ subheading: subheading,
					text: shortText,
					index: 530,
					countLength: 200,
				},
			] )
		);
		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>:" +
			" 1 section of your text is longer than the recommended number of words (300) and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for two, " +
		"which are between 300 and 350 words long.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( shortText + subheading + longText + subheading + longText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: longText,
					countLength: 200,
				},
				{ subheading: subheading,
					text: longText,
					index: 200,
					countLength: 330,
				},
				{ subheading: subheading,
					text: longText,
					index: 530,
					countLength: 330,
				},
			] )
		);
		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than the recommended number of words (300) and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for one, " +
		"which is above 350 words long.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( shortText + subheading + veryLongText + subheading + shortText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: veryLongText,
					countLength: 200,
				},
				{ subheading: subheading,
					text: veryLongText,
					index: 200,
					countLength: 360,
				},
				{ subheading: subheading,
					text: shortText,
					index: 562,
					countLength: 200,
				},
			] )
		);
		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than the recommended number of words (300) and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and some sections of the text are above 350 words long.", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( veryLongText + subheading + veryLongText + subheading + longText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: shortText,
					countLength: 330,
				},
				{ subheading: subheading,
					text: veryLongText,
					index: 200,
					countLength: 330,
				},
				{ subheading: subheading,
					text: longText,
					index: 530,
					countLength: 330,
				},
			] )
		);
		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"3 sections of your text are longer than the recommended number of words (300) and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a text with subheadings: When the text before the first subheading is between 300-350," +
		" and no other texts that come after a subheading is long", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( longText + subheading + shortText + subheading + shortText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: longText,
					countLength: 310,
				},
				{ subheading: subheading,
					text: shortText,
					index: 330,
					countLength: 200,
				},
				{ subheading: subheading,
					text: shortText,
					index: 532,
					countLength: 200,
				},
			] )
		);
		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"The beginning of your text is longer than 300 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability.</a>" );
	} );

	it( "Scores a text with subheadings (cornerstone content): When the text before the first subheading is between 250-300," +
		" and no other texts that come after a subheading is long", function() {
		const assessment = new SubheadingDistributionTooLong( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumLength: 250,
			},
			applicableIfTextLongerThan: 250,
			cornerstoneContent: true,
		} );
		const result = assessment.getResult(
			new Paper( fairlyLongText + subheading + shortText + subheading + shortText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: fairlyLongText,
					countLength: 260,
				},
				{ subheading: subheading,
					text: shortText,
					index: 110,
					countLength: 200,
				},
				{ subheading: subheading,
					text: shortText,
					index: 532,
					countLength: 200,
				},
			] )
		);
		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"The beginning of your text is longer than 250 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability.</a>" );
	} );

	it( "Scores a text with subheadings: When the text before the first subheading is more than 350," +
		" and no other texts that come after a subheading is long", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( veryLongText + subheading + shortText + subheading + shortText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: veryLongText,
					countLength: 380,
				},
				{ subheading: subheading,
					text: shortText,
					index: 330,
					countLength: 200,
				},
				{ subheading: subheading,
					text: shortText,
					index: 532,
					countLength: 200,
				},
			] )
		);
		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"The beginning of your text is longer than 300 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability.</a>" );
	} );

	it( "Scores a text with subheadings (cornerstone content): When the text before the first subheading is more than 300," +
		" and no other texts that come after a subheading is long", function() {
		const assessment = new SubheadingDistributionTooLong( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumLength: 250,
			},
			applicableIfTextLongerThan: 250,
			cornerstoneContent: true,
		} );
		const result = assessment.getResult(
			new Paper( longText + subheading + shortText + subheading + shortText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: longText,
					countLength: 340,
				},
				{ subheading: subheading,
					text: shortText,
					index: 330,
					countLength: 200,
				},
				{ subheading: subheading,
					text: shortText,
					index: 532,
					countLength: 200,
				},
			] )
		);
		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"The beginning of your text is longer than 250 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability.</a>" );
	} );

	it( "Scores a text with subheadings: When the text before the first subheading is more than 300 words" +
		" and there are other long texts that come after a subheading", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( veryLongText + subheading + veryLongText + subheading + shortText ),
			Factory.buildMockResearcher(  [
				{ subheading: "",
					text: veryLongText,
					countLength: 380,
				},
				{ subheading: subheading,
					text: veryLongText,
					index: 330,
					countLength: 400,
				},
				{ subheading: subheading,
					text: shortText,
					index: 532,
					countLength: 250,
				},
			] )
		);
		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than the recommended number of words (300) and are not separated by any subheadings. " +
			"<a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a text with subheadings: When the text before the first subheading is less than 300 words" +
		" and there are other long texts that come after a subheading", function() {
		const assessment = new SubheadingDistributionTooLong();
		const result = assessment.getResult(
			new Paper( shortText + subheading + veryLongText + subheading + veryLongText ),
			Factory.buildMockResearcher( [
				{ subheading: "",
					text: shortText,
					countLength: 200,
				},
				{ subheading: subheading,
					text: shortText,
					index: 330,
					countLength: 400,
				},
				{ subheading: subheading,
					text: shortText,
					index: 532,
					countLength: 450,
				},
			] )
		);
		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than the recommended number of words (300) and are not separated by any subheadings. " +
			"<a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Returns false from hasSubheadings to the paper without subheading", function() {
		const paper =  new Paper( shortText );
		const assessment = new SubheadingDistributionTooLong();
		const hasSubheadings = assessment.hasSubheadings( paper );
		expect( hasSubheadings ).toBe( false );
	} );

	it( "Returns true from hasSubheadings to the paper with subheading", function() {
		const assessment = new SubheadingDistributionTooLong();
		const hasSubheadings = assessment.hasSubheadings( new Paper( shortText + subheading + longText ) );
		expect( hasSubheadings ).toBe( true );
	} );
} );

describe( "Language-specific configuration for specific types of content is used: English", function() {
	const mockPaper = new Paper( "" );
	const mockOptions = { subheadingUrlTitle: "https://yoa.st/34x", subheadingCTAUrl: "https://yoa.st/34y" };
	const englishResearcher = new EnglishResearcher( mockPaper );

	const cornerStoneContentAssessor = new CornerstoneContentAssessor( englishResearcher );
	const productCornerstoneContentAssessor = new ProductCornerstoneContentAssessor( englishResearcher, mockOptions );
	const assessors = [ cornerStoneContentAssessor, productCornerstoneContentAssessor ];
	it.each( assessors )( "should use the default cornerstone configuration", function( assessor ) {
		const assessment = assessor.getAssessment( "subheadingsTooLong" );
		assessment.getLanguageSpecificConfig( englishResearcher );
		expect( assessment._config.parameters.recommendedMaximumLength ).toEqual( 250 );
		expect( assessment._config.parameters.slightlyTooMany ).toEqual( 250 );
		expect( assessment._config.parameters.farTooMany ).toEqual( 300 );
	} );
} );

describe( "Language-specific configuration for specific types of content is used: Japanese", function() {
	const mockPaper = new Paper( "" );
	const mockOptions = { subheadingUrlTitle: "https://yoa.st/34x", subheadingCTAUrl: "https://yoa.st/34y" };
	const japaneseResearcher = new JapaneseResearcher( mockPaper );

	it( "should use a language-specific default configuration", function() {
		const assessment = new SubheadingDistributionTooLong();
		assessment.getLanguageSpecificConfig( japaneseResearcher );
		expect( assessment._config.recommendedMaximumLength ).toEqual( japaneseConfig.defaultParameters.recommendedMaximumLength );
		expect( assessment._config.slightlyTooMany ).toEqual( japaneseConfig.defaultParameters.slightlyTooMany );
		expect( assessment._config.farTooMany ).toEqual( japaneseConfig.defaultParameters.farTooMany );
	} );

	const cornerStoneContentAssessor = new CornerstoneContentAssessor( japaneseResearcher );
	const productCornerstoneContentAssessor = new ProductCornerstoneContentAssessor( japaneseResearcher, mockOptions );
	const assessors = [ cornerStoneContentAssessor, productCornerstoneContentAssessor ];
	it.each( assessors )( "should use the default cornerstone configuration", function( assessor ) {
		const assessment = assessor.getAssessment( "subheadingsTooLong" );
		assessment.getLanguageSpecificConfig( japaneseResearcher );
		expect( assessment._config.recommendedMaximumLength ).toEqual( japaneseConfig.cornerstoneParameters.recommendedMaximumLength );
		expect( assessment._config.slightlyTooMany ).toEqual( japaneseConfig.cornerstoneParameters.slightlyTooMany );
		expect( assessment._config.farTooMany ).toEqual( japaneseConfig.cornerstoneParameters.farTooMany );
	} );
} );

describe( "A test for scoring too long text fragments without a subheading for languages that use 'characters' " +
	"in the feedback strings instead of 'words'", function() {
	let assessment;
	beforeEach( () => {
		assessment = new SubheadingDistributionTooLong();
		jest.resetModules();
	} );
	// Japanese uses 'characters' in the feedback strings.
	it( "scores a text where one section is slightly too long.", function() {
		const paper = new Paper( shortTextJapanese + subheading + longTextJapanese + subheading + shortTextJapanese );
		const result = assessment.getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than the recommended number of characters (600) and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );
	it( "scores a text where multiple sections are slightly too long.", function() {
		const paper = new Paper( shortTextJapanese + subheading + longTextJapanese + subheading + longTextJapanese );
		const result = assessment.getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than the recommended number of characters (600) and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );
	it( "scores a text with subheadings: When the text before the first subheading is between 300-350," +
		" and no other texts that come after a subheading is long", function() {
		const paper = new Paper( longTextJapanese + subheading + shortTextJapanese + subheading + shortTextJapanese );
		const result = assessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"The beginning of your text is longer than 600 characters and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability.</a>" );
	} );
} );

describe( "A test for marking too long text segments not separated by a subheading", function() {
	let assessment;
	beforeEach( () => {
		assessment = new SubheadingDistributionTooLong();
		jest.resetModules();
	} );
	it( "returns markers for too long text segments: where the text before first subheading is short", function() {
		const paper = new Paper( shortText + subheading + veryLongText  + subheading + veryLongText );
		const textFragment = Factory.buildMockResearcher( [
			{
				text: "This is a text before the first subheading",
				countLength: 200,
				subheading: "",
			},
			{
				text: "This is a too long fragment. It contains 360 words.",
				countLength: 360,
				index: 110,
				subheading: "<h2>First subheading</h2>",
			},
			{
				text: "This is another too long fragment. It contains 330 words.",
				countLength: 330,
				index: 1000,
				subheading: "<h2>Second subheading</h2>",
			},
		]
		);
		const expected = [
			new Mark( {
				original: "First subheading",
				marked: "<yoastmark class='yoast-text-mark'>First subheading</yoastmark>",
				fieldsToMark: [ "heading" ],
			} ),
			new Mark( {
				original: "Second subheading",
				marked: "<yoastmark class='yoast-text-mark'>Second subheading</yoastmark>",
				fieldsToMark: [ "heading" ],
			} ),
		];
		assessment.getResult( paper, textFragment );
		expect( assessment.getMarks() ).toEqual( expected );
		expect( assessment.getResult( paper, textFragment )._hasMarks ).toEqual( true );
	} );

	it( "returns markers for too long text segments: where the text before first subheading is long", function() {
		const paper = new Paper( veryLongText + subheading + veryLongText + subheading + veryLongText );
		const textFragment = Factory.buildMockResearcher( [
			{
				text: "This is a text before the first subheading",
				countLength: 400,
				subheading: "",
			},
			{
				text: "This is a too long fragment. It contains 360 words.",
				countLength: 360,
				index: 110,
				subheading: "<h2>First subheading</h2>",
			},
			{
				text: "This is another too long fragment. It contains 330 words.",
				countLength: 330,
				index: 1000,
				subheading: "<h2>Second subheading</h2>",
			},
		]
		);
		const expected = [
			new Mark( {
				original: "First subheading",
				marked: "<yoastmark class='yoast-text-mark'>First subheading</yoastmark>",
				fieldsToMark: [ "heading" ],
			} ),
			new Mark( {
				original: "Second subheading",
				marked: "<yoastmark class='yoast-text-mark'>Second subheading</yoastmark>",
				fieldsToMark: [ "heading" ],
			} ),
		];
		assessment.getResult( paper, textFragment );
		expect( assessment.getMarks() ).toEqual( expected );
		expect( assessment.getResult( paper, textFragment )._hasMarks ).toEqual( true );
	} );

	it( "returns no markers if no text segments is too long and no subheadings are found in the text", function() {
		const paper = new Paper( shortText );
		const textFragment = Factory.buildMockResearcher( [] );
		expect( assessment.getResult( paper, textFragment )._hasMarks ).toEqual( false );
	} );

	it( "returns no markers if no text segments is too long", function() {
		const paper = new Paper( shortText + subheading + shortText + subheading );
		const textFragment = Factory.buildMockResearcher( [
			{
				text: "This is a text before the first subheading",
				countLength: 200,
				subheading: "",
			},
			{
				text: "This is a too long fragment. It contains 360 words.",
				countLength: 200,
				index: 110,
				subheading: "<h2>First subheading</h2>",
			},
			{
				text: "This is another too long fragment. It contains 330 words.",
				countLength: 200,
				index: 1000,
				subheading: "<h2>Second subheading</h2>",
			},
		] );
		expect( assessment.getResult( paper, textFragment )._hasMarks ).toEqual( false );
	} );
} );

