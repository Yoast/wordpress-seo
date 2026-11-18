import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/appearanceAssessments";
import Factory from "../../../../../src/helpers/factory";
import Mark from "../../../../../src/values/Mark";
import { testInclusiveLanguageAssessments } from "../testHelpers/testHelper";

describe( "A test for Appearance assessments", function() {
	it( "should target potentially non-inclusive word 'albinos'", function() {
		const testData = [
			{
				identifier: "albinos",
				text: "This ad is aimed at albinos.",
				expectedFeedback: "Be careful when using <i>albinos</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>people with albinism, albino people</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should target potentially non-inclusive words 'obese' and 'overweight'", function() {
		const testData = [
			{
				identifier: "obese",
				text: "This ad is aimed at obese citizens.",
				expectedFeedback: "Be careful when using <i>obese</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>has a higher weight, higher-weight person, person in higher weight body, heavier person</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"Alternatively, if talking about a specific person, use their preferred descriptor if known. " +
					"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "obese",
				text: "This ad is aimed at overweight citizens.",
				expectedFeedback: "Be careful when using <i>overweight</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>has a higher weight, higher-weight person, person in higher weight body, heavier person</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"Alternatively, if talking about a specific person, use their preferred descriptor if known. " +
					"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "obesitySingular should target the phrases 'person with obesity' and 'fat person' as potentially non-inclusive", function() {
		const testData = [
			{
				identifier: "obesitySingular",
				text: "He is a person with obesity.",
				expectedFeedback: "Be careful when using <i>person with obesity</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>person who has a higher weight, higher-weight person, " +
					"person in higher weight body, heavier person</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"Alternatively, if talking about a specific person, use their preferred descriptor if known. " +
					"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "obesitySingular",
				text: "It's highly debatable whether you can call someone a fat person or not.",
				expectedFeedback: "Be careful when using <i>fat person</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>person who has a higher weight, higher-weight person, " +
					"person in higher weight body, heavier person</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"Alternatively, if talking about a specific person, use their preferred descriptor if known. " +
					"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "obesityPlural should target the phrases 'people with obesity' and 'fat people' as potentially non-inclusive", function() {
		const testData = [
			{
				identifier: "obesityPlural",
				text: "Doctors are often unconsciously biased against people with obesity.",
				expectedFeedback: "Be careful when using <i>people with obesity</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>people who have a higher weight, higher-weight people, people in higher weight bodies, heavier people</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "obesityPlural",
				text: "The articles were simply dismissed as complaints of fat people.",
				expectedFeedback: "Be careful when using <i>fat people</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>people who have a higher weight, higher-weight people, people in higher weight bodies, heavier people</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should target non-inclusive phrases 'vertically challenged' and 'harelip'", function() {
		const testData = [
			{
				identifier: "verticallyChallenged",
				text: "This ad is aimed at vertically challenged people.",
				expectedFeedback: "Avoid using <i>vertically challenged</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>little person, has short stature, someone with dwarfism</i>. " +
					"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "harelip",
				text: "The baby was born with a harelip.",
				expectedFeedback: "Avoid using <i>harelip</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>cleft lip, cleft palate</i>. " +
					"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );

	it( "should not target other grammatical forms of the phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at harelips." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "harelip" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
	it( "correctly identifies 'an albino' which is only recognized when followed by participle or simple past tense", () => {
		const mockPaper = new Paper( "An albino worked, the better they are." );
		const mockResearcher = Factory.buildMockResearcher( [ "An albino worked, the better they are." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "anAlbino" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>an albino</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>person with albinism, albino person</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "An albino worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>An albino worked, the better they are.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'an albino', which is only recognized when followed by a function word", () => {
		const mockPaper = new Paper( "An albino however, did not go to the zoo." );
		const mockResearcher = Factory.buildMockResearcher( [ "An albino however, did not go to the zoo." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "anAlbino" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>an albino</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>person with albinism, albino person</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "An albino however, did not go to the zoo.",
			marked: "<yoastmark class='yoast-text-mark'>An albino however, did not go to the zoo.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'an albino', which is only recognized when followed by a punctuation mark", () => {
		const mockPaper = new Paper( "I have always loved an albino!" );
		const mockResearcher = Factory.buildMockResearcher( [ "I have always loved an albino!" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "anAlbino" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>an albino</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>person with albinism, albino person</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I have always loved an albino!",
			marked: "<yoastmark class='yoast-text-mark'>I have always loved an albino!</yoastmark>",
		} ) ] );
	} );
	it( "does not identify 'an albino' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "An albino person walks on the street." );
		const mockResearcher = Factory.buildMockResearcher( [ "An albino person walks on the street." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "anAlbino" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
	it( "should target non-inclusive word 'midget' and its plural form", () => {
		const testData = [
			{
				identifier: "midget",
				text: "Midget is a term for a person of unusually short stature that is considered by some to be pejorative.",
				expectedFeedback: "Avoid using <i>midget</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>little person, " +
					"has short stature, someone with dwarfism</i>. <a href='https://yoa.st/inclusive-language-appearance' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "midgets",
				text: "In the early 19th century, midgets were romanticized by the middle class and regarded with " +
					"the same affectionate condescension extended to children, as creatures of innocence.",
				expectedFeedback: "Avoid using <i>midgets</i> as it is potentially harmful. Consider using an alternative," +
					" such as <i>little people, " +
					"have short stature, people with dwarfism</i>. <a href='https://yoa.st/inclusive-language-appearance' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
} );
