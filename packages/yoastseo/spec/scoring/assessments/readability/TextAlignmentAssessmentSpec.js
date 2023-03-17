import Mark from "../../../../src/values/Mark";
import Paper from "../../../../src/values/Paper.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import HebrewResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import TextAlignmentAssessment from "../../../../src/scoring/assessments/readability/TextAlignmentAssessment.js";
import getLongBlocksOfCenterAlignedText from "../../../../src/languageProcessing/researches/getLongCenterAlignedText";

const textAlignmentAssessment = new TextAlignmentAssessment();

describe( "tests assessment results in LTR languages.", function() {
	let researcher;
	beforeEach( () => {
		researcher = new EnglishResearcher();
		researcher.addResearch( "getLongCenterAlignedText", getLongBlocksOfCenterAlignedText );
	} );

	it( "returns a bad score when there is a paragraph of center-aligned text in an LTR language", function() {
		const mockPaperLTR = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" );
		researcher.setPaper( mockPaperLTR );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperLTR, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: " +
			"Your text has a long block of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend changing that to left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>",
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
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: " +
			"Your text has a long block of center-aligned text." +
			" <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>We recommend changing that to left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<h3 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters.</h3>",
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
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: " +
			"Your text contains multiple long blocks of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend changing that to left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>",
				marked: "<yoastmark class='yoast-text-mark'>This is a paragraph with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
			new Mark( {
				original: "<p class=\"has-text-align-center\">This is another paragraph with a bit more than fifty characters.</p>",
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
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: " +
			"Your text contains multiple long blocks of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend changing that to left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<h6 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters.</h6>",
				marked: "<yoastmark class='yoast-text-mark'>This is a heading with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "heading",
			} ),
			new Mark( {
				original: "<h5 class=\"has-text-align-center\">This is another heading with a bit more than fifty characters.</h5>",
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
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: " +
			"Your text contains multiple long blocks of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend changing that to left-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperLTR, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>",
				marked: "<yoastmark class='yoast-text-mark'>This is a paragraph with a bit more than fifty characters.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
			new Mark( {
				original: "<h2 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters.</h2>",
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
} );

describe( "tests the feedback strings of an RTL language.", function() {
	let researcher;
	beforeEach( () => {
		researcher = new HebrewResearcher();
		researcher.addResearch( "getLongCenterAlignedText", getLongBlocksOfCenterAlignedText );
	} );

	it( "recommends right-alignment instead of left-alignment for RTL languages when one block of center-aligned text is detected", function() {
		const mockPaperRTL = new Paper( "<p class=\"has-text-align-center\">שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</p>", {
			isRTL: true,
		} );
		researcher.setPaper( mockPaperRTL );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperRTL, researcher );
		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: Your text has " +
			"a long block of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' target='_blank'>" +
			"We recommend changing that to right-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperRTL, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class=\"has-text-align-center\">שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</p>",
				marked: "<yoastmark class='yoast-text-mark'>שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
		] );
	} );

	it( "recommends right-alignment for RTL languages when multiple blocks of center-aligned text are detected", function() {
		const mockPaperRTL = new Paper( "<h2 class=\"has-text-align-center\">שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</h2>" +
			"<p class=\"has-text-align-center\">אתה ערערת את הכח שלנו ועשה את החתולים להיראות חלשים.</p>", {
			isRTL: true,
		} );
		researcher.setPaper( mockPaperRTL );

		const assessmentResult = textAlignmentAssessment.getResult( mockPaperRTL, researcher );

		expect( assessmentResult.getScore() ).toBe( 2 );
		expect( assessmentResult.getText() ).toBe( "<a href='https://yoa.st/assessment-alignment' target='_blank'>Alignment</a>: " +
			"Your text contains multiple long blocks of center-aligned text. <a href='https://yoa.st/assessment-alignment-cta' " +
			"target='_blank'>We recommend changing that to right-aligned</a>." );
		expect( assessmentResult.hasMarks() ).toBe( true );
		expect( textAlignmentAssessment.getMarks( mockPaperRTL, researcher ) ).toEqual( [
			new Mark( {
				original: "<p class=\"has-text-align-center\">אתה ערערת את הכח שלנו ועשה את החתולים להיראות חלשים.</p>",
				marked: "<yoastmark class='yoast-text-mark'>אתה ערערת את הכח שלנו ועשה את החתולים להיראות חלשים.</yoastmark>",
				fieldsToMark: "paragraph",
			} ),
			new Mark( {
				original: "<h2 class=\"has-text-align-center\">שמענו סיפורים רבים על כלבים שהצילו חיים של בני אדם.</h2>",
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
		researcher.addResearch( "getLongCenterAlignedText", getLongBlocksOfCenterAlignedText );
		expect( textAlignmentAssessment.isApplicable( paperWithNoText, researcher ) ).toBe( false );
	} );

	it( "returns false when the researcher doesn't have the research.", function() {
		const mockPaper = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" );
		const researcher = new EnglishResearcher( mockPaper );
		expect( textAlignmentAssessment.isApplicable( mockPaper, researcher ) ).toBe( false );
	} );

	it( "returns true when the paper has more than 50 characters and the researcher has the research.", function() {
		const mockPaper = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearch( "getLongCenterAlignedText", getLongBlocksOfCenterAlignedText );
		expect( textAlignmentAssessment.isApplicable( mockPaper, researcher ) ).toBe( true );
	} );
} );
