import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/disabilityAssessments";
import Factory from "../../../../../src/helpers/factory.js";
import { testInclusiveLanguageAssessments } from "../testHelpers/testHelper";

describe( "A test for Disability assessments", function() {
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

	it( "should not target 'narcissistic' when followed by 'personality disorder'", () => {
		const mockPaper = new Paper( "He was diagnosed with narcissistic personality disorder." );
		const mockResearcher = Factory.buildMockResearcher( [ "He was diagnosed with narcissistic personality disorder." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "narcissistic" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should only target retarded if preceded by mentally.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "retarded" ) );

		let testSentence = "He is mentally retarded.";
		let mockPaper = new Paper( testSentence );
		let mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );

		testSentence = "He is retarded.";
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
			"<i>people who have a disability</i>, <i>disabled people</i>. " +
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
			"<i>people who have a disability</i>, <i>disabled people</i>. " +
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
			"<i>people who have a disability</i>, <i>disabled people</i>. " +
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
	it( "should not target 'binge' when followed by exception words.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "binge" ) );
		const exceptionWords = [ "drink", "drinks", "drinking", "eating disorder", "and purge", "behavior", "behaviors", "behaviour", "behaviours" ];
		exceptionWords.map( ( exceptionWord ) => {
			const testSentence = `We binge ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );
			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );
	it( "should not target 'bingeing' when followed by exception words.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "bingeing" ) );
		[ "and purging", "behavior", "behaviors", "behaviour", "behaviours" ].map( ( exceptionWord ) => {
			const testSentence = `We were bingeing ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );
			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );
	it( "should not target 'binged' when followed by exception words.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "binged" ) );
		[ "and purged" ].map( ( exceptionWord ) => {
			const testSentence = `We binged ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );
			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );
	it( "should not target 'binges' when followed by exception words.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "binges" ) );
		[ "and purges" ].map( ( exceptionWord ) => {
			const testSentence = `He binges ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );
			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );
	it( "should not target 'paranoid' when followed by exception words.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "paranoid" ) );
		const exceptionWords = [ "delusion", "delusions", "personality disorder", "ideation" ];
		exceptionWords.map( ( exceptionWord ) => {
			const testSentence = `They displayed a paranoid ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );
			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );
	it( "should not target 'manic' when followed by exception words.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "manic" ) );
		const exceptionWords = [ "episode", "episodes", "state", "states", "symptoms", "and depressive episodes", "and hypomanic", "or hypomanic" ];
		exceptionWords.map( ( exceptionWord ) => {
			const testSentence = `We were going through a manic ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );
			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );
	it( "correctly identifies 'wheelchair-bound'", () => {
		const mockPaper = new Paper( "This sentence contains wheelchair-bound." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains wheelchair-bound." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "wheelchairBound" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>wheelchair-bound</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>uses a wheelchair, is a wheelchair user</i>. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains wheelchair-bound.</yoastmark>",
			original: "This sentence contains wheelchair-bound." } } ]
		);
	} );
	it( "correctly identifies 'hard-of-hearing'", () => {
		const mockPaper = new Paper( "This sentence contains hard-of-hearing." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains hard-of-hearing." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "hardOfHearing" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>hard-of-hearing</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>hard of hearing, partially deaf, has partial hearing loss</i>. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains hard-of-hearing.</yoastmark>",
			original: "This sentence contains hard-of-hearing." } } ]
		);
	} );
	it( "correctly identifies 'high-functioning autism'", () => {
		const mockPaper = new Paper( "This sentence contains high-functioning autism." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains high-functioning autism." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "autismHigh" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>high-functioning autism</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>autism with high support needs</i> " +
			"or describing the specific characteristic or experience, unless referring to how you characterize your own condition. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains high-functioning autism.</yoastmark>",
			original: "This sentence contains high-functioning autism." } } ]
		);
	} );
	it( "correctly identifies 'low-functioning autism'", () => {
		const mockPaper = new Paper( "This sentence contains low-functioning autism." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains low-functioning autism." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "autismLow" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>low-functioning autism</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>autism with low support needs</i> " +
			"or describing the specific characteristic or experience, unless referring to how you characterize your own condition. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains low-functioning autism.</yoastmark>",
			original: "This sentence contains low-functioning autism." } } ]
		);
	} );
	it( "correctly identifies 'brain-damaged'", () => {
		const mockPaper = new Paper( "This sentence contains brain-damaged." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains brain-damaged." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "brainDamaged" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>brain-damaged</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>person with a (traumatic) brain injury</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains brain-damaged.</yoastmark>",
			original: "This sentence contains brain-damaged." } } ]
		);
	} );
} );

