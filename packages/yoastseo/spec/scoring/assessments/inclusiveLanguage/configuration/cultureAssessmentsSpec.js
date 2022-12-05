import Paper from "../../../../../src/values/Paper";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/cultureAssessments";
import Factory from "../../../../specHelpers/factory.js";

describe( "Culture Assessments", () => {
	it( "should target only capitalized non-inclusive phrases when the caseSensitive flag is set", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firstWorld" ) );

		const mockPaper = new Paper( "These are my First World problems." );
		const mockResearcher = Factory.buildMockResearcher( [ "These are my First World problems." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
	} );
	it( "should not target non-capitalized phrases when the caseSensitive flag is set", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firstWorld" ) );

		const mockPaper = new Paper( "This is the first world I created." );
		const mockResearcher = Factory.buildMockResearcher( [ "This is the first world I created." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
	} );

	it( "should not target First World when followed by exception words.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firstWorld" ) );
		[ "War", "war", "Assembly", "assembly" ].map( ( exceptionWord ) => {
			const testSentence = `This is the First World ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );

	it( "should not target Third World when followed by exception words.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "thirdWorld" ) );
		[ "War", "war", "Quarterly", "quarterly", "country" ].map( ( exceptionWord ) => {
			const testSentence = `This is the Third World ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );

	it( "should not target gyp when it is a noun.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "gypVerb" ) );
		[ "a", "the" ].map( ( article ) => {
			const testSentence = `This is ${article} gyp.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );

			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );

	it( "should target the word 'oriental' and return score 6", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "oriental" ) );

		const mockPaper = new Paper( "I love oriental rugs." );
		const mockResearcher = Factory.buildMockResearcher( [ "I love oriental rugs." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 6 );
		expect( assessment.getResult().text ).toBe( "Be careful when using <i>oriental</i> as it is potentially harmful. " +
			"Unless you are referring to objects or animals, consider using an alternative, such as <i>Asian</i>. " +
			"When possible, be more specific (e.g. <i>East Asian</i>). " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>" );
	} );

	it( "should target the word 'blacklist' and return score 3", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "blacklist" ) );

		const mockPaper = new Paper( "Some companies are in the blacklist." );
		const mockResearcher = Factory.buildMockResearcher( [ "Some companies are in the blacklist." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 3 );
		expect( assessment.getResult().text ).toBe( "Avoid using <i>blacklist</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>blocklist, denylist, faillist, redlist</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>" );
	} );
} );
