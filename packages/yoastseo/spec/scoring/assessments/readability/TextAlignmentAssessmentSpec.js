import Mark from "../../../../src/values/Mark";
import Paper from "../../../../src/values/Paper.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import HebrewResearcher from "../../../../src/languageProcessing/languages/he/Researcher";
import TextAlignmentAssessment from "../../../../src/scoring/assessments/readability/TextAlignmentAssessment.js";
import getLongCenterAlignedTexts from "../../../../src/languageProcessing/researches/getLongCenterAlignedTexts";

const textAlignmentAssessment = new TextAlignmentAssessment();

describe( "tests assessment results in languages written from left to right (LTR).", function() {
	let researcher;
	beforeEach( () => {
		researcher = new EnglishResearcher();
		researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );
	} );

	it( "returns a bad score when there is a paragraph of center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There is a long section of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making it left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class='has-text-align-center'>This is a paragraph with a bit more than fifty characters.</p>",
				marked: "<yoastmark class='yoast-text-mark'>This is a paragraph with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
		] );
	} );

	it( "returns a bad score when there is a heading of center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<h3 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters.</h3>" );
		researcher.setPaper( mockPaperLTR );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There is a long section of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making it left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<h3 class='has-text-align-center'>This is a heading with a bit more than fifty characters.</h3>",
				marked: "<yoastmark class='yoast-text-mark'>This is a heading with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "heading",
			} ),
		] );
	} );

	it( "returns a bad score when there are multiple paragraphs of center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" +
			"<p class=\"has-text-align-center\">This is another paragraph with a bit more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There are 2 long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making them left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class='has-text-align-center'>This is a paragraph with a bit more than fifty characters.</p>",
				marked: "<yoastmark class='yoast-text-mark'>This is a paragraph with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
			new Mark( {
				original: "<p class='has-text-align-center'>This is another paragraph with a bit more than fifty characters.</p>",
				marked: "<yoastmark class='yoast-text-mark'>This is another paragraph with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
		] );
	} );

	it( "returns a bad score when there are multiple headings of center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<h6 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters.</h6>" +
			"<h5 class=\"has-text-align-center\">This is another heading with a bit more than fifty characters.</h5>" );
		researcher.setPaper( mockPaperLTR );
		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There are 2 long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making them left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<h6 class='has-text-align-center'>This is a heading with a bit more than fifty characters.</h6>",
				marked: "<yoastmark class='yoast-text-mark'>This is a heading with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "heading",
			} ),
			new Mark( {
				original: "<h5 class='has-text-align-center'>This is another heading with a bit more than fifty characters.</h5>",
				marked: "<yoastmark class='yoast-text-mark'>This is another heading with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "heading",
			} ),
		] );
	} );

	it( "returns a bad score when there is both a paragraph and a heading with center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<h2 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters.</h2>" +
			"<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );
		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There are 2 long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making them left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class='has-text-align-center'>This is a paragraph with a bit more than fifty characters.</p>",
				marked: "<yoastmark class='yoast-text-mark'>This is a paragraph with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
			new Mark( {
				original: "<h2 class='has-text-align-center'>This is a heading with a bit more than fifty characters.</h2>",
				marked: "<yoastmark class='yoast-text-mark'>This is a heading with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "heading",
			} ),
		] );
	} );

	it( "returns no score when there are no blocks of center-aligned text", function() {
		const mockPaperLTR = new Paper( "<h2>This is a heading with a bit more than fifty characters.</h2>" +
			"<p>This is a paragraph with a bit more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );
		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );

		expect( assessmentResult.hasScore() ).toBe( false );
	} );

	it( "creates a correct mark if there are multiple spaces between words of a center aligned text", () => {
		const mockPaperLTR = new Paper( "<p class=\"has-text-align-center\">This      is a paragraph with a bit   more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );

		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class='has-text-align-center'>This      is a paragraph with a bit   more than fifty characters.</p>",
				marked: "<yoastmark class='yoast-text-mark'>This      is a paragraph with a bit   more than fifty characters.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
		] );
	} );
} );

describe( "tests the feedback strings of the assessment run for languages written from right to left (RTL).", function() {
	let researcher;
	beforeEach( () => {
		researcher = new HebrewResearcher();
		researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );
	} );

	it( "recommends right-alignment instead of left-alignment for RTL languages when one block of center-aligned text is detected", function() {
		const mockPaperRTL = new Paper( "<p class=\"has-text-align-center\">שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</p>", {
			writingDirection: "RTL",
		} );
		researcher.setPaper( mockPaperRTL );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperRTL, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>:" +
			" There is a long section of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making it right-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperRTL, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class='has-text-align-center'>שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</p>",
				marked: "<yoastmark class='yoast-text-mark'>שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
		] );
	} );

	it( "recommends right-alignment for RTL languages when multiple blocks of center-aligned text are detected", function() {
		const mockPaperRTL = new Paper( "<h2 class=\"has-text-align-center\">שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</h2>" +
			"<p class=\"has-text-align-center\">אתה ערערת את הכח שלנו ועשה את החתולים להיראות חלשים.</p>", {
			writingDirection: "RTL",
		} );
		researcher.setPaper( mockPaperRTL );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperRTL, researcher );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: " +
			"There are 2 long sections of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend making them right-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperRTL, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class='has-text-align-center'>אתה ערערת את הכח שלנו ועשה את החתולים להיראות חלשים.</p>",
				marked: "<yoastmark class='yoast-text-mark'>אתה ערערת את הכח שלנו ועשה את החתולים להיראות חלשים.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
			new Mark( {
				original: "<h2 class='has-text-align-center'>שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</h2>",
				marked: "<yoastmark class='yoast-text-mark'>שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</yoastmark>",
				fieldsToMark: "heading",
			} ),
		] );
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
