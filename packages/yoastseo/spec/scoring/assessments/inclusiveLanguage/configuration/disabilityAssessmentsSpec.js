import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/disabilityAssessments";
import Factory from "../../../../specHelpers/factory.js";

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
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
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
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
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
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
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
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains low-functioning autism.</yoastmark>",
			original: "This sentence contains low-functioning autism." } } ]
		);
	} );
	it( "correctly identifies 'deaf-mute'", () => {
		const mockPaper = new Paper( "This sentence contains deaf-mute." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains deaf-mute." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "deaf" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>deaf-mute</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>deaf</i>. " +
			"<a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains deaf-mute.</yoastmark>",
			original: "This sentence contains deaf-mute." } } ]
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
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains brain-damaged.</yoastmark>",
			original: "This sentence contains brain-damaged." } } ]
		);
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
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains differently-abled.</yoastmark>",
			original: "This sentence contains differently-abled." } } ]
		);
	} );
} );

describe( "a test for targeting non-inclusive phrases in disability assessments", () => {
	it( "should return the appropriate score and feedback string for: 'binge'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "binge" ) );
		const mockPaper = new Paper( "I binge on ice cream." );
		const mockResearcher = Factory.buildMockResearcher( [ "I binge on ice cream." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 6 );
		expect( assessment.getResult().text ).toBe( "Be careful when using <i>binge</i> as it is potentially harmful. " +
			"Unless you are referencing the specific medical condition, consider using another alternative to describe the trait or behavior, " +
			"such as <i>indulging, satuating, wallowing, spree, marathon</i>. <a href='https://yoa.st/inclusive-language-disability' " +
			"target='_blank'>Learn more.</a>" );
	} );
	it( "should return the appropriate score and feedback string for: 'daft'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "daft" ) );
		const mockPaper = new Paper( "That's a daft idea!" );
		const mockResearcher = Factory.buildMockResearcher( [ "That's a daft idea!" ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 6 );
		expect( assessment.getResult().text ).toBe( "Be careful when using <i>daft</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>dense, uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i>." +
			" <a href='https://yoa.st/inclusive-language-disability' target='_blank'>Learn more.</a>" );
	} );
	it( "should return the appropriate score and feedback string for: 'imbecile'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "imbecile" ) );
		const mockPaper = new Paper( "hospitals for the imbecile and insane people" );
		const mockResearcher = Factory.buildMockResearcher( [ "hospitals for the imbecile and insane" ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 3 );
		expect( assessment.getResult().text ).toBe( "Avoid using <i>imbecile</i> as it is derogatory. Consider using an alternative, " +
			"such as <i>uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i> instead. " +
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
	it( "correctly identifies 'OCD', which is only recognized when preceded by a form of 'to be' + quantifier", () => {
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
	it( "does not identify 'OCD' when not preceded by a form of 'to be'", () => {
		const mockPaper = new Paper( "This person has OCD" );
		const mockResearcher = Factory.buildMockResearcher( [ "This person has OCD" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "OCD" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
} );

