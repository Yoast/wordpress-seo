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
		const texts = [
			"Dayak Tribe is the original tribe for people who live in Kalimantan.",
			"The Islands of Mentawai are home to the primitive tribes of Sumatra" ];
		const feedbacks = [
			"Be careful when using <i>tribe</i> as it is potentially harmful. Consider using an alternative, such as <i>group, " +
			"cohort, crew, league, guild, team, union</i> instead, unless you are referring to a culture that uses this term. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
			"Be careful when using <i>tribes</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>groups, cohorts, crews, leagues, guilds, teams, unions</i> instead, unless you are referring to a culture that uses this term. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
	} );
	it( "should return the appropriate score and feedback string for: 'guru' and its other forms", () => {
		const identifiers = [ "guru", "gurus" ];
		const texts = [
			"The tradition of the guru is also found in Jainism.",
			"Hindu Female Gurus in India and the United States" ];
		const feedbacks = [
			"Be careful when using <i>guru</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>mentor, doyen, coach, mastermind, virtuoso, expert</i> instead, " +
			"unless you are referring to the culture in which this term originated. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Be careful when using <i>gurus</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>mentors, doyens, coaches, masterminds, virtuosos, experts</i> instead, " +
			"unless you are referring to the culture in which this term originated. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
	} );
	it( "should return the appropriate score and feedback string for: 'gyp' and its other forms", () => {
		const identifiers = [ "gyp", "gyps", "gypped", "gypping" ];
		const texts = [
			"They'll try to gyp you if you don't know what you're doing.",
			"These are gyps.",
			"The cab driver gypped me out of ten bucks",
			"The cab driver is gypping me out of ten bucks",
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
			"target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
	it( "should return the appropriate score and feedback string for: 'gypsy' and its other forms", () => {
		const identifiers = [ "gypsy", "gypsies" ];
		const texts = [
			"In North America, the word Gypsy is most commonly used as a reference to Romani ethnicity.",
			"In the English language, the Romani people are widely known by the exonym Gypsies.",
		];
		const feedbacks = [
			"Be careful when using <i>gypsy</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>Romani, Romani person</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
			"If you are referring to a lifestyle rather than the ethnic group or their music, consider using " +
			"an alternative such as <i>traveler, wanderer, free-spirited</i>." +
			" <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
			"Be careful when using <i>gypsies</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>Romani, Romani people</i>, unless referring to someone who explicitly wants to be referred to " +
			"with this term. If you are referring to a lifestyle rather than the ethnic group or their music, " +
			"consider using an alternative such as <i>travelers, wanderers, free-spirited</i>. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
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
			"25 Celebrities Who Were Blacklisted From Hollywood",
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
			"target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
	// Skipped for now. It's a bug another issue will solve.
	xit( "should return the appropriate score and feedback string for: 'Asian-American' and its other forms", () => {
		const identifiers = [ "Asian-American", "Asian-Americans" ];
		const texts = [
			"An Asian-American",
			"The Asian-Americans",
		];
		const feedbacks = [
			"Avoid using <i>Asian-American</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>Asian American</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>Asian-Americans</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>Asian Americans</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
	// Skipped for now. It's a bug another issue will solve.
	xit( "should return the appropriate score and feedback string for: 'African-American' and its other forms", () => {
		const identifiers = [ "African-American", "African-Americans" ];
		const texts = [
			"An African-American",
			"The African-Americans",
		];
		const feedbacks = [
			"Avoid using <i>African-American</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>African American, Black, American of African descent</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>African-Americans</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>African Americans, Black, Americans of African descent</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
	it( "should return the appropriate score and feedback string for: 'whitelist' and its other forms", () => {
		const identifiers = [ "whitelist", "whitelists", "whitelisting", "whitelisted" ];
		const texts = [
			"Some companies are in the whitelist.",
			"The govt whitelists the person.",
			"What you should know about Whitelisting",
			"25 Celebrities Who Were Whitelisted From Hollywood",
		];
		const feedbacks = [
			"Avoid using <i>whitelist</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>allowlist</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>whitelists</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>allowlists</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>whitelisting</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>allowlisting</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
			"Avoid using <i>whitelisted</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>allowlisted</i>. <a href='https://yoa.st/inclusive-language-culture' " +
			"target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
	it( "should return the appropriate score and feedback string for: 'eskimo' and its other forms", () => {
		// Singular and plural "eskimo" is one entry under the same identifier.
		const identifiers = [ "eskimo", "eskimo" ];
		const texts = [
			"Eskimo (/ˈɛskɪmoʊ/) is an exonym used to refer to two closely related Indigenous peoples.",
			"Today Sirenik Eskimos speak Siberian Yupik language and/or Russian.",
		];
		const feedbacks = [
			"Be careful when using <i>eskimo</i> as it is potentially harmful. Consider using an alternative, " +
			"such as the specific name of the Indigenous community (for example, <i>Inuit</i>), unless referring to someone " +
			"who explicitly wants to be referred to with this term. <a href='https://yoa.st/inclusive-language-culture'" +
			" target='_blank'>Learn more.</a>",
			"Be careful when using <i>eskimos</i> as it is potentially harmful. Consider using an alternative, such as " +
			"the specific name of the Indigenous community (for example, <i>Inuit</i>), unless referring to someone " +
			"who explicitly wants to be referred to with this term. <a href='https://yoa.st/inclusive-language-culture'" +
			" target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
	} );
	it( "should return the appropriate score and feedback string for: 'colored person' and 'colored people", () => {
		const identifiers = [ "coloredPerson", "coloredPeople" ];
		const texts = [
			"Working Like a Colored Person",
			"The National Association for the Advancement of Colored People",
		];
		const feedbacks = [
			"Avoid using <i>colored person</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>person of color, POC, BIPOC</i>. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
			"Avoid using <i>colored people</i> as it is potentially harmful. Consider using an alternative, such as <i>people of color, " +
			"POC, BIPOC</i>. <a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
	it( "should return the appropriate score and feedback string for: 'developing country' and its plural form", () => {
		const identifiers = [ "underdevelopedCountry", "underdevelopedCountries" ];
		const texts = [
			"A developing country is not an underdeveloped country",
			"Developing countries are not underdeveloped countries",
		];
		const feedbacks = [
			"Avoid using <i>underdeveloped country</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>developing country</i> instead or be more specific about what aspect this word refers to. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
			"Avoid using <i>underdeveloped countries</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>developing countries</i> instead or be more specific about what aspect this word refers to. " +
			"<a href='https://yoa.st/inclusive-language-culture' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
} );
