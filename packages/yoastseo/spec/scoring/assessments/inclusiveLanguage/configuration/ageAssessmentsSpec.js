import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import ageAssessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/ageAssessments";
import Factory from "../../../../specHelpers/factory.js";
import { inclusiveLanguageAssessmentTestHelper } from "./testHelpers/inclusiveLanguageTestHelper";


describe( "Age assessments", function() {
	it( "should target non-inclusive phrases", function() {
		const mockText = "This ad is aimed at aging dependants";
		const mockSentences = [ mockText ];
		const expectedFeedback = "Avoid using <i>aging dependants</i> as it is potentially harmful. Consider using an alternative," +
		" such as <i>older people</i>, unless referring to someone who explicitly wants to be referred to with this term." +
		" Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>)." +
		" <a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>";

		const expectedMarks = [ new Mark( {
			original: mockText,
			marked: "<yoastmark class='yoast-text-mark'>" + mockText + "</yoastmark>",
		} ) ];
		inclusiveLanguageAssessmentTestHelper( ageAssessments, mockText, mockSentences, "agingDependants", true, 3, expectedFeedback, expectedMarks );
	} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockText = "This ad is aimed at senior citizens. But this ad is aimed at the youth.";
		const mockSentences = [ "This ad is aimed at senior citizens.", "But this ad is aimed at the youth." ];
		const expectedFeedback = "Be careful when using <i>senior citizens</i> as it is potentially harmful. Consider using an alternative," +
		" such as <i>older citizen(s)</i>, unless referring to someone who explicitly wants to be referred to with this term." +
		" Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>)." +
		" <a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>";
		const expectedMarks = [ new Mark( {
			original: "This ad is aimed at senior citizens.",
			marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at senior citizens.</yoastmark>",
		} ) ];

		inclusiveLanguageAssessmentTestHelper( ageAssessments, mockText, mockSentences, "seniorCitizens", true, 6, expectedFeedback, expectedMarks );
	} );


	it( "should not target phrases preceded by certain words", function() {
		const mockText = "This ad is aimed at high school seniors.";
		const mockSentences = [ mockText ];

		inclusiveLanguageAssessmentTestHelper( ageAssessments, mockText, mockSentences, "seniors", false );
	} );

	it( "should not target phrases followed by by certain words", function() {
		const mockText = "This ad is aimed at seniors who are graduating.";
		const mockSentences = [ mockText ];

		inclusiveLanguageAssessmentTestHelper( ageAssessments, mockText, mockSentences, "seniors", false );
	} );

	it( "should not target other phrases", function() {
		const mockText =  "This ad is aimed at the youth";
		const mockSentences = [ mockText ];

		inclusiveLanguageAssessmentTestHelper( ageAssessments, mockText, mockSentences, "seniorCitizens", false );
	} );

	it( "correctly identifies a phrase that is only recognized when followed by participle or simple past tense", () => {
		const mockText = "The aged worked, the better they are.";
		const mockSentences = [ mockText ];
		const expectedFeedback = "Avoid using <i>the aged</i> as it is potentially harmful. " +
		"Consider using an alternative, such as <i>older people</i>. " +
		"Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>). " +
		"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>";

		const expectedMarks = [ new Mark( {
			original: "The aged worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>The aged worked, the better they are.</yoastmark>",
		} ) ];
		inclusiveLanguageAssessmentTestHelper( ageAssessments, mockText, mockSentences, "theAged", true, 3, expectedFeedback, expectedMarks );
	} );

	it( "correctly identifies a phrase that is only recognized when followed by a function word", () => {
		const mockText = "The aged however, did not go to the zoo.";
		const mockSentences = [ mockText ];
		const expectedFeedback = "Avoid using <i>the aged</i> as it is potentially harmful. " +
		"Consider using an alternative, such as <i>older people</i>. " +
		"Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>). " +
		"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>";

		const expectedMarks = [ new Mark( {
			original: "The aged however, did not go to the zoo.",
			marked: "<yoastmark class='yoast-text-mark'>The aged however, did not go to the zoo.</yoastmark>",
		} ) ];
		inclusiveLanguageAssessmentTestHelper( ageAssessments, mockText, mockSentences, "theAged", true, 3, expectedFeedback, expectedMarks );
	} );
	it( "correctly identifies a phrase that is only recognized when followed by a punctuation mark", () => {
		const mockText = "I have always loved the aged!";
		const mockSentences = [ mockText ];
		const expectedFeedback = "Avoid using <i>the aged</i> as it is potentially harmful. " +
		"Consider using an alternative, such as <i>older people</i>. " +
		"Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>). " +
		"<a href='https://yoa.st/inclusive-language-age' target='_blank'>Learn more.</a>";

		const expectedMarks = [ new Mark( {
			original: "I have always loved the aged!",
			marked: "<yoastmark class='yoast-text-mark'>I have always loved the aged!</yoastmark>",
		} ) ];
		inclusiveLanguageAssessmentTestHelper( ageAssessments, mockText, mockSentences, "theAged", true, 3, expectedFeedback, expectedMarks );
	} );

	it( "does not identify 'the aged' when not followed by punctuation, function word or participle", () => {
		const mockText =  "The aged cheese is the best.";
		const mockSentences = [ mockText ];

		inclusiveLanguageAssessmentTestHelper( ageAssessments, mockText, mockSentences, "theAged", false );
	} );
} );
