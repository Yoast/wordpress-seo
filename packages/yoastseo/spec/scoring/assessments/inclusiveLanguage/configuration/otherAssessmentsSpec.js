import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/otherAssessments";
import Factory from "../../../../specHelpers/factory";
import Mark from "../../../../../src/values/Mark";
import { testMultipleForms } from "../testHelpers/testHelpers";

describe( "Other assessments", function() {
	it( "should target potentially non-inclusive phrases",
		function() {
			const mockText = "This ad is aimed at homosexuals";
			const mockPaper = new Paper( mockText );
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
		const mockText = "This ad is aimed at minorities.";
		const mockPaper = new Paper( mockText );
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

describe( "a test for targeting non-inclusive phrases in other assessments", () => {
	// Skipped for now. It's a bug another issue will solve.
	xit( "should return the appropriate score and feedback string for: 'ex-con' and its plural form", () => {
		const identifiers = [ "ex-con", "ex-cons" ];
		const texts = [
			"An ex-con",
			"Many ex-cons",
		];
		const feedbacks = [
			"Avoid using <i>ex-con</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>person who has had felony convictions, person who has been incarcerated</i>." +
			" <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
			"Avoid using <i>ex-cons</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>people who have had felony convictions, people who have been incarcerated</i>." +
			" <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
	it( "should return the appropriate score and feedback string for: 'felon' and its plural form", () => {
		const identifiers = [ "felon", "felons" ];
		const texts = [
			"That person is a felon",
			"Those group of people are all felons",
		];
		const feedbacks = [
			"Be careful when using <i>felon</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>person with felony convictions, person who have been incarcerated</i>. " +
			"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
			"Be careful when using <i>felons</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>people with felony convictions, people who have been incarcerated</i>. " +
			"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
	} );
	// Skipped for now. It's a bug another issue will solve.
	xit( "should return the appropriate score and feedback string for: 'ex-offender' and its plural form", () => {
		const identifiers = [ "ex-offender", "ex-offenders" ];
		const texts = [
			"That person is an ex-offender",
			"Those group of people are all ex-offenders",
		];
		const feedbacks = [
			"Avoid using <i>ex-offender</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>formerly incarcerated person</i>." +
			" <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
			"Avoid using <i>ex-offenders</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>formerly incarcerated people</i>." +
			" <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
} );
