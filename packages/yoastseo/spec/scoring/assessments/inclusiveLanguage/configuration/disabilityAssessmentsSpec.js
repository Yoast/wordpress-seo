import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/disabilityAssessments";
import Factory from "../../../../specHelpers/factory.js";

describe( "Disability assessments", function() {
	it( "should return proper feedback with two inclusive alternatives", function() {
		const mockPaper = new Paper( "Look at that sociopath." );
		const mockResearcher = Factory.buildMockResearcher( [ "Look at that sociopath." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "sociopath" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>sociopath</i> as it is potentially harmful. If you are referencing the medical condition, use " +
			"<i>person with antisocial personality disorder</i> instead, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior, such as " +
			"<i>toxic, manipulative, cruel</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "Look at that sociopath.",
			marked: "<yoastmark class='yoast-text-mark'>Look at that sociopath.</yoastmark>",
		} ) ] );
	} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "An alcoholic should just drink less." );
		const mockResearcher = Factory.buildMockResearcher( [ "An alcoholic should just drink less." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "alcoholic" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>an alcoholic</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>person with alcohol use disorder</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "An alcoholic should just drink less.",
			marked: "<yoastmark class='yoast-text-mark'>An alcoholic should just drink less.</yoastmark>",
		} ) ] );
	} );

	it( "should not target phrases followed by by certain words", function() {
		const mockPaper = new Paper( "An alcoholic drink a day keeps the doctor away." );
		const mockResearcher = Factory.buildMockResearcher( [ "An alcoholic drink a day keeps the doctor away." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "alcoholic" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should only target retarded if preceded by mentally.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "retarded" ) );

		let testSentence = "He is mentally retarded";
		let mockPaper = new Paper( testSentence );
		let mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );

		testSentence = "He is retarded";
		mockPaper = new Paper( testSentence );
		mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
	} );


	it( "should not target alcoholics if followed by anonymous.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "alcoholics" ) );

		const testSentence = "This is alcoholics anonymous.";
		const mockPaper = new Paper( testSentence );
		const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
	} );

	it( "should not target handicap when followed with exception words.", () => {
		[ "toilet", "toilets", "parking", "bathroom", "bathrooms", "stall", "stalls" ].map( exceptionWord => {
			const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "handicap" ) );
			const testSentence = `This is the handicap ${ exceptionWord }.`;

			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );

	it( "should not target functioning when followed by autism.", () => {
		[ "high functioning", "low functioning" ].map( trigger => {
			const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "functioning" ) );
			const testSentence = `They have ${ trigger } autism.`;

			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );

	it( "should target 'stupid'.", () => {
		const testSentence = "Stupid, that's just how they're acting.";
		const mockPaper = new Paper( testSentence );
		const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "stupid" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>stupid</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i>. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: testSentence,
			marked: `<yoastmark class='yoast-text-mark'>${ testSentence }</yoastmark>`,
		} ) ] );
	} );

	it( "should not target 'dumb' if preceded by 'deaf and'.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "dumb" ) );

		const testSentence = "He is deaf and dumb.";
		const mockPaper = new Paper( testSentence );
		const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
	} );

	it( "correctly identifies 'the disabled' which is only recognized when followed by participle or simple past tense", () => {
		const mockPaper = new Paper( "the disabled worked, the better they are." );
		const mockResearcher = Factory.buildMockResearcher( [ "The disabled worked, the better they are." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theDisabled" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the disabled</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>people who have a disability</i>, <i>disabled people </i>. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The disabled worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>The disabled worked, the better they are.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'The disabled', which is only recognized when followed by a function word", () => {
		const mockPaper = new Paper( "The disabled however, did not go to the zoo." );
		const mockResearcher = Factory.buildMockResearcher( [ "The disabled however, did not go to the zoo." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theDisabled" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the disabled</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>people who have a disability</i>, <i>disabled people </i>. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The disabled however, did not go to the zoo.",
			marked: "<yoastmark class='yoast-text-mark'>The disabled however, did not go to the zoo.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'The disabled', which is only recognized when followed by a punctuation mark", () => {
		const mockPaper = new Paper( "I have always loved the disabled!" );
		const mockResearcher = Factory.buildMockResearcher( [ "I have always loved the disabled!" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theDisabled" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the disabled</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>people who have a disability</i>, <i>disabled people </i>. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I have always loved the disabled!",
			marked: "<yoastmark class='yoast-text-mark'>I have always loved the disabled!</yoastmark>",
		} ) ] );
	} );
	it( "does not identify 'the disabled' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "The disabled person walks on the street." );
		const mockResearcher = Factory.buildMockResearcher( [ "The disabled person walks on the street." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "theDisabled" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
} );

