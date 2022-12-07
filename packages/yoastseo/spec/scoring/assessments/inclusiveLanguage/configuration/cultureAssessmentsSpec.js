import Paper from "../../../../../src/values/Paper";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/cultureAssessments";
import Factory from "../../../../specHelpers/factory.js";
import { testMultipleForms } from "../testHelpers/testHelpers";

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

	it( "should not target exotic when followed by exception words.", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "exotic" ) );
		[ "shorthair", "longhair" ].map( ( exceptionWord ) => {
			const testSentence = `It is common to have exotic ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );
			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );
} );

describe( "a test for targeting non-inclusive phrases in culture assessments", () => {
	it( "should return the appropriate score and feedback string for: 'tribe' and its other forms", () => {
		const identifiers = [ "tribe", "tribes" ];
		const texts = [ "Dayak Tribe is the original tribe for people who live in Kalimantan.",
			"The Islands of Mentawai are home to the primitive tribes of Sumatra" ];
		const feedbacks = [
			"Be careful when using <i>tribe</i> as it is potentially harmful. Consider using an alternative, such as <i>group, " +
			"cohort, crew, league, guild, team, union</i> instead, unless you are referring to a culture that uses this term. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
			"Be careful when using <i>tribes</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>groups, cohorts, crews, leagues, guilds, teams, unions</i> instead, unless you are referring to a culture that uses this term. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>"
		];

		testMultipleForms( texts, identifiers, feedbacks, 6 );
	} );
	it( "should return the appropriate score and feedback string for: 'guru' and its other forms", () => {
		const identifiers = [ "guru", "gurus" ];
		const texts = [ "The tradition of the guru is also found in Jainism.",
			"Hindu Female Gurus in India and the United States" ];
		const feedbacks = [
			"Be careful when using <i>guru</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>mentor, doyen, coach, mastermind, virtuoso, expert</i> instead, " +
			"unless you are referring to the culture in which this term originated. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Be careful when using <i>guru</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>mentor, doyen, coach, mastermind, virtuoso, expert</i> instead, " +
			"unless you are referring to the culture in which this term originated. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>"
		];

		testMultipleForms( texts, identifiers, feedbacks, 6 );
	} );
	it( "should return the appropriate score and feedback string for: 'gyp' and its other forms", () => {
		const identifiers = [ "gyp", "gyps", "gypped", "gypping" ];
		const texts = [
			"They'll try to gyp you if you don't know what you're doing.",
			"These are gyps.",
			"The cab driver gypped me out of ten bucks",
			"The cab driver is gypping me out of ten bucks"
		];
		const feedbacks = [
			"Avoid using <i>gyp</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>fraud, cheat, swindle, rip-off</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>gyps</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>frauds, cheats, swindles, rips-off, rip-offs</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>gypped</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>cheated, swindled, ripped-off</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>gypping</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>cheating, swindling, ripping-off</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>"
		];

		testMultipleForms( texts, identifiers, feedbacks, 3 );
	} );
	it( "should return the appropriate score and feedback string for: 'savage'", () => {
		const assessment = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "savage" ) );
		const mockPaper = new Paper( "Although it didn't look very good, it tasted absolutely savage." );
		const mockResearcher = Factory.buildMockResearcher( [ "Although it didn't look very good, it tasted absolutely savage." ] );

		expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( true );
		expect( assessment.getResult().score ).toBe( 3 );
		expect( assessment.getResult().text ).toBe( "Avoid using <i>savage</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>severe, dreadful, untamed, brutal, fearless, fierce, brilliant, amazing</i>." +
			" <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>" );
	} );
	it( "should return the appropriate score and feedback string for: 'oriental'", () => {
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

	it( "should return the appropriate score and feedback string for: 'blacklist' and its other forms", () => {
		const identifiers = [ "blacklist", "blacklists", "blacklisting", "blacklisted" ];
		const texts = [
			"Some companies are in the blacklist.",
			"The govt blacklists the person.",
			"What you should know about Blacklisting",
			" 25 Celebrities Who Were Blacklisted From Hollywood"
		];
		const feedbacks = [
			"Avoid using <i>blacklist</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>blocklist, denylist, faillist, redlist</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>blacklists</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>blocklists, denylists, faillists, redlists</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>blacklisting</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>blocklisting, denylisting, faillisting, redlisting</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>blacklisted</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>blocklisted, denylisted, faillisted, redlisted</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>"
		];

		testMultipleForms( texts, identifiers, feedbacks, 3 );
	} );
} );
