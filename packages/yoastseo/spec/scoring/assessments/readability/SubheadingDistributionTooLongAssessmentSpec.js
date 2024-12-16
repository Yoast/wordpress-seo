import SubheadingDistributionTooLong from "../../../../src/scoring/assessments/readability/SubheadingDistributionTooLongAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
import CornerstoneContentAssessor from "../../../../src/scoring/assessors/cornerstone/contentAssessor.js";
import ProductCornerstoneContentAssessor from "../../../../src/scoring/assessors/productPages/cornerstone/contentAssessor.js";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher.js";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";
import japaneseConfig from "../../../../src/languageProcessing/languages/ja/config/subheadingsTooLong.js";

const subheadingDistributionTooLong = new SubheadingDistributionTooLong();

const shortText = "a ".repeat( 200 );
const fairlyLongText = "a ".repeat( 260 );
const longText = "a ".repeat( 330 );
const veryLongText = "a ".repeat( 360 );
const shortTextJapanese = "熱".repeat( 599 );
const longTextJapanese = "熱".repeat( 601 );
// const veryLongTextJapanese = "熱".repeat( 701 );  // Variable is used in language specific test (and thus removed)
const subheading = "<h2> some subheading </h2>";

describe( "An assessment for scoring too long text fragments without a subheading.", function() {
	it( "Scores a short text (<300 words), which does not have subheadings.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText ),
			Factory.buildMockResearcher( [] )
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	} );

	it( "Scores a text that's short (<300 words) after excluding elements we don't want to analyze," +
		" and which does not have subheadings.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + "<blockquote>" + shortText + "</blockquote>" ),
			Factory.buildMockResearcher( [] )
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	} );

	it( "Scores a text that's short (<300 words) after excluding shortodes," +
		" and which does not have subheadings.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + "[shortcode] ".repeat( 150 ) + "[/shortcode] ".repeat( 150 ), { shortcodes: [ "shortcode" ] } ),
			Factory.buildMockResearcher( [] )
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	} );

	it( "Scores a short text (<300 words), which has subheadings.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( "a " + subheading + shortText ),
			Factory.buildMockResearcher(  [
				{ subheading: subheading,
					text: shortText,
					index: 2,
					countLength: 202,
				},
			] )
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	} );

	it( "Scores a long text (>300 words), which does not have subheadings.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( longText ),
			Factory.buildMockResearcher( [] )
		);
		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, although your text is rather long. <a href='https://yoa.st/34y' target='_blank'>" +
			"Try and add some subheadings</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
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
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for one, " +
		"which is between 300 and 350 words long.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
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
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than 300 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for two, " +
		"which are between 300 and 350 words long.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
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
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 300 words and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for one, " +
		"which is above 350 words long.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
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
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than 300 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and some sections of the text are above 350 words long.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
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
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"3 sections of your text are longer than 300 words and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a text with subheadings: When the text before the first subheading is between 300-350," +
		" and no other texts that come after a subheading is long", function() {
		const assessment = subheadingDistributionTooLong.getResult(
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
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"The beginning of your text is longer than 300 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability.</a>" );
	} );

	it( "Scores a text with subheadings (cornerstone content): When the text before the first subheading is between 250-300," +
		" and no other texts that come after a subheading is long", function() {
		const assessment = 	new SubheadingDistributionTooLong( {
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
		const assessment = subheadingDistributionTooLong.getResult(
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
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"The beginning of your text is longer than 300 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability.</a>" );
	} );

	it( "Scores a text with subheadings (cornerstone content): When the text before the first subheading is more than 300," +
		" and no other texts that come after a subheading is long", function() {
		const assessment = 	new SubheadingDistributionTooLong( {
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
		const assessment = subheadingDistributionTooLong.getResult(
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
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 300 words and are not separated by any subheadings. " +
			"<a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a text with subheadings: When the text before the first subheading is less than 300 words" +
		" and there are other long texts that come after a subheading", function() {
		const assessment = subheadingDistributionTooLong.getResult(
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
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 300 words and are not separated by any subheadings. " +
			"<a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Returns false from hasSubheadings to the paper without text", function() {
		const paper =  new Paper( shortText );
		const assessment = subheadingDistributionTooLong.hasSubheadings( paper );
		expect( assessment ).toBe( false );
	} );

	it( "Returns true from hasSubheadings to the paper with text", function() {
		const assessment = subheadingDistributionTooLong.hasSubheadings( new Paper( shortText + subheading + longText ) );
		expect( assessment ).toBe( true );
	} );
} );

describe( "A test for the assessment applicability", () => {
	it( "Returns false from isApplicable to the paper without text", function() {
		const paper = new Paper( "" );
		const assessment = subheadingDistributionTooLong.isApplicable( paper );
		expect( assessment ).toBe( false );
	} );

	it( "Returns true from isApplicable to the paper with text", function() {
		const paper = new Paper( shortText );
		const assessment = subheadingDistributionTooLong.isApplicable( paper );
		expect( assessment ).toBe( true );
	} );

	it( "returns false if the text is too short", function() {
		const paper = new Paper( "hallo" );
		expect( new SubheadingDistributionTooLong().isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false if the text is too short after excluding text inside elements we don't want to analyze", function() {
		const paper = new Paper( "<blockquote>" + longText + "</blockquote>" );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } );
		expect( assessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "should return false for isApplicable for a paper with only an image.", function() {
		const paper = new Paper( "<img src='https://example.com/image.png' alt='test'>" );
		expect( new SubheadingDistributionTooLong().isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );

	it( "should return false for isApplicable for a paper with only spaces.", function() {
		const paper = new Paper( "        " );
		expect( new SubheadingDistributionTooLong().isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );
	it( "Returns false when the assessment shouldn't appear in short text analysis and the paper is empty", function() {
		const paper = new Paper( "" );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } );
		expect( assessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "Returns true when the assessment shouldn't appear in short text analysis but the text contains more than 300 words", function() {
		const paper = new Paper( longText );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } );
		expect( assessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( true );
	} );

	it( "Returns false when the assessment shouldn't appear in short text analysis and the text contains less than 300 words", function() {
		const paper = new Paper( shortText );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } );
		expect( assessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );
} );

// Only keep last two tests to test the this.getLanguageSpecificConfig( researcher ) logic in isApplicable method.
describe( "An assessment for scoring too long text fragments without a subheading in Japanese.", function() {
	// it( "Scores a short text in Japanese (<600 characters), which does not have subheadings.", function() {
	// 	const paper = new Paper( shortTextJapanese );
	// 	const japaneseResearcher = new JapaneseResearcher( paper );
	// 	const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
	// 	const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
	// 	expect( results.getScore() ).toBe( 9 );
	// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
	// 		"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	// } );
	//
	// it( "Scores a short text in Japanese (<600 characters), which has subheadings.", function() {
	// 	const paper = new Paper( "定冠詞 " + subheading + shortTextJapanese );
	// 	const japaneseResearcher = new JapaneseResearcher( paper );
	// 	const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
	// 	const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
	// 	expect( results.getScore() ).toBe( 9 );
	// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	// } );
	//
	// it( "Scores a long text in Japanese (>600 characters), which does not have subheadings.", function() {
	// 	const paper = new Paper( longTextJapanese );
	// 	const japaneseResearcher = new JapaneseResearcher( paper );
	// 	const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
	// 	const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
	// 	expect( results.getScore() ).toBe( 2 );
	// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
	// 		"You are not using any subheadings, although your text is rather long. <a href='https://yoa.st/34y' target='_blank'>" +
	// 		"Try and add some subheadings</a>." );
	// } );
	//
	// it( "Scores a long text in Japanese (>600 characters), which has subheadings and all sections of the text are <600 characters.", function() {
	// 	const paper = new Paper( shortTextJapanese + subheading + shortTextJapanese );
	// 	const japaneseResearcher = new JapaneseResearcher( paper );
	// 	const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
	// 	const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
	// 	expect( results.getScore() ).toBe( 9 );
	// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	// } );
	//
	// it( "Scores a long text in Japanese (>600 characters), which has subheadings and all sections of the " +
	// 	"text are <600 characters, except for one, which is between 650 and 700 characters long.", function() {
	// 	const paper = new Paper( shortTextJapanese + subheading + longTextJapanese + subheading + shortTextJapanese );
	// 	const japaneseResearcher = new JapaneseResearcher( paper );
	// 	const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
	// 	const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
	// 	expect( results.getScore() ).toBe( 6 );
	// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
	// 		"1 section of your text is longer than 600 characters and is not separated by any subheadings." +
	// 		" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	// } );
	// it( "Scores a long text in Japanese (>600 characters), which has subheadings and all sections of the " +
	// 	"text are <600 characters, except for two, which are between 650 and 700 characters long.", function() {
	// 	const paper = new Paper( shortTextJapanese + subheading + longTextJapanese + subheading + longTextJapanese );
	// 	const japaneseResearcher = new JapaneseResearcher( paper );
	// 	const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
	// 	const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
	// 	expect( results.getScore() ).toBe( 6 );
	// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
	// 		"2 sections of your text are longer than 600 characters and are not separated by any subheadings." +
	// 		" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	// } );
	//
	// it( "Scores a long text in Japanese (>600 characters), which has subheadings and some sections of the" +
	// 	" text are above 700 characters long.", function() {
	// 	const paper = new Paper( shortTextJapanese + subheading + veryLongTextJapanese + subheading + veryLongTextJapanese );
	// 	const japaneseResearcher = new JapaneseResearcher( paper );
	// 	const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
	// 	const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
	// 	expect( results.getScore() ).toBe( 3 );
	// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
	// 		"2 sections of your text are longer than 600 characters and are not separated by any subheadings." +
	// 		" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	// } );
	//
	// it( "Scores a long text in Japanese (>600 characters), which has subheadings and all sections of the " +
	// 	"text are <600 characters, except for one, which is above 700 characters long.", function() {
	// 	const paper = new Paper( shortTextJapanese + subheading + veryLongTextJapanese + subheading + shortTextJapanese );
	// 	const japaneseResearcher = new JapaneseResearcher( paper );
	// 	const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
	// 	const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
	// 	expect( results.getScore() ).toBe( 3 );
	// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
	// 		"1 section of your text is longer than 600 characters and is not separated by any subheadings." +
	// 		" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	// } );
	//
	// it( "Scores a long text (>600 characters), which has subheadings and some sections of the text are " +
	// 	"above 700 characters long.", function() {
	// 	const paper = new Paper( shortTextJapanese + subheading + veryLongTextJapanese + subheading + veryLongTextJapanese );
	// 	const japaneseResearcher = new JapaneseResearcher( paper );
	// 	const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
	// 	const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
	// 	expect( results.getScore( paper, japaneseResearcher ) ).toBe( 3 );
	// 	expect( results.getText( paper, japaneseResearcher ) ).toBe( "<a href='https://yoa.st/34x' target='_blank'>" +
	// 		"Subheading distribution</a>: 2 sections of your text are longer than 600 characters and are not separated " +
	// 		"by any subheadings. <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	// } );

	it( "Returns false when the assessment shouldn't appear in short text analysis and the text contains less " +
		"than 600 characters in Japanese", function() {
		const paper = new Paper( shortTextJapanese );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } );
		expect( assessment.isApplicable( paper, new JapaneseResearcher( paper ) ) ).toBe( false );
	} );

	it( "Returns true when the assessment shouldn't appear in short text analysis but the text contains more " +
		"than 600 characters in Japanese", function() {
		const paper = new Paper( longTextJapanese );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } );
		expect( assessment.isApplicable( paper, new JapaneseResearcher( paper ) ) ).toBe( true );
	} );
} );

describe( "Language-specific configuration for specific types of content is used", function() {
	const mockPaper = new Paper( "" );
	const mockOptions = { subheadingUrlTitle: "https://yoa.st/34x", subheadingCTAUrl: "https://yoa.st/34y" };
	const englishResearcher = new EnglishResearcher( mockPaper );
	const shortCornerstoneText = "a ".repeat( 225 );
	const longCornerstoneText = "a ".repeat( 275 );
	const japaneseResearcher = new JapaneseResearcher( mockPaper );
	// const shortCornerstoneTextJapanese = "熱".repeat( 450 );  // Variable is used in language specific test (and thus removed)
	// const longCornerstoneTextJapanese = "熱".repeat( 550 );   // Variable is used in language specific test (and thus removed)

	it( "should use a language-specific default configuration", function() {
		const assessment = new SubheadingDistributionTooLong();
		assessment.getLanguageSpecificConfig( japaneseResearcher );
		expect( assessment._config.recommendedMaximumLength ).toEqual( japaneseConfig.defaultParameters.recommendedMaximumLength );
		expect( assessment._config.slightlyTooMany ).toEqual( japaneseConfig.defaultParameters.slightlyTooMany );
		expect( assessment._config.farTooMany ).toEqual( japaneseConfig.defaultParameters.farTooMany );
	} );

	let cornerStoneContentAssessor = new CornerstoneContentAssessor( englishResearcher );
	let productCornerstoneContentAssessor = new ProductCornerstoneContentAssessor( englishResearcher, mockOptions );

	[ cornerStoneContentAssessor, productCornerstoneContentAssessor ].forEach( assessor => {
		it( "should use the default cornerstone configuration", function() {
			const assessment = assessor.getAssessment( "subheadingsTooLong" );
			assessment.getLanguageSpecificConfig( englishResearcher );
			expect( assessment._config.parameters.recommendedMaximumLength ).toEqual( 250 );
			expect( assessment._config.parameters.slightlyTooMany ).toEqual( 250 );
			expect( assessment._config.parameters.farTooMany ).toEqual( 300 );
		} );

		it( "should score short cornerstone content in English (<250 words), " +
			"which does not have subheadings, as OK.", function() {
			const paper = new Paper( shortCornerstoneText );
			const assessment = assessor.getAssessment( "subheadingsTooLong" );
			const results = assessment.getResult( paper, englishResearcher );
			expect( results.getScore() ).toBe( 9 );
			expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
				"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
		} );

		it( "should score slightly too long cornerstone content in English (>250, <300 words), " +
			"which does not have subheadings, as bad.", function() {
			const paper = new Paper( longCornerstoneText );
			const assessment = assessor.getAssessment( "subheadingsTooLong" );
			const results = assessment.getResult( paper, englishResearcher );
			expect( results.getScore() ).toBe( 2 );
			expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
				"You are not using any subheadings, although your text is rather long. " +
				"<a href='https://yoa.st/34y' target='_blank'>Try and add some subheadings</a>." );
		} );
	} );

	cornerStoneContentAssessor = new CornerstoneContentAssessor( japaneseResearcher );
	productCornerstoneContentAssessor = new ProductCornerstoneContentAssessor( japaneseResearcher, mockOptions );

	[ cornerStoneContentAssessor, productCornerstoneContentAssessor ].forEach( assessor => {
		it( "should use a language-specific cornerstone configuration", function() {
			const assessment = assessor.getAssessment( "subheadingsTooLong" );
			assessment.getLanguageSpecificConfig( japaneseResearcher );
			expect( assessment._config.recommendedMaximumLength ).toEqual( japaneseConfig.cornerstoneParameters.recommendedMaximumLength );
			expect( assessment._config.slightlyTooMany ).toEqual( japaneseConfig.cornerstoneParameters.slightlyTooMany );
			expect( assessment._config.farTooMany ).toEqual( japaneseConfig.cornerstoneParameters.farTooMany );
		} );
		// Only need one test for japanese to test getLanguageSpecificConfig. The other tests are redundant.
		// it( "should score short cornerstone content in Japanese (<500 characters), " +
		// "which does not have subheadings, as OK.", function() {
		// 	const paper = new Paper( shortCornerstoneTextJapanese );
		// 	const assessment = assessor.getAssessment( "subheadingsTooLong" );
		// 	const results = assessment.getResult( paper, japaneseResearcher );
		// 	expect( results.getScore() ).toBe( 9 );
		// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
		// 	"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
		// } );
		//
		// it( "should score slightly too long cornerstone content in Japanese (>500, <600 characters), " +
		// "which does not have subheadings, as bad.", function() {
		// 	const paper = new Paper( longCornerstoneTextJapanese );
		// 	const assessment = assessor.getAssessment( "subheadingsTooLong" );
		// 	const results = assessment.getResult( paper, japaneseResearcher );
		// 	expect( results.getScore() ).toBe( 2 );
		// 	expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
		// 	"You are not using any subheadings, although your text is rather long. " +
		// 	"<a href='https://yoa.st/34y' target='_blank'>Try and add some subheadings</a>." );
		// } );
	} );
} );

describe( "A test for scoring too long text fragments without a subheading for languages that use 'characters' " +
	"in the feedback strings instead of 'words'", function() {
	// Japanese uses 'characters' in the feedback strings.
	it( "Scores a text where one section is slightly too long.", function() {
		const paper = new Paper( shortTextJapanese + subheading + longTextJapanese + subheading + shortTextJapanese );
		const assessment = subheadingDistributionTooLong.getResult( paper, new JapaneseResearcher( paper ) );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than 600 characters and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );
	// you need 1 test to test the getLanguageSpecificConfig in the get result method. The rest of the tests is redundant.
	/* it( "Scores a text where multiple sections are slightly too long.", function() {
		const paper = new Paper( shortTextJapanese + subheading + longTextJapanese + subheading + longTextJapanese );
		const assessment = subheadingDistributionTooLong.getResult( paper, new JapaneseResearcher( paper ) );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 600 characters and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a text where one section is too long.", function() {
		const paper = new Paper( shortTextJapanese + subheading + veryLongTextJapanese + subheading + shortTextJapanese );
		const assessment = subheadingDistributionTooLong.getResult( paper, new JapaneseResearcher( paper ) );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than 600 characters and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a text where multiple sections are too long.", function() {
		const paper = new Paper( shortTextJapanese + subheading + veryLongTextJapanese + subheading + veryLongTextJapanese );
		const assessment = subheadingDistributionTooLong.getResult( paper, new JapaneseResearcher( paper ) );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 600 characters and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );*/
} );

describe( "A test for marking too long text segments not separated by a subheading", function() {
	const assessment = new SubheadingDistributionTooLong();
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

