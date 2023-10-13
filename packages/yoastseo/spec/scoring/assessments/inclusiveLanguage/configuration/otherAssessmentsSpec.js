import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/otherAssessments";
import Factory from "../../../../specHelpers/factory";
import Mark from "../../../../../src/values/Mark";
import { testInclusiveLanguageAssessments } from "../testHelpers/testHelper";

describe( "Checks various conditions for the 'normal' and 'abnormal' assessments", () => {
	it( "targets potentially harmful phrases that include the word 'normal'", () => {
		const testData = [
			{
				identifier: "normal",
				text: "He is a normal person.",
				expectedFeedback: "Avoid using <i>normal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>typical</i> or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "normal",
				text: "They are normal people right.",
				expectedFeedback: "Avoid using <i>normal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>typical</i> or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "normal",
				text: "He is a mentally normal person.",
				expectedFeedback: "Avoid using <i>normal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>typical</i> or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "normal",
				text: "I'm afraid this isn't psychologically normal.",
				expectedFeedback: "Avoid using <i>normal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>typical</i> or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "behaviorallyNormal",
				text: "I'm afraid this isn't behaviorally normal.",
				expectedFeedback: "Be careful when using <i>behaviorally normal</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, such as <i>showing typical behavior</i> " +
					"or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "behaviorallyNormal",
				text: "I'm afraid this isn't behaviourally normal.",
				expectedFeedback: "Be careful when using <i>behaviourally normal</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, such as <i>showing typical behavior</i> " +
					"or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets potentially harmful phrases that include the word 'abnormal'", () => {
		const testData = [
			{
				identifier: "abnormal",
				text: "He is an abnormal person.",
				expectedFeedback: "Avoid using <i>abnormal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>atypical</i> or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "abnormal",
				text: "They are abnormal people it seems.",
				expectedFeedback: "Avoid using <i>abnormal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>atypical</i> or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "abnormal",
				text: "He is a mentally abnormal person.",
				expectedFeedback: "Avoid using <i>abnormal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>atypical</i> or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "abnormal",
				text: "I'm afraid this isn't psychologically abnormal.",
				expectedFeedback: "Avoid using <i>abnormal</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>atypical</i> or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "behaviorallyAbnormal",
				text: "I'm afraid this isn't behaviorally abnormal.",
				expectedFeedback: "Be careful when using <i>behaviorally abnormal</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, " +
					"such as <i>showing atypical behavior, showing dysfunctional behavior</i> " +
					"or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "behaviorallyAbnormal",
				text: "I'm afraid this isn't behaviourally abnormal.",
				expectedFeedback: "Be careful when using <i>behaviourally abnormal</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, " +
					"such as <i>showing atypical behavior, showing dysfunctional behavior</i> " +
					"or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "abnormalBehavior",
				text: "This isn't abnormal behaviour.",
				expectedFeedback: "Be careful when using <i>abnormal behaviour</i> as it is potentially harmful. " +
					"Unless you are referring to objects or animals, consider using an alternative, " +
					"such as <i>atypical behavior, unusual behavior</i> " +
					"or a specific characteristic or experience if it is known. " +
					"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
} );

describe( "Checks highlighting for 'minorities' and a non-triggering condition for the assessment for 'normal'", () => {
	it( "targets potentially non-inclusive word 'minorities'", function() {
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
			"Consider using an alternative, such as <i>marginalized groups</i>, <i>underrepresented groups</i> or " +
			"specific minorities, such as <i>gender and sexuality minorities</i>. " +
			"<a href='https://yoa.st/inclusive-language-other' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: mockText,
			marked: "<yoastmark class='yoast-text-mark'>" + mockText + "</yoastmark>",
		} ) ] );
	} );

	it( "doesn't identify 'normal' when it's not used as part of specific phrases", () => {
		const mockPaper = new Paper( "It's normal for dogs to bark." );
		const mockResearcher = Factory.buildMockResearcher( [ "It's normal for dogs to bark." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "normal" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
} );