describe( "a test for targeting non-inclusive phrases in disability assessments", () => {
	it( "should return the appropriate score and feedback string for: 'binge' and its other forms", () => {
		const testData = [
			{
				identifier: "binge",
				text: "I binge on ice cream.",
				expectedFeedback: "Be careful when using <i>binge</i>, unless talking about a symptom of a medical condition. " +
					"If you are not referencing a symptom, consider other alternatives to describe the trait or behavior, " +
					"such as <i>indulge, satiate, wallow, spree, marathon, consume excessively</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "binges",
				text: "She binges on Netflix series.",
				expectedFeedback: "Be careful when using <i>binges</i>, unless talking about a symptom of a medical condition. " +
					"If you are not referencing a symptom, consider other alternatives to describe the trait or behavior, " +
					"such as <i>indulges, satiates, wallows, sprees, marathons, consumes excessively</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "bingeing",
				text: "She is bingeing the new Korean drama on Netflix.",
				expectedFeedback: "Be careful when using <i>bingeing</i>, unless talking about a symptom of a medical condition. " +
					"If you are not referencing a symptom, consider other alternatives to describe the trait or behavior, " +
					"such as <i>indulging, satiating, wallowing, spreeing, marathoning, consuming excessively</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "bingeing",
				text: "She is binging the new Korean drama on Netflix.",
				expectedFeedback: "Be careful when using <i>binging</i>, unless talking about a symptom of a medical condition. " +
					"If you are not referencing a symptom, consider other alternatives to describe the trait or behavior, " +
					"such as <i>indulging, satiating, wallowing, spreeing, marathoning, consuming excessively</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "binged",
				text: "She binged the new Korean drama on Netflix.",
				expectedFeedback: "Be careful when using <i>binged</i>, unless talking about a symptom of a medical condition. " +
					"If you are not referencing a symptom, consider other alternatives to describe the trait or behavior, " +
					"such as <i>indulged, satiated, wallowed, spreed, marathoned, consumed excessively</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'crippled' and 'cripple'", () => {
		const testData = [
			{
				identifier: "crippled",
				text: "He's afraid to look crippled.",
				expectedFeedback: "Avoid using <i>crippled</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>has a physical disability, is physically disabled</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "cripple",
				text: "He's afraid to look like a cripple.",
				expectedFeedback: "Avoid using <i>a cripple</i> as it is derogatory. Consider using an alternative, such as " +
					"<i>person with a physical disability, a physically disabled person</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'handicapped' and 'handicap'", () => {
		const testData = [
			{
				identifier: "handicapped",
				text: "They considered that some people are handicapped.",
				expectedFeedback: "Avoid using <i>handicapped</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>disabled, person with a disability</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "handicap",
				text: "They are in the handicap situation.",
				expectedFeedback: "Avoid using <i>handicap</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>disability</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'insane'", () => {
		const testData = [
			{
				identifier: "insane",
				text: "That party was insane.",
				expectedFeedback: "Avoid using <i>insane</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>wild, confusing, unpredictable, impulsive, reckless, out of control, unbelievable, amazing, incomprehensible, " +
					"nonsensical, outrageous, ridiculous</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'special needs'", () => {
		const testData = [
			{
				identifier: "specialNeeds",
				text: "We care about special needs children.",
				expectedFeedback: "Avoid using <i>special needs</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>functional needs, support needs</i> when referring to someone's needs, or <i>disabled, person with a disability</i> " +
					"when referring to a person. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'hearing impaired'", () => {
		const testData = [
			{
				identifier: "hearingImpaired",
				text: "Speak louder for the hearing impaired people.",
				expectedFeedback: "Avoid using <i>hearing impaired</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>deaf or hard of hearing, partially deaf, has partial hearing loss</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'high functioning' and 'low functioning'", () => {
		const testData = [
			{
				identifier: "functioning",
				text: "They have high functioning depression.",
				expectedFeedback: "Be careful when using <i>high functioning</i> as it is potentially harmful. Consider using an alternative, " +
					"such as describing the specific characteristic or experience, unless referring to how you characterize your own condition. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "functioning",
				text: "They have low functioning depression.",
				expectedFeedback: "Be careful when using <i>low functioning</i> as it is potentially harmful. Consider using an alternative, " +
					"such as describing the specific characteristic or experience, unless referring to how you characterize your own condition. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'lame' and its other forms", () => {
		const testData = [
			{
				identifier: "lame",
				text: "Such a lame excuse!",
				expectedFeedback: "Avoid using <i>lame</i> as it is potentially harmful. Consider using an alternative, such as <i>boring, lousy, " +
					"unimpressive, sad, corny</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "lamer",
				text: "It is a lamer excuse compared to the previous one.",
				expectedFeedback: "Avoid using <i>lamer</i> as it is potentially harmful. Consider using an alternative, such as <i>more boring, " +
					"lousier, more unimpressive, sadder, cornier</i>. <a href='https://yoa.st/inclusive-language-disability' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "lamest",
				text: "This is the lamest excuse by far!",
				expectedFeedback:
					"Avoid using <i>lamest</i> as it is potentially harmful. Consider using an alternative, such as <i>most boring, " +
					"lousiest, most unimpressive, saddest, corniest</i>. <a href='https://yoa.st/inclusive-language-disability'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'commit suicide' and its other forms", () => {
		const testData = [
			{
				identifier: "commitSuicide",
				text: "commit suicide",
				expectedFeedback: "Avoid using <i>commit suicide</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>take one's life, die by suicide, kill oneself</i>. <a href='https://yoa.st/inclusive-language-disability' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "committingSuicide",
				text: "committing suicide",
				expectedFeedback: "Avoid using <i>committing suicide</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>taking one's life, dying by suicide, killing oneself</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "commitsSuicide",
				text: "commits suicide",
				expectedFeedback:
					"Avoid using <i>commits suicide</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>takes one's life, dies by suicide, kills oneself</i>. <a href='https://yoa.st/inclusive-language-disability' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "committedSuicide",
				text: "committed suicide",
				expectedFeedback:
					"Avoid using <i>committed suicide</i> as it is potentially harmful. Consider using an alternative, such as" +
					" <i>took one's life, died by suicide, killed themself</i>. <a href='https://yoa.st/inclusive-language-disability'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'handicap parking'", () => {
		const testData = [
			{
				identifier: "handicapParking",
				text: "They are waiting in the handicap parking spot.",
				expectedFeedback: "Avoid using <i>handicap parking</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>accessible parking</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'handicap bathroom'", () => {
		const testData = [
			{
				identifier: "handicapBathroom",
				text: "The handicap bathroom was occupied.",
				expectedFeedback: "Avoid using <i>handicap bathroom</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>accessible bathroom(s)</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'handicap stall'", () => {
		const testData = [
			{
				identifier: "handicapStall",
				text: "There is a handicap stall.",
				expectedFeedback: "Avoid using <i>handicap stall</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>accessible stall(s)</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'handicap toilet'", () => {
		const testData = [
			{
				identifier: "handicapToilet",
				text: "The handicap toilet was occupied.",
				expectedFeedback: "Avoid using <i>handicap toilet</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>accessible toilet(s)</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'fell on deaf ears'", () => {
		const testData = [
			{
				identifier: "fellOnDeafEars",
				text: "It's like he fell on deaf ears.",
				expectedFeedback: "Avoid using <i>fell on deaf ears</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>was not addressed, was ignored, was disregarded</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'turn a blind eye'", () => {
		const testData = [
			{
				identifier: "turnOnBlindEye",
				text: "They turn a blind eye on the issue.",
				expectedFeedback: "Avoid using <i>turn a blind eye</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>ignore, pretend not to notice</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'the blind leading the blind'", () => {
		const testData = [
			{
				identifier: "blindLeadingBlind",
				text: "Don't listen to him, it's the blind leading the blind.",
				expectedFeedback: "Avoid using <i>the blind leading the blind</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>ignorant, misguided, incompetent, unqualified, insensitive, unaware</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'dumb' and its other forms", () => {
		// The different forms of "dumb" is one entry under the same identifier.
		const testData = [
			{
				identifier: "dumb",
				text: "Don't mind me, I was being dumb.",
				expectedFeedback: "Avoid using <i>dumb</i> as it is potentially harmful. Consider using an alternative, such as <i>uninformed, " +
					"ignorant, foolish, inconsiderate, irrational, reckless</i>. <a href='https://yoa.st/inclusive-language-disability'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "dumb",
				text: "A dumber person",
				expectedFeedback: "Avoid using <i>dumber</i> as it is potentially harmful. Consider using an alternative, such as <i>uninformed, " +
					"ignorant, foolish, inconsiderate, irrational, reckless</i>. <a href='https://yoa.st/inclusive-language-disability' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "dumb",
				text: "That individual was the dumbest.",
				expectedFeedback:
					"Avoid using <i>dumbest</i> as it is potentially harmful. Consider using an alternative, such as <i>uninformed, " +
					"ignorant, foolish, inconsiderate, irrational, reckless</i>. <a href='https://yoa.st/inclusive-language-disability' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for non-inclusive phrases related to 'deaf'", () => {
		const testData = [
			// Non-inclusive: deaf-mute.
			{
				identifier: "deaf",
				text: "They were born deaf-mute.",
				expectedFeedback: "Avoid using <i>deaf-mute</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>deaf</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Non-inclusive: deaf and dumb.
			{
				identifier: "deaf",
				text: "They were born deaf and dumb.",
				expectedFeedback: "Avoid using <i>deaf and dumb</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>deaf</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'addict' and its plural", () => {
		const testData = [
			{
				identifier: "addict",
				text: "They may be an addict.",
				expectedFeedback: "Be careful when using <i>addict</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>person with a (drug, alcohol, ...) addiction, person with substance abuse disorder</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "addicts",
				text: "Addicts are generalized as not trustworthy.",
				expectedFeedback: "Be careful when using <i>addicts</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>people with a (drug, alcohol, ...) addiction, people with substance abuse disorder</i>, unless referring to someone " +
					"who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'sanity check'", () => {
		const testData = [
			{
				identifier: "sanityCheck",
				text: "Those who decided this need a sanity check.",
				expectedFeedback: "Avoid using <i>sanity check</i> as it is potentially harmful. Consider using an alternative, " +
						"such as <i>final check, confidence check, rationality check, soundness check</i>. " +
						"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'epileptic fit' and its plural form", () => {
		const testData = [
			{
				identifier: "epilepticFit",
				text: "What can trigger an epileptic fit?",
				expectedFeedback: "Avoid using <i>epileptic fit</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>epileptic seizure</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "epilepticFits",
				text: "What can trigger epileptic fits?",
				expectedFeedback: "Avoid using <i>epileptic fits</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>epileptic seizures</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "correctly identifies 'differently-abled'", () => {
		const mockPaper = new Paper( "This sentence contains differently-abled." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains differently-abled." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "differentlyAbled" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>differently-abled</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>disabled, person with a disability</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains differently-abled.</yoastmark>",
			original: "This sentence contains differently-abled." } } ]
		);
	} );
	it( "should return the appropriate score and feedback string for: 'crazy' and its other forms and with different conditions", () => {
		const testData = [
			// Form: crazy.
			{
				identifier: "crazy",
				text: "It was a crazy decision.",
				expectedFeedback: "Avoid using <i>crazy</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>wild, baffling, out of control, inexplicable, unbelievable, aggravating, shocking, intense, impulsive, " +
					"chaotic, confused, mistaken, obsessed</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: crazier.
			{
				identifier: "crazier",
				text: "It is a crazier idea compared to the previous one.",
				expectedFeedback: "Avoid using <i>crazier</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>more wild, baffling, out of control, inexplicable, unbelievable, aggravating, shocking, intense, impulsive, " +
					"chaotic, confused, mistaken, obsessed</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: craziest.
			{
				identifier: "craziest",
				text: "This is the craziest decision I've ever made!",
				expectedFeedback: "Avoid using <i>craziest</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>most wild, baffling, out of control, inexplicable, unbelievable, aggravating, shocking, intense, impulsive, " +
					"chaotic, confused, mistaken, obsessed</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: crazy. It should show feedback for standalone 'crazy' when 'crazy about' is preceded by 'what's'.
			{
				identifier: "crazy",
				text: "What's crazy about this album?",
				expectedFeedback: "Avoid using <i>crazy</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>wild, baffling, out of control, inexplicable, unbelievable, aggravating, shocking, intense, impulsive, " +
					"chaotic, confused, mistaken, obsessed</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: crazy. It should show feedback for standalone 'crazy' when a form of 'to be' + crazy' is not followed by 'about'.
			{
				identifier: "crazy",
				text: "You're crazy.",
				expectedFeedback: "Avoid using <i>crazy</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>wild, baffling, out of control, inexplicable, unbelievable, aggravating, shocking, intense, impulsive, " +
					"chaotic, confused, mistaken, obsessed</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: the non-negated phrase of 'crazy about'", () => {
		const testData = [
			// The non-negated phrase for 'crazy about' without an intensifier.
			{
				identifier: "to be crazy about",
				text: "I am crazy about this album.",
				expectedFeedback: "Avoid using <i>to be crazy about</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to love, to be obsessed with, to be infatuated with</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// The non-negated phrase for 'crazy about' with an intensifier.
			{
				identifier: "to be crazy about",
				text: "I am so crazy about this album.",
				expectedFeedback: "Avoid using <i>to be crazy about</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to love, to be obsessed with, to be infatuated with</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should not show the feedback for the non-negated form of 'crazy about' when the negated form is used.", () => {
		const mockPaper = new Paper( "I am not so crazy about this album." );
		const mockResearcher = Factory.buildMockResearcher( [ "I am not so crazy about this album." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "to be crazy about" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		expect( isApplicable ).toBeFalsy();
	} );
	it( "should return the appropriate score and feedback string for: the negated phrase of 'crazy about'", () => {
		const testData = [
			// The negated phrase for 'crazy about' without an intensifier.
			{
				identifier: "to not be crazy about",
				text: "They are not crazy about this album.",
				expectedFeedback: "Avoid using <i>to not be crazy about</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to not be impressed by, to not be enthusiastic about, to not be into, " +
					"to not like</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// The negated phrase for 'crazy about' with an intensifier.
			{
				identifier: "to not be crazy about",
				text: "They are not too crazy about this album.",
				expectedFeedback: "Avoid using <i>to not be crazy about</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to not be impressed by, to not be enthusiastic about, to not be into, " +
					"to not like</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// The contracted negated phrase for 'crazy about' with an intensifier.
			{
				identifier: "to not be crazy about",
				text: "They aren't too crazy about this album.",
				expectedFeedback: "Avoid using <i>to not be crazy about</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to not be impressed by, to not be enthusiastic about, to not be into, " +
					"to not like</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should not show the feedback for the negated form of 'crazy about' when the non-negated form is used.", () => {
		const mockPaper = new Paper( "I am so crazy about this album." );
		const mockResearcher = Factory.buildMockResearcher( [ "I am so crazy about this album." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "to not be crazy about" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		expect( isApplicable ).toBeFalsy();
	} );
	it( "should not show the feedback for standalone crazy when it's used as part of a more specific phrase.", () => {
		const mockPaper = new Paper( "I am so crazy about this album." );
		const mockResearcher = Factory.buildMockResearcher( [ "I am so crazy about this album." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "crazy" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		expect( isApplicable ).toBeFalsy();
	} );
	it( "should return the appropriate score and feedback string for: 'to go crazy' and its other forms", () => {
		const testData = [
			// Form: going crazy.
			{
				identifier: "to go crazy",
				text: "It's going crazy out here.",
				expectedFeedback: "Avoid using <i>to go crazy</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to go wild, to go out of control, to go up the wall, " +
					"to be aggravated, to get confused</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: go crazy.
			{
				identifier: "to go crazy",
				text: "They go crazy out here.",
				expectedFeedback: "Avoid using <i>to go crazy</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to go wild, to go out of control, to go up the wall, " +
					"to be aggravated, to get confused</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: goes crazy.
			{
				identifier: "to go crazy",
				text: "He goes crazy out here.",
				expectedFeedback: "Avoid using <i>to go crazy</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to go wild, to go out of control, to go up the wall, " +
					"to be aggravated, to get confused</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: went crazy.
			{
				identifier: "to go crazy",
				text: "They went crazy out there.",
				expectedFeedback: "Avoid using <i>to go crazy</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to go wild, to go out of control, to go up the wall, " +
					"to be aggravated, to get confused</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: gone crazy.
			{
				identifier: "to go crazy",
				text: "They have gone crazy out there.",
				expectedFeedback: "Avoid using <i>to go crazy</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>to go wild, to go out of control, to go up the wall, " +
					"to be aggravated, to get confused</i>. <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should target the phrase 'crazy in love' and retrieve correct feedback.", () => {
		const mockPaper = new Paper( "They seem crazy in love." );
		const mockResearcher = Factory.buildMockResearcher( [ "They seem crazy in love." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "crazy in love" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		expect( isApplicable ).toBeTruthy();

		const assessmentResult = assessor.getResult();

		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>crazy in love</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>wildly in love, head over heels, infatuated</i>. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "They seem crazy in love.",
			marked: "<yoastmark class='yoast-text-mark'>They seem crazy in love.</yoastmark>",
		} ) ] );
	} );
	it( "should return the appropriate score and feedback string for: 'to drive crazy' and its other forms", () => {
		const testData = [
			// Form: driving (someone) crazy.
			{
				identifier: "to drive crazy",
				text: "This math problem is driving me crazy.",
				expectedFeedback: "Avoid using <i>to drive crazy</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>to drive one to their limit, to get on one's last nerve, to make one livid, to aggravate, " +
					"to make one's blood boil, to exasperate, to get into one's head</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: drive (someone) crazy.
			{
				identifier: "to drive crazy",
				text: "They drive everyone crazy.",
				expectedFeedback: "Avoid using <i>to drive crazy</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>to drive one to their limit, to get on one's last nerve, to make one livid, to aggravate, " +
					"to make one's blood boil, to exasperate, to get into one's head</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: drove (someone) crazy.
			{
				identifier: "to drive crazy",
				text: "They drove him crazy.",
				expectedFeedback: "Avoid using <i>to drive crazy</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>to drive one to their limit, to get on one's last nerve, to make one livid, to aggravate, " +
					"to make one's blood boil, to exasperate, to get into one's head</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: drives (someone) crazy.
			{
				identifier: "to drive crazy",
				text: "She drives somebody crazy.",
				expectedFeedback: "Avoid using <i>to drive crazy</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>to drive one to their limit, to get on one's last nerve, to make one livid, to aggravate, " +
					"to make one's blood boil, to exasperate, to get into one's head</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			// Form: driven (someone) crazy.
			{
				identifier: "to drive crazy",
				text: "He has driven them crazy.",
				expectedFeedback: "Avoid using <i>to drive crazy</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>to drive one to their limit, to get on one's last nerve, to make one livid, to aggravate, " +
					"to make one's blood boil, to exasperate, to get into one's head</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'psychopath' and its other forms", () => {
		// The different forms of "psychopath" is one entry under the same identifier.
		const testData = [
			{
				identifier: "psychopathic",
				text: "He was a psychopath.",
				expectedFeedback: "Avoid using <i>psychopath</i> as it is potentially harmful. Consider using an alternative, such as <i>toxic, " +
					"manipulative, unpredictable, impulsive, reckless, out of control</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "psychopathic",
				text: "Multiple psychopaths",
				expectedFeedback: "Avoid using <i>psychopaths</i> as it is potentially harmful. Consider using an alternative, such as <i>toxic, " +
					"manipulative, unpredictable, impulsive, reckless, out of control</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "psychopathic",
				text: "A psychopathic episode",
				expectedFeedback: "Avoid using <i>psychopathic</i> as it is potentially harmful. Consider using an alternative, such as <i>toxic, " +
					"manipulative, unpredictable, impulsive, reckless, out of control</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'psycho' and its plural form", () => {
		// The different forms of "psycho" is one entry under the same identifier.
		const testData = [
			{
				identifier: "psycho",
				text: "A total psycho",
				expectedFeedback: "Avoid using <i>psycho</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>toxic, distraught, " +
					"unpredictable, reckless, out of control</i>. <a href='https://yoa.st/inclusive-language-disability'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "psycho",
				text: "Multiple psychos",
				expectedFeedback: "Avoid using <i>psychos</i> as it is potentially harmful. Consider using an alternative," +
					" such as <i>toxic, distraught, " +
					"unpredictable, reckless, out of control</i>. <a href='https://yoa.st/inclusive-language-disability'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'sociopath' and its plural form", () => {
		const testData = [
			{
				identifier: "sociopath",
				text: "Sherlock Holmes claims to be a sociopath",
				expectedFeedback: "Be careful when using <i>sociopath</i> as it is potentially harmful. " +
					"If you are referencing the medical condition, " +
					"use <i>person with antisocial personality disorder</i> instead, unless referring to someone who explicitly wants " +
					"to be referred to with this term. If you are not referencing the medical condition, consider other alternatives " +
					"to describe the trait or behavior, such as <i>toxic, manipulative, cruel</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "sociopaths",
				text: "A federation of multiple sociopaths",
				expectedFeedback: "Be careful when using <i>sociopaths</i> as it is potentially harmful." +
					" If you are referencing the medical condition," +
					" use <i>people with antisocial personality disorder</i> instead, unless referring to someone who explicitly wants " +
					"to be referred to with this term. If you are not referencing the medical condition, consider other alternatives " +
					"to describe the trait or behavior, such as <i>toxic, manipulative, cruel</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'schizophrenic'", () => {
		const testData = [
			{
				identifier: "schizophrenic",
				text: "It's like he's schizophrenic.",
				expectedFeedback: "Be careful when using <i>schizophrenic</i> as it is potentially harmful. Unless you are referencing the " +
					"specific medical condition, consider using another alternative to describe the trait or behavior, such as " +
					"<i>of two minds, chaotic, confusing</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'paranoid'", () => {
		const testData = [
			{
				identifier: "paranoid",
				text: "Some people get paranoid about their privacy.",
				expectedFeedback: "Be careful when using <i>paranoid</i> as it is potentially harmful. Unless you are referencing the " +
					"specific medical condition, consider using another alternative to describe the trait or behavior, such as " +
					"<i>overly suspicious, unreasonable, defensive</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'manic'", () => {
		const testData = [
			{
				identifier: "manic",
				text: "She dances in a manic way.",
				expectedFeedback: "Be careful when using <i>manic</i> as it is potentially harmful. Unless you are referencing the " +
					"specific medical condition, consider using another alternative to describe the trait or behavior, such as " +
					"<i>excited, raving, unbalanced, wild</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'bipolar'", () => {
		const testData = [
			{
				identifier: "schizophrenic",
				text: "She dances in a bipolar way.",
				expectedFeedback: "Be careful when using <i>bipolar</i> as it is potentially harmful. Unless you are referencing the " +
					"specific medical condition, consider using another alternative to describe the trait or behavior, such as " +
					"<i>of two minds, chaotic, confusing</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'hysterical'", () => {
		const testData = [
			{
				identifier: "hysterical",
				text: "The monologue was hysterical and therefore hard to understand.",
				expectedFeedback: "Avoid using <i>hysterical</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>intense, vehement, piercing, chaotic</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'neurotic'", () => {
		const testData = [
			{
				identifier: "neurotic",
				text: "We listened to it but it sounds kind of neurotic.",
				expectedFeedback: "Avoid using <i>neurotic</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>distraught, unstable, startling, confusing, baffling</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'narcissistic'", () => {
		const testData = [
			{
				identifier: "narcissistic",
				text: "We all know, the lovebombing narcissistic type.",
				expectedFeedback: "Be careful when using <i>narcissistic</i> as it is potentially harmful." +
					" If you are referencing the medical condition, use <i>person with narcissistic personality disorder</i>" +
					" instead, unless referring to someone who explicitly wants to be referred to with this term." +
					" If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior," +
					" such as <i>selfish, egotistical, self-centered, self-absorbed, vain, toxic, manipulative</i>." +
					" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'the mentally ill'", () => {
		const testData = [
			{
				identifier: "theMentallyIll",
				text: "There is growing compassion for the mentally ill.",
				expectedFeedback: "Avoid using <i>the mentally ill</i> as it is potentially harmful. Consider using an alternative," +
					" such as <i>people who are mentally ill</i>, <i>mentally ill people</i>. " +
					"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'daft'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "daft" ) );
		const mockPaper = new Paper( "That's a daft idea!" );
		const mockResearcher = Factory.buildMockResearcher( [ "That's a daft idea!" ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 3 );
		expect( assessment.getResult().text ).toBe( "Avoid using <i>daft</i> as it is potentially harmful." +
			" Consider using an alternative, such as <i>uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i>." +
			" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
	} );
	it( "should return the appropriate score and feedback string for: 'imbecile'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "imbecile" ) );
		const mockPaper = new Paper( "hospitals for the imbecile and insane people" );
		const mockResearcher = Factory.buildMockResearcher( [ "hospitals for the imbecile and insane" ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 3 );
		expect( assessment.getResult().text ).toBe( "Avoid using <i>imbecile</i> as it is derogatory. Consider using an alternative, " +
			"such as <i>uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i>. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
	} );
} );

describe( "Test the OCD assessment", () => {
	it( "correctly identifies 'OCD', which is only recognized when preceded by a form of 'to be'", () => {
		const mockPaper = new Paper( "I am OCD." );
		const mockResearcher = Factory.buildMockResearcher( [ "I am OCD." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "OCD" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		expect( isApplicable ).toBeTruthy();

		const assessmentResult = assessor.getResult();

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>OCD</i> as it is potentially harmful. " +
			"Unless you are referencing the specific medical condition, consider using another alternative to describe the trait or behavior, " +
			"such as <i>pedantic, obsessed, perfectionist</i>. If you are referring to someone who has the medical condition, " +
			"then state that they have OCD rather than that they are OCD. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I am OCD.",
			marked: "<yoastmark class='yoast-text-mark'>I am OCD.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'OCD', which is only recognized when preceded by a contracted form of 'to be'", () => {
		const mockPaper = new Paper( "You're OCD." );
		const mockResearcher = Factory.buildMockResearcher( [ "You're OCD." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "OCD" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		expect( isApplicable ).toBeTruthy();

		const assessmentResult = assessor.getResult();

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>OCD</i> as it is potentially harmful. " +
			"Unless you are referencing the specific medical condition, consider using another alternative to describe the trait or behavior, " +
			"such as <i>pedantic, obsessed, perfectionist</i>. If you are referring to someone who has the medical condition, " +
			"then state that they have OCD rather than that they are OCD. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "You're OCD.",
			marked: "<yoastmark class='yoast-text-mark'>You're OCD.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'OCD', which is only recognized when preceded by a form of 'to be' + intensifier", () => {
		const mockPaper = new Paper( "I am so OCD." );
		const mockResearcher = Factory.buildMockResearcher( [ "I am so OCD." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "OCD" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		expect( isApplicable ).toBeTruthy();

		const assessmentResult = assessor.getResult();

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>OCD</i> as it is potentially harmful. " +
			"Unless you are referencing the specific medical condition, consider using another alternative to describe the trait or behavior, " +
			"such as <i>pedantic, obsessed, perfectionist</i>. If you are referring to someone who has the medical condition, " +
			"then state that they have OCD rather than that they are OCD. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I am so OCD.",
			marked: "<yoastmark class='yoast-text-mark'>I am so OCD.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'OCD' when it's preceded by a negated form of 'to be' + intensifier", () => {
		const mockPaper = new Paper( "I am not that OCD." );
		const mockResearcher = Factory.buildMockResearcher( [ "I am not that OCD." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "OCD" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		expect( isApplicable ).toBeTruthy();

		const assessmentResult = assessor.getResult();

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>OCD</i> as it is potentially harmful. " +
			"Unless you are referencing the specific medical condition, consider using another alternative to describe the trait or behavior, " +
			"such as <i>pedantic, obsessed, perfectionist</i>. If you are referring to someone who has the medical condition, " +
			"then state that they have OCD rather than that they are OCD. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I am not that OCD.",
			marked: "<yoastmark class='yoast-text-mark'>I am not that OCD.</yoastmark>",
		} ) ] );
	} );
	it( "does not identify 'OCD' when not preceded by a form of 'to be'", () => {
		const mockPaper = new Paper( "This person has OCD" );
		const mockResearcher = Factory.buildMockResearcher( [ "This person has OCD" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "OCD" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
} );

