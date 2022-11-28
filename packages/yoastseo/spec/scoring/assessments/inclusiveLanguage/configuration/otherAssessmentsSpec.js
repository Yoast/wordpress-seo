import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/otherAssessments";
import Factory from "../../../../specHelpers/factory";
import Mark from "../../../../../src/values/Mark";

describe( "Other assessments", function() {
	it( "should target potentially non-inclusive phrases",
		function() {
			const mockPaper = new Paper( "This ad is aimed at homosexuals" );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "homosexuals" ) );

			const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
			const assessmentResult = assessor.getResult();

			expect( isApplicable ).toBeTruthy();
			expect( assessmentResult.getScore() ).toEqual( 6 );
			expect( assessmentResult.getText() ).toEqual(
				"Be careful when using <i>homosexuals</i> as it may overgeneralize or be harmful. " +
				"Instead, be specific about the group you are referring to (e.g. <i>gay men, queer people, lesbians</i>). " +
				"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
			expect( assessmentResult.hasMarks() ).toBeTruthy();
			expect( assessor.getMarks() ).toEqual( [
				{ _properties: {
					marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at homosexuals</yoastmark>",
					original: "This ad is aimed at homosexuals",
					fieldsToMark: [],
				} } ] );
		} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at minorities." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "minorities" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>minorities</i> as it is potentially overgeneralizing. " +
			"Consider using an alternative, such as <i>marginalized groups</i>, <i>underrepresented groups</i> or specific minorities, " +
			"such as <i>gender and sexuality minorities</i>. <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(  [
			{ _properties:
					{
						marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at minorities.</yoastmark>",
						original: "This ad is aimed at minorities.",
						fieldsToMark: [],
					} } ] );
	} );

	it( "should not target phrases preceded by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at high school seniors." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "ex-con" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "correctly identifies 'the minority' which is only recognized when followed by participle or simple past tense", () => {
		const mockPaper = new Paper( "The minority worked, the better they are." );
		const mockResearcher = Factory.buildMockResearcher( [ "The minority worked, the better they are." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theMinority" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>the minority</i> as it is potentially overgeneralizing. Consider using an alternative, " +
			"such as <i>marginalized groups</i>, <i>underrepresented groups</i> or specific minorities, " +
			"such as <i>gender and sexuality minorities</i>. <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The minority worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>The minority worked, the better they are.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the minority', which is only recognized when followed by a function word", () => {
		const mockPaper = new Paper( "The minority however, did not go to the zoo." );
		const mockResearcher = Factory.buildMockResearcher( [ "The minority however, did not go to the zoo." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theMinority" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>the minority</i> as it is potentially overgeneralizing. Consider using an alternative, " +
			"such as <i>marginalized groups</i>, <i>underrepresented groups</i> or specific minorities, " +
			"such as <i>gender and sexuality minorities</i>. <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The minority however, did not go to the zoo.",
			marked: "<yoastmark class='yoast-text-mark'>The minority however, did not go to the zoo.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the minority', which is only recognized when followed by a punctuation mark", () => {
		const mockPaper = new Paper( "I have always loved the minority!" );
		const mockResearcher = Factory.buildMockResearcher( [ "I have always loved the minority!" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theMinority" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>the minority</i> as it is potentially overgeneralizing. Consider using an alternative, " +
			"such as <i>marginalized groups</i>, <i>underrepresented groups</i> or specific minorities, " +
			"such as <i>gender and sexuality minorities</i>. <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I have always loved the minority!",
			marked: "<yoastmark class='yoast-text-mark'>I have always loved the minority!</yoastmark>",
		} ) ] );
	} );
	it( "does not identify 'the minority' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "The minority person walks on the street." );
		const mockResearcher = Factory.buildMockResearcher( [ "The minority person walks on the street." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theMinority" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
} );
