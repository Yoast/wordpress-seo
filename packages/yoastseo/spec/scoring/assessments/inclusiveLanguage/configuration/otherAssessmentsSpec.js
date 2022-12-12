import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/otherAssessments";
import Factory from "../../../../specHelpers/factory.js";
import Mark from "../../../../../src/values/Mark";
import { testMultipleForms } from "../testHelpers/testHelpers";

describe( "A test for Other assessments", function() {
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
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: mockText,
			marked: "<yoastmark class='yoast-text-mark'>" + mockText + "</yoastmark>",
		} ) ] );
	} );

	it( "correctly identifies 'normal' which is only recognized in specific phrases", () => {
		const mockPaper = new Paper( "They are normal people." );
		const mockResearcher = Factory.buildMockResearcher( [ "They are normal people." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "normal" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>normal</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>typical</i> or a specific characteristic or experience if it is" +
			" known. <a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "They are normal people.",
			marked: "<yoastmark class='yoast-text-mark'>They are normal people.</yoastmark>",
		} ) ] );
	} );
} );

describe( "a test for targeting non-inclusive phrases in other assessments", () => {
	// Skipped for now. It's a bug another issue will solve: https://yoast.atlassian.net/browse/PC-1021.
	// This unit test should be un-skipped when the aforementioned issue is merged.
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
	// Skipped for now. It's a bug another issue will solve: https://yoast.atlassian.net/browse/PC-1021.
	// This unit test should be un-skipped when the aforementioned issue is merged.
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
