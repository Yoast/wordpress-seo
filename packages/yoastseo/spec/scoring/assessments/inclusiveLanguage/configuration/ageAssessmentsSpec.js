import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import ageAssessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/ageAssessments";
import Factory from "../../../../../src/helpers/factory.js";
import { testInclusiveLanguageAssessments } from "../testHelpers/testHelper";

describe( "A test for Age assessments", function() {
	it( "should target non-inclusive phrase 'aging dependants'", function() {
		const testData = [
			{
				identifier: "agingDependants",
				text: "This ad is aimed at aging dependants.",
				expectedFeedback: "Be careful when using <i>aging dependants</i> as it is potentially harmful. Consider using an alternative," +
					" such as <i>older people</i>, unless referring to someone who explicitly wants to be referred to with this term." +
					" Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>)." +
					" <a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should target potentially non-inclusive phrase 'senior citizen' and its plural form", function() {
		const testData = [
			{
				identifier: "seniorCitizen",
				text: "A senior citizen gets a discount.",
				expectedFeedback: "Be careful when using <i>senior citizen</i> as it is potentially harmful. Consider using an alternative," +
					" such as <i>older person, older citizen</i>, unless referring to someone who explicitly wants " +
					"to be referred to with this term." +
					" Or, if possible, be specific about the group you are referring to (e.g. <i>person older than 70</i>)." +
					" <a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "seniorCitizens",
				text: "This ad is aimed at senior citizens. But this ad is aimed at the youth.",
				expectedFeedback: "Be careful when using <i>senior citizens</i> as it is potentially harmful. Consider using an alternative," +
					" such as <i>older people, older citizens</i>, unless referring to someone who explicitly " +
					"wants to be referred to with this term." +
					" Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>)." +
					" <a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );

	it( "should target potentially non-inclusive words 'elderly' and 'seniors'", function() {
		const testData = [
			{
				identifier: "elderly",
				text: "There's lack of proper care for the elderly in this country.",
				expectedFeedback: "Be careful when using <i>elderly</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>older people</i>, unless referring to someone who" +
					" explicitly wants to be referred to with this term. Or, if possible, be specific about the group " +
					"you are referring to (e.g. <i>people older than 70</i>). " +
					"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "seniors",
				text: "There's lack of proper care for seniors in this country.",
				expectedFeedback: "Be careful when using <i>seniors</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>older people</i>, unless referring to someone who " +
					"explicitly wants to be referred to with this term. Or, if possible, be specific about the group " +
					"you are referring to (e.g. <i>people older than 70</i>). " +
					"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );

	it( "should target non-inclusive words 'senile' and 'senility'", function() {
		const testData = [
			{
				identifier: "senile",
				text: "Man, he's turned completely senile these last couple of years.",
				expectedFeedback: "Avoid using <i>senile</i> as it is potentially harmful. " +
					"Consider using an alternative, such as a specific characteristic or experience if it is known " +
					"(e.g. <i>has Alzheimer's</i>). " +
					"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "senility",
				text: "Her biggest fear is senility in older age.",
				expectedFeedback: "Avoid using <i>senility</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>dementia</i>. " +
					"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );

	it( "should not target phrases preceded by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at high school seniors." );
		const mockResearcher = Factory.buildMockResearcher( [ "This ad is aimed at high school seniors." ] );
		const assessor = new InclusiveLanguageAssessment( ageAssessments.find( obj => obj.identifier === "seniors" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target phrases followed by by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at seniors who are graduating." );
		const mockResearcher = Factory.buildMockResearcher( [ "This ad is aimed at seniors who are graduating." ] );
		const assessor = new InclusiveLanguageAssessment( ageAssessments.find( obj => obj.identifier === "seniors" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at the youth." );
		const mockResearcher = Factory.buildMockResearcher( [ "This ad is aimed at the youth" ] );
		const assessor = new InclusiveLanguageAssessment( ageAssessments.find( obj => obj.identifier === "seniorCitizens" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "correctly identifies a phrase that is only recognized when followed by participle or simple past tense", () => {
		const mockPaper = new Paper( "The aged worked, the better they are." );
		const mockResearcher = Factory.buildMockResearcher( [ "The aged worked, the better they are." ] );
		const assessor = new InclusiveLanguageAssessment( ageAssessments.find( obj => obj.identifier === "theAged" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the aged</i> as it is potentially harmful. Consider using an alternative, such as <i>older people</i>. " +
			"Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>). " +
			"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The aged worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>The aged worked, the better they are.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies a phrase that is only recognized when followed by a function word", () => {
		const mockPaper = new Paper( "The aged however, did not go to the zoo." );
		const mockResearcher = Factory.buildMockResearcher( [ "The aged however, did not go to the zoo." ] );
		const assessor = new InclusiveLanguageAssessment( ageAssessments.find( obj => obj.identifier === "theAged" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the aged</i> as it is potentially harmful. Consider using an alternative, such as <i>older people</i>. " +
			"Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>). " +
			"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The aged however, did not go to the zoo.",
			marked: "<yoastmark class='yoast-text-mark'>The aged however, did not go to the zoo.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies a phrase that is only recognized when followed by a punctuation mark", () => {
		const mockPaper = new Paper( "I have always loved the aged!" );
		const mockResearcher = Factory.buildMockResearcher( [ "I have always loved the aged!" ] );
		const assessor = new InclusiveLanguageAssessment( ageAssessments.find( obj => obj.identifier === "theAged" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the aged</i> as it is potentially harmful. Consider using an alternative, such as <i>older people</i>. " +
			"Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>). " +
			"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I have always loved the aged!",
			marked: "<yoastmark class='yoast-text-mark'>I have always loved the aged!</yoastmark>",
		} ) ] );
	} );
	it( "does not identify 'the aged' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "The aged cheese is the best." );
		const mockResearcher = Factory.buildMockResearcher( [ "The aged cheese is the best." ] );
		const assessor = new InclusiveLanguageAssessment( ageAssessments.find( obj => obj.identifier === "theAged" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
} );
