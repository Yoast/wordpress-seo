import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/otherAssessments";
import Factory from "../../../../../src/helpers/factory";
import Mark from "../../../../../src/values/Mark";
import { testInclusiveLanguageAssessments } from "../testHelpers/testHelper";

describe( "Checks various conditions for the 'normal' and 'abnormal' assessments", () => {
	it( "targets potentially harmful phrases that include the word 'normal'", () => {
		const testData = [
			{
				identifier: "normalPerson",
				text: "He is a normal person.",
				expectedFeedback: "Avoid using <i>normal person</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>typical person, average person</i> or describing the" +
					" person's specific trait, experience, or behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "normalPeople",
				text: "They are normal people right.",
				expectedFeedback: "Avoid using <i>normal people</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>typical people, average people</i> or describing" +
					" people's specific trait, experience, or behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "mentallyNormal",
				text: "He is a mentally normal person.",
				expectedFeedback: "Avoid using <i>mentally normal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>people without mental health conditions</i>," +
					" <i>mentally healthy people</i>. If possible, be more specific." +
					" For example: <i>people who don’t have anxiety disorders</i>, <i>people who haven't experienced trauma</i>, etc." +
					" Be careful when using mental health descriptors and try to avoid making assumptions about someone's mental health. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "behaviorallyNormal",
				text: "I'm afraid this isn't behaviorally normal.",
				expectedFeedback: "Be careful when using <i>behaviorally normal</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, such as <i>showing typical behavior</i> " +
					"or describing the specific behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "behaviorallyNormal",
				text: "I'm afraid this isn't behaviourally normal.",
				expectedFeedback: "Be careful when using <i>behaviourally normal</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, such as <i>showing typical behavior</i> " +
					"or describing the specific behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "abnormalPerson",
				text: "Only an abnormal person could do this.",
				expectedFeedback: "Avoid using <i>abnormal person</i> as it is potentially harmful. Consider using an alternative, " +
					"such as describing the person's specific trait, experience, or behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			}, {
				identifier: "abnormalPeople",
				text: "There are lots of abnormal people in my family.",
				expectedFeedback: "Avoid using <i>abnormal people</i> as it is potentially harmful. Consider using an alternative, " +
					"such as describing people's specific trait, experience, or behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			}, {
				identifier: "mentallyAbnormal",
				text: "This person seems mentally abnormal.",
				expectedFeedback: "Avoid using <i>mentally abnormal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>people with a mental health condition</i>, <i>people with" +
					" mental health problems</i>. If possible, be more specific. For example: <i>people who have anxiety disorders," +
					" people who have experienced trauma</i>, etc. Be careful when using mental health descriptors and" +
					" try to avoid making assumptions about someone's mental health. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets potentially harmful phrases that include the word 'abnormal'", () => {
		const testData = [
			{
				identifier: "behaviorallyAbnormal",
				text: "I'm afraid this is behaviorally abnormal.",
				expectedFeedback: "Be careful when using <i>behaviorally abnormal</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, such as <i>showing atypical behavior," +
					" showing dysfunctional behavior</i> or describing the specific behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "behaviorallyAbnormal",
				text: "I'm afraid this is behaviourally abnormal.",
				expectedFeedback: "Be careful when using <i>behaviourally abnormal</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, such as" +
					" <i>showing atypical behavior, showing dysfunctional behavior</i>" +
					" or describing the specific behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "abnormalBehavior",
				text: "This is definitely abnormal behavior.",
				expectedFeedback: "Be careful when using <i>abnormal behavior</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, such as <i>atypical behavior," +
					" unusual behavior</i> or describing the specific behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "abnormalBehavior",
				text: "This is definitely abnormal behaviour.",
				expectedFeedback: "Be careful when using <i>abnormal behaviour</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, such as <i>atypical behavior," +
					" unusual behavior</i> or describing the specific behavior. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
} );

describe( "Checks highlighting for 'minorities' and conditions in which assessments shouldn't be applicable", () => {
	it( "targets potentially non-inclusive word 'minorities'", function() {
		const mockText = "This ad is aimed at minorities.";
		const mockPaper = new Paper( mockText );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "minorities" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>minorities</i> as it is potentially harmful. Consider using an alternative by being " +
			"specific about which group(s) of people you are referring to. For example: <i>members of the LGBTQ+ community</i>, " +
			"<i>Indigenous peoples</i>, <i>marginalized groups</i>. In case an alternative is not available, make sure to specify the type of " +
			"minorities you are referring to, e.g., <i>religious minorities</i>. " +
			"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: mockText,
			marked: "<yoastmark class='yoast-text-mark'>" + mockText + "</yoastmark>",
		} ) ] );
	} );

	it( "doesn't identify 'normal people' if both words begin with an upper case letter", () => {
		const mockPaper = new Paper( "Normal People is my favorite book." );
		const mockResearcher = Factory.buildMockResearcher( [ "Normal People is my favorite book." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "normalPeople" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "doesn't show the feedback for 'normal people' if it's preceded by 'mentally'", () => {
		const mockPaper = new Paper( "We are mentally normal people." );
		const mockResearcher = Factory.buildMockResearcher( [ "We are mentally normal people." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "normalPeople" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "doesn't show the feedback for 'normal person' if it's preceded by 'behaviorally'", () => {
		const mockPaper = new Paper( "We are mentally normal people." );
		const mockResearcher = Factory.buildMockResearcher( [ "I am a behaviorally normal person." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "normalPerson" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
} );
