import { sprintf, _n } from "@wordpress/i18n";
import Mark from "../../../../src/values/Mark";
import Paper from "../../../../src/values/Paper.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import HebrewResearcher from "../../../../src/languageProcessing/languages/he/Researcher";
import TextAlignmentAssessment from "../../../../src/scoring/assessments/readability/TextAlignmentAssessment.js";
import getLongCenterAlignedTexts from "../../../../src/languageProcessing/researches/getLongCenterAlignedTexts";
import buildTree from "../../../specHelpers/parse/buildTree";

const textAlignmentAssessment = new TextAlignmentAssessment();

describe( "tests assessment results in languages written from left to right (LTR).", function() {
	let researcher;
	beforeEach( () => {
		researcher = new EnglishResearcher( new Paper( "" ) );
		researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );
	} );

	it( "returns a bad score when there is a paragraph of center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );
		buildTree( mockPaperLTR, researcher );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There is a long section of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making it left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				position: {
					clientId: "",
					startOffset: 0, endOffset: 95,
					startOffsetBlock: 0, endOffsetBlock: 95,
				},
			} ),
		] );
	} );

	it( "returns a bad score when there is a heading of center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<h3 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters.</h3>" );
		researcher.setPaper( mockPaperLTR );
		buildTree( mockPaperLTR, researcher );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There is a long section of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making it left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				position: {
					clientId: "",
					startOffset: 0, endOffset: 95,
					startOffsetBlock: 0, endOffsetBlock: 95,
				},
			} ),
		] );
	} );

	it( "returns a bad score when there are multiple paragraphs of center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" +
			"<p class=\"has-text-align-center\">This is another paragraph with a bit more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );
		buildTree( mockPaperLTR, researcher );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There are long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making them left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				position: {
					clientId: "",
					startOffset: 0, endOffset: 95,
					startOffsetBlock: 0, endOffsetBlock: 95,
				},
			} ),
			new Mark( {
				position: {
					clientId: "",
					startOffset: 95, endOffset: 196,
					startOffsetBlock: 0, endOffsetBlock: 101,
				},
			} ),
		] );
	} );

	it( "returns a bad score when there are multiple headings of center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<h6 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters.</h6>" +
			"<h5 class=\"has-text-align-center\">This is another heading with a bit more than fifty characters.</h5>" );
		researcher.setPaper( mockPaperLTR );
		buildTree( mockPaperLTR, researcher );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There are long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making them left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				position: {
					clientId: "",
					startOffset: 0, endOffset: 95,
					startOffsetBlock: 0, endOffsetBlock: 95,
				},
			} ),
			new Mark( {
				position: {
					clientId: "",
					startOffset: 95, endOffset: 196,
					startOffsetBlock: 0, endOffsetBlock: 101,
				},
			} ),
		] );
	} );

	it( "returns a bad score when there is both a paragraph and a heading with center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<h2 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters.</h2>" +
			"<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );
		buildTree( mockPaperLTR, researcher );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There are long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making them left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				position: {
					clientId: "",
					startOffset: 95, endOffset: 190,
					startOffsetBlock: 0, endOffsetBlock: 95,
				},
			} ),
			new Mark( {
				position: {
					clientId: "",
					startOffset: 0, endOffset: 95,
					startOffsetBlock: 0, endOffsetBlock: 95,
				},
			} ),
		] );
	} );

	it( "returns no score when there are no blocks of center-aligned text", function() {
		const mockPaperLTR = new Paper( "<h2>This is a heading with a bit more than fifty characters.</h2>" +
			"<p>This is a paragraph with a bit more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );
		buildTree( mockPaperLTR, researcher );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );
		expect( assessmentResult.hasScore() ).toBe( false );
	} );

	it( "creates a correct mark if there are multiple spaces between words of a center aligned text", () => {
		const mockPaperLTR = new Paper( "<p class=\"has-text-align-center\">This      is a paragraph with a bit   more than fifty characters.</p>" );
		buildTree( mockPaperLTR, researcher );
		researcher.setPaper( mockPaperLTR );

		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				position: {
					clientId: "",
					startOffset: 0, endOffset: 102,
					startOffsetBlock: 0, endOffsetBlock: 102,
				},
			} ),
		] );
	} );
} );

describe( "tests the feedback strings of the assessment run for languages written from right to left (RTL).", function() {
	let researcher;
	beforeEach( () => {
		researcher = new HebrewResearcher( new Paper( "" ) );
		researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );
	} );

	it( "recommends right-alignment instead of left-alignment for RTL languages when one block of center-aligned text is detected", function() {
		const mockPaperRTL = new Paper( "<p class=\"has-text-align-center\">שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</p>", {
			writingDirection: "RTL",
		} );
		researcher.setPaper( mockPaperRTL );
		buildTree( mockPaperRTL, researcher );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperRTL, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There is a long section of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making it right-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperRTL, researcher ) ).toEqual( [
			new Mark( {
				position: {
					clientId: "",
					startOffset: 0, endOffset: 88,
					startOffsetBlock: 0, endOffsetBlock: 88,
				},
			} ),
		] );
	} );

	it( "recommends right-alignment for RTL languages when multiple blocks of center-aligned text are detected", function() {
		const mockPaperRTL = new Paper( "<h2 class=\"has-text-align-center\">שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</h2>" +
			"<p class=\"has-text-align-center\">אתה ערערת את הכח שלנו ועשה את החתולים להיראות חלשים.</p>", {
			writingDirection: "RTL",
		} );
		researcher.setPaper( mockPaperRTL );
		buildTree( mockPaperRTL, researcher );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperRTL, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: " +
			"There are long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making them right-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperRTL, researcher ) ).toEqual( [
			new Mark( {
				position: {
					clientId: "",
					startOffset: 90, endOffset: 179,
					startOffsetBlock: 0, endOffsetBlock: 89,
				},
			} ),
			new Mark( {
				position: {
					clientId: "",
					startOffset: 0, endOffset: 90,
					startOffsetBlock: 0, endOffsetBlock: 90,
				},
			} ),
		] );
	} );
} );

