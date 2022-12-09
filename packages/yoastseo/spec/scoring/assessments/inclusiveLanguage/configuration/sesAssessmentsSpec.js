import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/sesAssessments";
import Factory from "../../../../specHelpers/factory";
import { testMultipleForms } from "../testHelpers/testHelpers";

describe( "SES assessments", function() {
	it( "should target non-inclusive phrases: 'illegal immigrant' and its plural form", function() {
		const identifiers = [ "illegalImmigrant", "illegalImmigrants" ];
		const texts = [
			"The police detained an illegal immigrant",
			"This ad is aimed at illegal immigrants",
		];
		const feedbacks = [
			"Avoid using <i>illegal immigrant</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>undocumented person, person without papers, immigrant without papers</i>. " +
			"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
			"Avoid using <i>illegal immigrants</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>undocumented people, people without papers, immigrants without papers</i>. " +
			"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );

	it( "should target non-inclusive phrases: 'prostitute' and its plural form", function() {
		const identifiers = [ "prostitute", "prostitutes" ];
		const texts = [
			"Prostitute is derived from the Latin prostituta.",
			"The majority of prostitutes are female and have male clients.",
		];
		const feedbacks = [
			"Be careful when using <i>prostitute</i> as it is potentially harmful. Consider using an alternative, such as <i>sex worker</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
			"Be careful when using <i>prostitutes</i> as it is potentially harmful. Consider using an alternative, such as <i>sex workers</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
	} );

	it( "should target non-inclusive phrases", function() {
		const mockText = "This ad is aimed at poverty stricken people.";
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
					{ marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at poverty stricken people.</yoastmark>",
						original: "This ad is aimed at poverty stricken people.",
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
