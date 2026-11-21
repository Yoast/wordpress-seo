import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/sesAssessments";
import Factory from "../../../../../src/helpers/factory";
import { testInclusiveLanguageAssessments } from "../testHelpers/testHelper";

describe( "A test for SES assessments", function() {
	it( "correctly identifies 'the poor' which is only recognized when followed by participle or simple past tense", () => {
		const mockPaper = new Paper( "The poor worked, the better they are." );
		const mockResearcher = Factory.buildMockResearcher( [ "The poor worked, the better they are." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "thePoor" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual( "Avoid using <i>the poor</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>people whose income is below the poverty threshold, people with low-income</i>." +
			" <a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The poor worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>The poor worked, the better they are.</yoastmark>",
		} ) ] );
	} );

	it( "correctly identifies 'the poor', which is only recognized when followed by a function word", () => {
		const mockPaper = new Paper( "The poor however did not go to the zoo." );
		const mockResearcher = Factory.buildMockResearcher( [ "The poor however, did not go to the zoo." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "thePoor" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual( "Avoid using <i>the poor</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>people whose income is below the poverty threshold, people with low-income</i>." +
			" <a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
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
		expect( assessmentResult.getText() ).toEqual( "Avoid using <i>the poor</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>people whose income is below the poverty threshold, people with low-income</i>." +
			" <a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>" );
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
	it( "does not identify 'the homeless' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "The homeless people of LA often have to sleep on the street." );
		const mockResearcher = Factory.buildMockResearcher( [ "The homeless people of LA often have to sleep on the street." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theHomeless" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
	it( "does not identify 'the undocumented' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "As expected, the undocumented applicants were disregarded." );
		const mockResearcher = Factory.buildMockResearcher( [ "As expected, the undocumented applicants were disregarded." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theUndocumented" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
} );

describe( "a test for targeting non-inclusive phrases in other assessments", () => {
	it( "should target non-inclusive phrases 'illegal immigrant', ''illegal alien' and their plural forms", function() {
		const testData = [
			{
				identifier: "illegalImmigrant",
				text: "The police detained an illegal immigrant.",
				expectedFeedback: "Avoid using <i>illegal immigrant</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>undocumented person, person without papers, immigrant without papers</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "illegalImmigrants",
				text: "This ad is aimed at illegal immigrants.",
				expectedFeedback: "Avoid using <i>illegal immigrants</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>undocumented people, people without papers, immigrants without papers</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "illegalImmigrant",
				text: "The police detained an illegal alien.",
				expectedFeedback: "Avoid using <i>illegal alien</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>undocumented person, person without papers, immigrant without papers</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "illegalImmigrants",
				text: "This ad is aimed at illegal aliens.",
				expectedFeedback: "Avoid using <i>illegal aliens</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>undocumented people, people without papers, immigrants without papers</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should target non-inclusive phrases: 'prostitute' and its plural form", function() {
		const testData = [
			{
				identifier: "prostitute",
				text: "Prostitute is derived from the Latin prostituta.",
				expectedFeedback: "Be careful when using <i>prostitute</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>sex worker</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "prostitutes",
				text: "The majority of prostitutes are female and have male clients.",
				expectedFeedback: "Be careful when using <i>prostitutes</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>sex workers</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'ex-con' and its plural form", () => {
		const testData = [
			{
				identifier: "ex-con",
				text: "An ex-con",
				expectedFeedback: "Avoid using <i>ex-con</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>person who has had felony convictions, person who has been incarcerated</i>." +
					" <a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "ex-cons",
				text: "Many ex-cons",
				expectedFeedback: "Avoid using <i>ex-cons</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>people who have had felony convictions, people who have been incarcerated</i>." +
					" <a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'felon' and its plural form", () => {
		const testData = [
			{
				identifier: "felon",
				text: "That person is a felon",
				expectedFeedback: "Avoid using <i>felon</i> as it is potentially harmful. Consider using an alternative," +
					" such as <i>person with felony convictions, person who has been incarcerated</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "felons",
				text: "Those group of people are all felons",
				expectedFeedback: "Avoid using <i>felons</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>people with felony convictions, people who have been incarcerated</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'ex-offender' and its plural form", () => {
		const testData = [
			{
				identifier: "ex-offender",
				text: "That person is an ex-offender",
				expectedFeedback: "Avoid using <i>ex-offender</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>formerly incarcerated person</i>." +
					" <a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "ex-offenders",
				text: "Those group of people are all ex-offenders",
				expectedFeedback: "Avoid using <i>ex-offenders</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>formerly incarcerated people</i>." +
					" <a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets potentially harmful phrases 'poverty stricken' and 'welfare reliant", () => {
		const testData = [
			{
				identifier: "povertyStricken",
				text: "This ad is aimed at poverty stricken people.",
				expectedFeedback: "Avoid using <i>poverty stricken</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>people whose income is below the poverty threshold, people with low-income</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "welfareReliant",
				text: "These people are pushed to be welfare reliant.",
				expectedFeedback: "Avoid using <i>welfare reliant</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>receiving welfare</i>." +
					" <a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets phrases 'the homeless' and 'the undocumented' in several conditions explained in the text", () => {
		const testData = [
			{
				identifier: "theHomeless",
				text: "This ad is aimed at the homeless in LA. The target word is followed by a preposition.",
				expectedFeedback: "Avoid using <i>the homeless</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>people experiencing homelessness</i>. <a href='https://yoa.st/inclusive-language-ses'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "theUndocumented",
				text: "This targets the undocumented across the US. The target word is followed by a preposition.",
				expectedFeedback: "Avoid using <i>the undocumented</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>people who are undocumented, undocumented people, people without papers</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "theHomeless",
				text: "This ad is aimed at the homeless. The target word is followed by a punctuation mark.",
				expectedFeedback: "Avoid using <i>the homeless</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>people experiencing homelessness</i>. <a href='https://yoa.st/inclusive-language-ses'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "theUndocumented",
				text: "This will be a major blow to the undocumented. The target word is followed by a punctuation mark.",
				expectedFeedback: "Avoid using <i>the undocumented</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>people who are undocumented, undocumented people, people without papers</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "theHomeless",
				text: "The homeless faced staggering discrimination. The target word is followed by a past participle.",
				expectedFeedback: "Avoid using <i>the homeless</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>people experiencing homelessness</i>. <a href='https://yoa.st/inclusive-language-ses'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "theUndocumented",
				text: "The undocumented didn't receive a fair trial. The target word is followed by a past participle.",
				expectedFeedback: "Avoid using <i>the undocumented</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>people who are undocumented, undocumented people, people without papers</i>. " +
					"<a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );

	it( "gives the correct feedback for 'the undocumented'", () => {
		const mockPaper = new Paper( "This sentence contains the undocumented." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains the undocumented." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theUndocumented" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual( "Avoid using <i>the undocumented</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>people who are undocumented, undocumented people, people without papers</i>." +
			" <a href='https://yoa.st/inclusive-language-ses' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains the undocumented.</yoastmark>",
			original: "This sentence contains the undocumented." } } ]
		);
	} );
} );
