import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/sesAssessments";
import Factory from "../../../../specHelpers/factory";
import Mark from "../../../../../src/values/Mark";

describe( "SES assessments", function() {
	it( "should target non-inclusive phrases",
		function() {
			const mockText = "This ad is aimed at illegal immigrants";
			const mockPaper = new Paper( mockText );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "illegalImmigrants" ) );

			const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
			const assessmentResult = assessor.getResult();

			expect( isApplicable ).toBeTruthy();
			expect( assessmentResult.getScore() ).toEqual( 3 );
			expect( assessmentResult.getText() ).toEqual(
				"Avoid using <i>illegal immigrants</i> as it is potentially harmful. " +
				"Consider using an alternative, such as <i>undocumented people</i>. " +
				"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
			expect( assessmentResult.hasMarks() ).toBeTruthy();
			expect( assessor.getMarks() ).toEqual( [
				{ _properties:
						{ marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at illegal immigrants</yoastmark>",
							original: "This ad is aimed at illegal immigrants",
							fieldsToMark: [],
						} } ] );
		} );

	it( "should target non-inclusive phrases", function() {
		const mockText = "This ad is aimed at poverty stricken people";
		const mockPaper = new Paper( mockText );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "povertyStricken" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>poverty stricken</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>people whose income is below the poverty threshold, people with low-income</i>. " +
			"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(  [
			{ _properties:
					{ marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at poverty stricken.</yoastmark>",
						original: "This ad is aimed at poverty stricken.",
						fieldsToMark: [],
					} } ] );
	} );

	it( "should not target phrases preceded by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at high school seniors." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "welfareReliant" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "correctly identifies 'the poor' which is only recognized when followed by participle or simple past tense", () => {
		const mockPaper = new Paper( "The poor worked, the better they are." );
		const mockResearcher = Factory.buildMockResearcher( [ "The poor worked, the better they are." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "thePoor" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the poor</i> as it is potentially overgeneralizing. " +
			"Consider using <i>people whose income is below the poverty threshold</i> or <i>people with low-income</i> instead. " +
			"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The poor worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>The poor worked, the better they are.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the poor', which is only recognized when followed by a function word", () => {
		const mockPaper = new Paper( "The poor however, did not go to the zoo." );
		const mockResearcher = Factory.buildMockResearcher( [ "The poor however, did not go to the zoo." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "thePoor" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the poor</i> as it is potentially overgeneralizing. " +
			"Consider using <i>people whose income is below the poverty threshold</i> or <i>people with low-income</i> instead. " +
			"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The poor however, did not go to the zoo.",
			marked: "<yoastmark class='yoast-text-mark'>The poor however, did not go to the zoo.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the poor', which is only recognized when followed by a punctuation mark", () => {
		const mockPaper = new Paper( "I have always loved the poor!" );
		const mockResearcher = Factory.buildMockResearcher( [ "I have always loved the poor!" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "thePoor" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the poor</i> as it is potentially overgeneralizing. " +
			"Consider using <i>people whose income is below the poverty threshold</i> or <i>people with low-income</i> instead. " +
			"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I have always loved the poor!",
			marked: "<yoastmark class='yoast-text-mark'>I have always loved the poor!</yoastmark>",
		} ) ] );
	} );
	it( "does not identify 'the poor' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "The poor person walks on the street." );
		const mockResearcher = Factory.buildMockResearcher( [ "The poor person walks on the street." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "thePoor" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
} );
