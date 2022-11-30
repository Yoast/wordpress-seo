import Paper from "../../../../../src/values/Paper";
import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/appearanceAssessments";
import Factory from "../../../../specHelpers/factory";
import Mark from "../../../../../src/values/Mark";

describe( "Appearance assessments", function() {
	it( "should target non-inclusive phrases",
		function() {
			const mockText = "This ad is aimed at albinos";
			const mockPaper = new Paper( mockText );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "albinos" ) );

			const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
			const assessmentResult = assessor.getResult();

			expect( isApplicable ).toBeTruthy();
			expect( assessmentResult.getScore() ).toEqual( 6 );
			expect( assessmentResult.getText() ).toEqual(
				"Be careful when using <i>albinos</i> as it is potentially harmful. " +
				"Consider using an alternative, such as <i>people with albinism, albino people</i>, " +
				"unless referring to someone who explicitly wants to be referred to with this term. " +
				"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>" );
			expect( assessmentResult.hasMarks() ).toBeTruthy();
			expect( assessor.getMarks() ).toEqual( [ { _properties:
					{ marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at albinos</yoastmark>",
						original: "This ad is aimed at albinos",
						fieldsToMark: [],
					} } ] );
		} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockText = "This ad is aimed at obese citizens.";
		const mockPaper = new Paper( mockText );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "obese" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>obese</i> as it is potentially harmful. " +
			"Consider using an alternative, such as " +
			"<i>has/have a higher weight, higher-weight person/people, person/people in higher weight body/bodies, heavier person/people</i>. " +
			"Alternatively, if talking about a specific person, use their preferred descriptor if known. " +
			"<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [
			{ _properties: {
				marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at obese citizens.</yoastmark>",
				original: "This ad is aimed at obese citizens.",
				fieldsToMark: [],
			} } ] );
	} );

	it( "should not target phrases preceded by certain words", function() {
		const mockText = "This ad is aimed at vertically challenged people.";
		const mockPaper = new Paper( mockText );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "verticallyChallenged" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(  [
			{ _properties: {
				marked: "<yoastmark class='yoast-text-mark'>This ad is aimed at vertically challenged people.</yoastmark>",
				original: "This ad is aimed at vertically challenged people.",
				fieldsToMark: [],
			} } ] );
	} );

	it( "should not target phrases followed by by certain words", function() {
		const mockPaper = new Paper( "This ad is aimed at seniors midgets." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "midget" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at harelips" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "harelip" )  );

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
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>an albino</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>people with albinism, albino people</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
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
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>an albino</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>people with albinism, albino people</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
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
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>an albino</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>people with albinism, albino people</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
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
} );
