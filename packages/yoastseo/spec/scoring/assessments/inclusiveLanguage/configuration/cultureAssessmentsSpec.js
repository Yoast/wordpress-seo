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
} );

describe( "a test for targetting non-inclusive phrases in culture assessments", () => {
	it( "should return the appropriate score and feedback string for: 'tribe'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "tribe" ) );
		const mockPaper = new Paper( "Dayak Tribe is the original tribe for people who live in Kalimantan." );
		const mockResearcher = Factory.buildMockResearcher( [ "Dayak Tribe is the original tribe for people who live in Kalimantan." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 6 );
		expect( assessment.getResult().text ).toBe( "Be careful when using <i>tribe</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>group, cohort, crew, league, guild, team, union</i> instead, " +
			"unless you are referring to a culture that uses this term. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>" );
	} );
	it( "should return the appropriate score and feedback string for: 'guru'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "guru" ) );
		const mockPaper = new Paper( "The tradition of the guru is also found in Jainism." );
		const mockResearcher = Factory.buildMockResearcher( [ "The tradition of the guru is also found in Jainism." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 6 );
		expect( assessment.getResult().text ).toBe( "Be careful when using <i>guru</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>mentor, doyen, coach, mastermind, virtuoso, expert</i> instead, unless you are referring to" +
			" the culture in which this term originated. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>" +
			"Learn more.</a>" );
	} );
	it( "should return the appropriate score and feedback string for: 'gyp'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "gypVerb" ) );
		const mockPaper = new Paper( "You better watch out; they'll try to gyp you if you don't know what you're doing." );
		const mockResearcher = Factory.buildMockResearcher( [ "You better watch out; they'll try to gyp you if you don't know what you're doing." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 3 );
		expect( assessment.getResult().text ).toBe( "Avoid using <i>gyp</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>to cheat someone, to trick someone</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>" );
	} );
	it( "should return the appropriate score and feedback string for: 'savage'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "savage" ) );
		const mockPaper = new Paper( "Although it didn't look very good, it tasted absolutely savage." );
		const mockResearcher = Factory.buildMockResearcher( [ "Although it didn't look very good, it tasted absolutely savage." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 3 );
		expect( assessment.getResult().text ).toBe( "Avoid using <i>savage</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>severe, dreadful, untamed, brutal, fearless, fierce, brilliant</i>." +
			" <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>" );
	} );
} );
