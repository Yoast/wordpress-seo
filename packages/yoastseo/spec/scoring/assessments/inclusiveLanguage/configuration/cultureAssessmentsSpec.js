import Paper from "../../../../../src/values/Paper";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/cultureAssessments";
import Factory from "../../../../../src/helpers/factory.js";
import { testInclusiveLanguageAssessments } from "../testHelpers/testHelper";

describe( "A test for Culture Assessments", () => {
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
		[ "shorthair", "shorthairs", "longhair", "longhairs" ].map( ( exceptionWord ) => {
			const testSentence = `It is common to have exotic ${exceptionWord}.`;
			const mockPaper = new Paper( testSentence );
			const mockResearcher = Factory.buildMockResearcher( [ testSentence ] );
			expect( assessment.isApplicable( mockPaper, mockResearcher ) ).toBe( false );
		} );
	} );
} );

describe( "a test for targeting non-inclusive phrases in culture assessments", () => {
	it( "should return the appropriate score and feedback string for: 'Third World'", () => {
		const testData = [
			{
				identifier: "thirdWorld",
				text: "There are bigger problems in the Third World.",
				expectedFeedback: "Avoid using <i>Third World</i> as it is potentially harmful. Consider using an alternative," +
					" such as the specific name for the region or country." +
					" <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'Third World'", () => {
		const testData = [
			{
				identifier: "exotic",
				text: "They are considered exotic here.",
				expectedFeedback: "Be careful when using <i>exotic</i> as it is potentially harmful. Unless you are referring to animals, " +
					"consider using an alternative, such as <i>unfamiliar, foreign, peculiar, fascinating, alluring, bizarre, non-native, " +
					"introduced</i>. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'sherpa'", () => {
		const testData = [
			{
				identifier: "sherpa",
				text: "My sherpa made me this smoothie.",
				expectedFeedback: "Be careful when using <i>sherpa</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>commander, coach, mastermind, coach, mentor</i> instead, unless you are referring to the culture in which this term " +
					"originated. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'sherpa'", () => {
		const testData = [
			{
				identifier: "sherpa",
				text: "My sherpa made me this smoothie.",
				expectedFeedback: "Be careful when using <i>sherpa</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>commander, coach, mastermind, coach, mentor</i> instead, unless you are referring to the culture in which this term " +
					"originated. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'non-white'", () => {
		const testData = [
			{
				identifier: "nonWhite",
				text: "Many people are non-white.",
				expectedFeedback: "Avoid using <i>non-white</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>people of color, POC, BIPOC</i> or specifying the racial groups mentioned. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'oriental'", () => {
		const testData = [
			{
				identifier: "oriental",
				text: "Oriental culture is known for it's traditions.",
				expectedFeedback: "Be careful when using <i>oriental</i> as it is potentially harmful. Unless you are referring to objects or " +
					"animals, consider using an alternative, such as <i>Asian</i>. When possible, be more specific (e.g. <i>East Asian</i>). " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'White race'", () => {
		const testData = [
			{
				identifier: "whiteRace",
				text: "Hard to say what the White race implies.",
				expectedFeedback: "Avoid using <i>the White race</i> as it is potentially harmful. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'white list'", () => {
		const testData = [
			{
				identifier: "whitelist",
				text: "Everyone on the whitelist was present.",
				expectedFeedback: "Avoid using <i>whitelist</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>allowlist</i>. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "whitelists",
				text: "Everyone on the whitelists was present.",
				expectedFeedback: "Avoid using <i>whitelists</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>allowlists</i>. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "whitelisting",
				text: "Whitelisting is not an option.",
				expectedFeedback: "Avoid using <i>whitelisting</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>allowlisting</i>. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "whitelisted",
				text: "Everyone she knows was whitelisted.",
				expectedFeedback: "Avoid using <i>whitelisted</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>allowlisted</i>. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'blacklist'", () => {
		const testData = [
			{
				identifier: "blacklist",
				text: "Everyone on the blacklist was absent.",
				expectedFeedback: "Avoid using <i>blacklist</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>blocklist, denylist, faillist, redlist</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "blacklists",
				text: "There are blacklists for childcare services.",
				expectedFeedback: "Avoid using <i>blacklists</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>blocklists, denylists, faillists, redlists</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "blacklisting",
				text: "Blacklisting is not an option.",
				expectedFeedback: "Avoid using <i>blacklisting</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>blocklisting, denylisting, faillisting, redlisting</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "blacklisted",
				text: "Everyone she knows was blacklisted.",
				expectedFeedback: "Avoid using <i>blacklisted</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>blocklisted, denylisted, faillisted, redlisted</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'White race'", () => {
		const testData = [
			{
				identifier: "whiteRace",
				text: "Hard to say what the White race implies.",
				expectedFeedback: "Avoid using <i>the White race</i> as it is potentially harmful. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'tribe' and its plural form", () => {
		const testData = [
			{
				identifier: "tribe",
				text: "Dayak Tribe is the original tribe for people who live in Kalimantan.",
				expectedFeedback: "Be careful when using <i>tribe</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>group, " +
					"cohort, crew, league, guild, team, union</i> instead, unless you are referring to a culture that uses this term. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "tribes",
				text: "The Islands of Mentawai are home to the primitive tribes of Sumatra",
				expectedFeedback: "Be careful when using <i>tribes</i> as it is potentially harmful. " +
					"Consider using an alternative, such as " +
					"<i>groups, cohorts, crews, leagues, guilds, teams, unions</i> instead, " +
					"unless you are referring to a culture that uses this term. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'guru' and its plural form", () => {
		const testData = [
			{
				identifier: "guru",
				text: "The tradition of the guru is also found in Jainism.",
				expectedFeedback: "Be careful when using <i>guru</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>mentor, doyen, coach, mastermind, virtuoso, expert</i> instead, " +
					"unless you are referring to the culture in which this term originated. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "gurus",
				text: "Hindu Female Gurus in India and the United States",
				expectedFeedback: "Be careful when using <i>gurus</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>mentors, doyens, coaches, masterminds, virtuosos, experts</i> instead, " +
					"unless you are referring to the culture in which this term originated. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'gyp' and its other forms", () => {
		const testData = [
			{
				identifier: "gyp",
				text: "They'll try to gyp you if you don't know what you're doing.",
				expectedFeedback: "Avoid using <i>gyp</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>fraud, cheat, swindle, rip-off</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "gyps",
				text: "These are gyps.",
				expectedFeedback: "Avoid using <i>gyps</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>frauds, cheats, swindles, rips off, rip-offs</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "gypped",
				text: "The cab driver gypped me out of ten bucks",
				expectedFeedback: "Avoid using <i>gypped</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>cheated, swindled, ripped off</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "gypping",
				text: "The cab driver is gypping me out of ten bucks",
				expectedFeedback: "Avoid using <i>gypping</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>cheating, swindling, ripping off</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'gypsy' / 'gipsy' and their plural forms", () => {
		const testData = [
			{
				identifier: "gypsy",
				text: "In North America, the word Gypsy is most commonly used as a reference to Romani ethnicity.",
				expectedFeedback: "Be careful when using <i>gypsy</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>Rom, Roma person, Romani, Romani person</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"If you are referring to a lifestyle rather than the ethnic group or their music, consider using " +
					"an alternative such as <i>traveler, wanderer, free-spirited</i>." +
					" <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "gypsy",
				text: "In North America, the word Gipsy is most commonly used as a reference to Romani ethnicity.",
				expectedFeedback: "Be careful when using <i>gipsy</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>Rom, Roma person, Romani, Romani person</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"If you are referring to a lifestyle rather than the ethnic group or their music, consider using " +
					"an alternative such as <i>traveler, wanderer, free-spirited</i>." +
					" <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "gypsies",
				text: "In the English language, the Romani people are widely known by the exonym Gypsies.",
				expectedFeedback: "Be careful when using <i>gypsies</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>Roma, Romani, Romani people</i>, unless referring to someone who explicitly wants to be referred to " +
					"with this term. If you are referring to a lifestyle rather than the ethnic group or their music, " +
					"consider using an alternative such as <i>travelers, wanderers, free-spirited</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "gypsies",
				text: "In the English language, the Romani people are widely known by the exonym Gipsies.",
				expectedFeedback: "Be careful when using <i>gipsies</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>Roma, Romani, Romani people</i>, unless referring to someone who explicitly wants to be referred to " +
					"with this term. If you are referring to a lifestyle rather than the ethnic group or their music, " +
					"consider using an alternative such as <i>travelers, wanderers, free-spirited</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'blacklist' and its other forms", () => {
		const testData = [
			{
				identifier: "blacklist",
				text: "Some companies are in the blacklist.",
				expectedFeedback: "Avoid using <i>blacklist</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>blocklist, denylist, faillist, redlist</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "blacklists",
				text: "The govt blacklists the person.",
				expectedFeedback: "Avoid using <i>blacklists</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>blocklists, denylists, faillists, redlists</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "blacklisting",
				text: "What you should know about Blacklisting",
				expectedFeedback: "Avoid using <i>blacklisting</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>blocklisting, denylisting, faillisting, redlisting</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "blacklisted",
				text: "25 Celebrities Who Were Blacklisted From Hollywood",
				expectedFeedback: "Avoid using <i>blacklisted</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>blocklisted, denylisted, faillisted, redlisted</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'Asian-American' and its other forms", () => {
		const testData = [
			{
				identifier: "asianAmerican",
				text: "An Asian-American",
				expectedFeedback: "Avoid using <i>Asian-American</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>Asian American</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "asianAmericans",
				text: "The Asian-Americans",
				expectedFeedback: "Avoid using <i>Asian-Americans</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>Asian Americans</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'African-American' and its other forms", () => {
		const testData = [
			{
				identifier: "africanAmerican",
				text: "An African-American",
				expectedFeedback: "Avoid using <i>African-American</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>African American, Black, American of African descent</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "africanAmericans",
				text: "The African-Americans",
				expectedFeedback: "Avoid using <i>African-Americans</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>African Americans, Black, Americans of African descent</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "Does not identify 'African American' without hyphen", () => {
		const mockPaper = new Paper( "This sentence contains African American." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains African American." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "africanAmerican" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
	it( "Does not identify 'African-american' without capital", () => {
		const mockPaper = new Paper( "This sentence contains African-american." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains African-american." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "africanAmerican" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
	it( "Does not identify 'Asian American' without hyphen", () => {
		const mockPaper = new Paper( "This sentence contains Asian American." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains Asian American." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "asianAmerican" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
	it( "Does not identify 'Asian-american' without capital", () => {
		const mockPaper = new Paper( "This sentence contains Asian-american." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains Asian-american." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "asianAmerican" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
	it( "should return the appropriate score and feedback string for: 'African-American' and its other forms", () => {
		const testData = [
			{
				identifier: "africanAmerican",
				text: "An African-American",
				expectedFeedback: "Avoid using <i>African-American</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>African American, Black, American of African descent</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "africanAmericans",
				text: "The African-Americans",
				expectedFeedback: "Avoid using <i>African-Americans</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>African Americans, Black, Americans of African descent</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "correctly identifies 'pow-wow'", () => {
		const mockPaper = new Paper( "This sentence contains pow-wow." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains pow-wow." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "powWow" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>pow-wow</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>chat, brief conversation, brainstorm, huddle</i> instead, " +
			"unless you are referring to the culture in which this term originated. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>"

		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains pow-wow.</yoastmark>",
			original: "This sentence contains pow-wow." } } ]
		);
	} );
	it( "correctly identifies 'first-world'", () => {
		const mockPaper = new Paper( "This sentence contains first-world." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains first-world." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firstWorldHyphen" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>first-world</i> as it is potentially harmful. Consider using an alternative," +
			" such as the specific name for the region or country. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains first-world.</yoastmark>",
			original: "This sentence contains first-world." } } ]
		);
	} );
	it( "correctly identifies 'first world countries'", () => {
		const mockPaper = new Paper( "Many first world countries adopted the policy." );
		const mockResearcher = Factory.buildMockResearcher( [ "first world countries" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firstWorldCountries" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>first world countries</i> as it is potentially harmful. Consider using an alternative, " +
			"such as the specific name for the regions or countries. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>"
		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>first world countries</yoastmark>",
			original: "first world countries" } } ]
		);
	} );
	it( "correctly identifies 'third-world country'", () => {
		const mockPaper = new Paper( "This sentence contains third-world country." );
		const mockResearcher = Factory.buildMockResearcher( [ "This sentence contains third-world country." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "third-worldCountry" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeTruthy();
		const assessmentResult = assessor.getResult();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>third-world country</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>low-income country, developing country</i>. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>"

		);
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ { _properties: {
			fieldsToMark: [],
			marked: "<yoastmark class='yoast-text-mark'>This sentence contains third-world country.</yoastmark>",
			original: "This sentence contains third-world country." } } ]
		);
	} );
	it( "should return the appropriate score and feedback string for: 'whitelist' and its other forms", () => {
		const testData = [
			{
				identifier: "whitelist",
				text: "Some companies are in the whitelist.",
				expectedFeedback: "Avoid using <i>whitelist</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>allowlist</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "whitelists",
				text: "The govt whitelists the person.",
				expectedFeedback: "Avoid using <i>whitelists</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>allowlists</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "whitelisting",
				text: "What you should know about Whitelisting",
				expectedFeedback: "Avoid using <i>whitelisting</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>allowlisting</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "whitelisted",
				text: "25 Celebrities Who Were Whitelisted From Hollywood",
				expectedFeedback: "Avoid using <i>whitelisted</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>allowlisted</i>. <a href='https://yoa.st/inclusive-language-culture' " +
					"target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'eskimo' and its other forms", () => {
		// Singular and plural "eskimo" is one entry under the same identifier.
		const testData = [
			{
				identifier: "eskimo",
				text: "Eskimo (/ˈɛskɪmoʊ/) is an exonym used to refer to two closely related Indigenous peoples.",
				expectedFeedback: "Be careful when using <i>eskimo</i> as it is potentially harmful. Consider using an alternative, " +
					"such as the specific name of the Indigenous community (for example, <i>Inuit</i>), unless referring to someone " +
					"who explicitly wants to be referred to with this term. <a href='https://yoa.st/inclusive-language-culture'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "eskimo",
				text: "Today Sirenik Eskimos speak Siberian Yupik language and/or Russian.",
				expectedFeedback: "Be careful when using <i>eskimos</i> as it is potentially harmful. Consider using an alternative, such as " +
					"the specific name of the Indigenous community (for example, <i>Inuit</i>), unless referring to someone " +
					"who explicitly wants to be referred to with this term. <a href='https://yoa.st/inclusive-language-culture'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'colored person' and 'colored people", () => {
		const testData = [
			{
				identifier: "coloredPerson",
				text: "Working Like a Colored Person",
				expectedFeedback: "Avoid using <i>colored person</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>person of color, POC, BIPOC</i>. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "coloredPeople",
				text: "The National Association for the Advancement of Colored People",
				expectedFeedback: "Avoid using <i>colored people</i> as it is potentially harmful. Consider using an alternative," +
					" such as <i>people of color, " +
					"POC, BIPOC</i>. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'American Indian' and its plural forms", () => {
		// Both forms of American Indian have one identifier
		const testData = [
			{
				identifier: "americanIndians",
				text: "An American Indian is an indigenous person in USA.",
				expectedFeedback: "Be careful when using <i>American Indian</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>Native American(s), Indigenous peoples of America</i>, unless referring to someone " +
					"who explicitly wants to be referred to with this term. <a href='https://yoa.st/inclusive-language-culture'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "americanIndians",
				text: "American Indians are one of the most known examples of Indigenous people.",
				expectedFeedback: "Be careful when using <i>American Indians</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>Native American(s), Indigenous peoples of America</i>, unless referring to someone " +
					"who explicitly wants to be referred to with this term. <a href='https://yoa.st/inclusive-language-culture'" +
					" target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'mulatto' and its plural forms", () => {
		// Both forms of mulatto have one identifier
		const testData = [
			{
				identifier: "mulatto",
				text: "Their son is a mulatto.",
				expectedFeedback: "Avoid using <i>mulatto</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>mixed, biracial, multiracial</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "mulatto",
				text: "There started to be more mulattos at that time.",
				expectedFeedback: "Avoid using <i>mulattos</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>mixed, biracial, multiracial</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'savage'", () => {
		const testData = [
			{
				identifier: "savage",
				text: "That joke was savage.",
				expectedFeedback: "Avoid using <i>savage</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>severe, dreadful, untamed, brutal, fearless, fierce, brilliant, amazing</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'civilized'", () => {
		const testData = [
			{
				identifier: "civilized",
				text: "They tried to discuss it like civilized people.",
				expectedFeedback: "Avoid using <i>civilized</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>proper, well-mannered, enlightened, respectful</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'primitive'", () => {
		const testData = [
			{
				identifier: "primitive",
				text: "The whole set up was primitive.",
				expectedFeedback: "Avoid using <i>primitive</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>early, rudimentary</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'low man on the totem pole'", () => {
		const testData = [
			{
				identifier: "lowManOnTheTotemPole",
				text: "It's demanding to expect a low man on the totem pole to bring real change.",
				expectedFeedback: "Avoid using <i>low man on the totem pole</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>person of lower rank, junior-level</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'low man on the totem pole'", () => {
		const testData = [
			{
				identifier: "lowManOnTheTotemPole",
				text: "It's demanding to expect a low man on the totem pole to bring real change.",
				expectedFeedback: "Avoid using <i>low man on the totem pole</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>person of lower rank, junior-level</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'low man on the totem pole'", () => {
		const testData = [
			{
				identifier: "lowManOnTheTotemPole",
				text: "It's demanding to expect a low man on the totem pole to bring real change.",
				expectedFeedback: "Avoid using <i>low man on the totem pole</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>person of lower rank, junior-level</i>. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'spirit animal'", () => {
		const testData = [
			{
				identifier: "spiritAnimal",
				text: "I admire their talent and confidence. They are my spirit animal.",
				expectedFeedback: "Be careful when using <i>spirit animal</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>inspiration, hero, icon, idol</i> instead, unless you are referring to the culture in which this term originated. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'first world countries'", () => {
		const testData = [
			{
				identifier: "firstWorldCountries",
				text: "It's natural that one would choose one of the first world countries to raise a child.",
				expectedFeedback: "Avoid using <i>first world countries</i> as it is potentially harmful. " +
					"Consider using an alternative, such as the specific name for the regions or countries. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'underdeveloped country' and its plural form", () => {
		const testData = [
			{
				identifier: "underdevelopedCountry",
				text: "A developing country is not an underdeveloped country",
				expectedFeedback: "Avoid using <i>underdeveloped country</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>developing country</i> instead or be more specific about what aspect this word refers to. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "underdevelopedCountries",
				text: "Developing countries are not underdeveloped countries",
				expectedFeedback: "Avoid using <i>underdeveloped countries</i> as it is potentially harmful. Consider using an alternative, " +
					"such as <i>developing countries</i> instead or be more specific about what aspect this word refers to. " +
					"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];

		testInclusiveLanguageAssessments( testData );
	} );
} );