describe( "tests for retrieving the feedback strings.", function() {
	it( "returns the default strings when no custom `getResultTexts` callback is provided.", function() {
		const assessment = new TextAlignmentAssessment();
		expect( assessment.getFeedbackStrings() ).toEqual( {
			leftToRight: "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: There are long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>We recommend making them left-aligned</a>.",
			rightToLeft: "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: There are long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>We recommend making them right-aligned</a>.",
		} );
	} );
	it( "returns the default strings when no custom `getResultTexts` callback is provided: there is one long section of center-aligned text", function() {
		const assessment = new TextAlignmentAssessment();
		const mockPaperLTR = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" );
		const mockResearcher = new EnglishResearcher( mockPaperLTR );
		mockResearcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );
		buildTree( mockPaperLTR, mockResearcher );

		assessment.getResult( mockPaperLTR, mockResearcher );
		expect( assessment.getFeedbackStrings() ).toEqual( {
			leftToRight: "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: There is a long section of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>We recommend making it left-aligned</a>.",
			rightToLeft: "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: There is a long section of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>We recommend making it right-aligned</a>.",
		} );
	} );
	it( "overrides the default strings when a custom `getResultTexts` callback is provided", function() {
		/**
		 * Returns the result texts for the Text alignment assessment.
		 * @param {Object} config The configuration object that contains data needed to generate the result text.
		 * @param {string} config.urlTitleAnchorOpeningTag The anchor opening tag to the article about this assessment.
		 * @param {string} config.urlActionAnchorOpeningTag The anchor opening tag to the call to action URL to the help article of this assessment.
		 * @param {number} config.numberOfLongCenterAlignedTexts The number of long center-aligned texts found in the text.
		 *
		 * @returns {{rightToLeft: string, leftToRight: string}} The object that contains the result texts as a translation string.
		 */
		const getResultTexts = ( { urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag, numberOfLongCenterAlignedTexts } ) => {
			return {
				rightToLeft: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
					%4$s expands to the number of the long center-aligned sections in the text */
					_n(
						"%1$sAlignment%3$s: There is a long section of center-aligned text. %2$sWe recommend making it right-aligned%3$s.",
						"%1$sAlignment%3$s: There are %4$s long sections of center-aligned text. %2$sWe recommend making them right-aligned%3$s.",
						numberOfLongCenterAlignedTexts,
						"wordpress-seo-premium"
					),
					urlTitleAnchorOpeningTag,
					urlActionAnchorOpeningTag,
					"</a>",
					numberOfLongCenterAlignedTexts
				),
				leftToRight: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
						%4$s expands to the number of the long center-aligned sections in the text */
					_n(
						"%1$sAlignment%3$s: There is a long section of center-aligned text. %2$sWe recommend making it left-aligned%3$s.",
						"%1$sAlignment%3$s: There are %4$s long sections of center-aligned text. %2$sWe recommend making them left-aligned%3$s.",
						numberOfLongCenterAlignedTexts,
						"wordpress-seo-premium"
					),
					urlTitleAnchorOpeningTag,
					urlActionAnchorOpeningTag,
					"</a>",
					numberOfLongCenterAlignedTexts
				),
			};
		};
		const assessment = new TextAlignmentAssessment( { callbacks: { getResultTexts } } );
		const mockPaperLTR = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" +
			"<p class=\"has-text-align-center\">This is another paragraph with a bit more than fifty characters.</p>" );
		const mockResearcher = new EnglishResearcher( mockPaperLTR );
		mockResearcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );
		buildTree( mockPaperLTR, mockResearcher );

		assessment.getResult( mockPaperLTR, mockResearcher );
		expect( assessment.getFeedbackStrings() ).toEqual( {
			leftToRight: "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: There are 2 long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>We recommend making them left-aligned</a>.",
			rightToLeft: "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: There are 2 long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>We recommend making them right-aligned</a>.",
		} );
	} );
} );

describe( "tests for the assessment's applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paperWithNoText = new Paper( "" );
		const researcher = new EnglishResearcher( paperWithNoText );
		researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );
		expect( textAlignmentAssessment.isApplicable( paperWithNoText, researcher ) ).toBe( false );
	} );

	it( "returns false when the researcher doesn't have the research.", function() {
		const mockPaper = new Paper( "<p class='has-text-align-center'>This is a paragraph with a bit more than fifty characters.</p>" );
		const researcher = new EnglishResearcher( mockPaper );
		expect( textAlignmentAssessment.isApplicable( mockPaper, researcher ) ).toBe( false );
	} );

	it( "returns true when the paper has more than 50 characters and the researcher has the research.", function() {
		const mockPaper = new Paper( "<p class='has-text-align-center'>This is a paragraph with a bit more than fifty characters.</p>" );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );
		expect( textAlignmentAssessment.isApplicable( mockPaper, researcher ) ).toBe( true );
	} );
} );
