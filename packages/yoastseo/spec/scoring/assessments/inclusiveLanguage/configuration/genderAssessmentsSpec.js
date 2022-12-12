import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/genderAssessments";
import Factory from "../../../../specHelpers/factory.js";

describe( "A test for Gender assessments", function() {
	it( "should target non-inclusive phrases", function() {
		const mockPaper = new Paper( "Mankind is so great! I could talk for hours about it." );
		const mockResearcher = Factory.buildMockResearcher( [ "Mankind is so great!", "I could talk for hours about it." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "mankind" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>mankind</i> as it is exclusionary. Consider using an alternative, such as " +
			"<i>individuals, people, persons, human beings, humanity</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "Mankind is so great!",
			marked: "<yoastmark class='yoast-text-mark'>Mankind is so great!</yoastmark>",
		} ) ] );
	} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "Look at those firemen! They're putting out the fire." );
		const mockResearcher = Factory.buildMockResearcher( [ "Look at those firemen!", "They're putting out the fire." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firemen" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>firemen</i> as it can be exclusionary. " +
			"Unless you are sure that the group you refer to only consists of men, use an alternative, such as <i>firefighters</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "Look at those firemen!",
			marked: "<yoastmark class='yoast-text-mark'>Look at those firemen!</yoastmark>",
		} ) ] );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "Look at those firefighters! They're putting out the fire." );
		const mockResearcher = Factory.buildMockResearcher( [ "Look at those firefighters!", "They're putting out the fire." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firemen" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should return proper feedback without an alternative given", function() {
		const mockPaper = new Paper( "She's acting like a shemale." );
		const mockResearcher = Factory.buildMockResearcher( [ "She's acting like a shemale." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "shemale" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>shemale</i> as it is derogatory. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "She's acting like a shemale.",
			marked: "<yoastmark class='yoast-text-mark'>She's acting like a shemale.</yoastmark>",
		} ) ] );
	} );

	it( "correctly identifies 'the transgender' which is only recognized when followed by participle or simple past tense", () => {
		const mockPaper = new Paper( "the transgender worked, the better they are." );
		const mockResearcher = Factory.buildMockResearcher( [ "The transgender worked, the better they are." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the transgender</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>transgender person</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The transgender worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>The transgender worked, the better they are.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the transgender', which is only recognized when followed by a function word", () => {
		const mockPaper = new Paper( "The transgender however, did not go to the zoo." );
		const mockResearcher = Factory.buildMockResearcher( [ "The transgender however, did not go to the zoo." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the transgender</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>transgender person</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The transgender however, did not go to the zoo.",
			marked: "<yoastmark class='yoast-text-mark'>The transgender however, did not go to the zoo.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the transgender', which is only recognized when followed by a punctuation mark", () => {
		const mockPaper = new Paper( "I have always loved the transgender!" );
		const mockResearcher = Factory.buildMockResearcher( [ "I have always loved the transgender!" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the transgender</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>transgender person</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I have always loved the transgender!",
			marked: "<yoastmark class='yoast-text-mark'>I have always loved the transgender!</yoastmark>",
		} ) ] );
	} );
	it( "does not identify 'the transgender' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "The transgender person walks on the street." );
		const mockResearcher = Factory.buildMockResearcher( [ "The transgender person walks on the street." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
	it( "correctly identifies 'female-bodied'", () => {
		const mockPaper = new Paper( "This sentence contains female-bodied." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains female-bodied." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "femaleBodied" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>female-bodied</i> as it is potentially exclusionary. " +
			"Consider using an alternative, such as <i>assigned female at birth</i> " +
			"if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>female-bodied</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains female-bodied.</yoastmark>",
			original: "This sentence contains female-bodied." } } ]
		);
	} );
	it( "correctly identifies 'male-bodied'", () => {
		const mockPaper = new Paper( "This sentence contains male-bodied." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains male-bodied." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "maleBodied" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>male-bodied</i> as it is potentially exclusionary. " +
			"Consider using an alternative, such as <i>assigned male at birth</i> " +
			"if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>male-bodied</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains male-bodied.</yoastmark>",
			original: "This sentence contains male-bodied." } } ]
		);
	} );
	it( "correctly identifies 'man-hours'", () => {
		const mockPaper = new Paper( "This sentence contains man-hours." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains man-hours." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "manHours" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>man-hours</i> as it is exclusionary. " +
			"Consider using an alternative, such as <i>person-hours, business hours</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains man-hours.</yoastmark>",
			original: "This sentence contains man-hours." } } ]
		);
	} );
	it( "correctly identifies 'female-to-male'", () => {
		const mockPaper = new Paper( "This sentence contains 'female-to-male'." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains 'female-to-male'." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "femaleToMale" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>female-to-male</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>trans man, transgender man</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains 'female-to-male'.</yoastmark>",
			original: "This sentence contains 'female-to-male'." } } ]
		);
	} );
	it( "correctly identifies 'male-to-female'", () => {
		const mockPaper = new Paper( "This sentence contains 'male-to-female'." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains 'male-to-female'." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "maleToFemale" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>male-to-female</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>trans woman, transgender woman</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains 'male-to-female'.</yoastmark>",
			original: "This sentence contains 'male-to-female'." } } ]
		);
	} );
	it( "correctly identifies 'he-she'", () => {
		const mockPaper = new Paper( "This sentence contains he-she." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains he-she." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "heShe" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>he-she</i> as it is derogatory. <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains he-she.</yoastmark>",
			original: "This sentence contains he-she." } } ]
		);
	} );
	it( "correctly identifies 'she-male'", () => {
		const mockPaper = new Paper( "This sentence contains she-male." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains she-male." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "shemale" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>she-male</i> as it is derogatory. <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains she-male.</yoastmark>",
			original: "This sentence contains she-male." } } ]
		);
	} );
	it( "correctly identifies 'man-made'", () => {
		const mockPaper = new Paper( "This sentence contains man-made." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains man-made." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "manMade" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>man-made</i> as it is exclusionary. Consider using an alternative, such as <i>artificial, synthetic, machine-made</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains man-made.</yoastmark>",
			original: "This sentence contains man-made." } } ]
		);
	} );
	it( "correctly identifies 'FTM'", () => {
		const mockPaper = new Paper( "This sentence contains FTM." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains FTM." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "femaleToMale" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>ftm</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>trans man, transgender man</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains FTM.</yoastmark>",
			original: "This sentence contains FTM." } } ]
		);
	} );
	it( "correctly identifies 'MTF'", () => {
		const mockPaper = new Paper( "This sentence contains MTF." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains MTF." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "maleToFemale" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>mtf</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>trans woman, transgender woman</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual(   [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains MTF.</yoastmark>",
			original: "This sentence contains MTF." } } ]
		);
	} );
} );
