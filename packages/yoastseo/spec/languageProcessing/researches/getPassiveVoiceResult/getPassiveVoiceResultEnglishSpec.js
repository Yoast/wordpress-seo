import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";

// Tests inspired by the examples on http://www.englishpage.com/verbpage/activepassive.html
// eslint-disable-next-line max-statements
describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (Simple Present)", function() {
		const paper = new Paper( "Once a week, Tom cleans the house." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Present)", function() {
		// Passive: is cleaned.
		const paper = new Paper( "Once a week, the house is cleaned by Tom." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Present Continuous)", function() {
		const paper = new Paper( "Right now, Sarah is writing the letter." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Present Continuous)", function() {
		// Passive: (is) being written.
		const paper = new Paper( "Right now, the letter is being written by Sarah." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Simple Past)", function() {
		const paper = new Paper( "Sam repaired the car." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Past)", function() {
		// Passive: was repaired.
		const paper = new Paper( "The car was repaired by Sam." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Past Continuous)", function() {
		const paper = new Paper( "The salesman was helping the customer when the thief came into the store." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Past Continuous)", function() {
		// Passive: (was) being helped.
		const paper = new Paper( "The customer was being helped by the salesman when the thief came into the store." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Present Perfect)", function() {
		const paper = new Paper( "Many tourists have visited that castle." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Present Perfect)", function() {
		// Passive: (has) been visited.
		const paper = new Paper( "That castle has been visited by many tourists." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Present Perfect Continuous)", function() {
		const paper = new Paper( "Recently, John has been doing the work." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Present Perfect Continuous)", function() {
		// Passive: (has been) being done.
		const paper = new Paper( "Recently, the work has been being done by John." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Past Perfect)", function() {
		const paper = new Paper( "George had repaired many cars before he received his mechanic's license." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Past Perfect)", function() {
		// Passive: (had) been repaired.
		const paper = new Paper( "Many cars had been repaired by George before he received his mechanic's license." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Past Perfect Continuous)", function() {
		const paper = new Paper( "Chef Jones had been preparing the restaurant's fantastic dinners for two years before he moved to Paris." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Past Perfect Continuous)", function() {
		// Passive: (had been) being prepared.
		const paper = new Paper( "The restaurant's fantastic dinners had been being prepared by Chef Jones for two years before he moved to Paris." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Simple Future - will)", function() {
		const paper = new Paper( "Someone will finish the work by 5:00 PM." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Future - will)", function() {
		// Passive: (will) be finished.
		const paper = new Paper( "The work will be finished by 5:00 PM." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Simple Future - be going to)", function() {
		const paper = new Paper( "Sally is going to make a beautiful dinner tonight." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Future - be going to)", function() {
		// Passive: (to) be made.
		const paper = new Paper( "A beautiful dinner is going to be made by Sally tonight." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Continuous - will)", function() {
		const paper = new Paper( "At 8:00 PM tonight, John will be washing the dishes." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Continuous - will)", function() {
		// Passive: (will be) being washed.
		const paper = new Paper( "At 8:00 PM tonight, the dishes will be being washed by John." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Continuous - be going to)", function() {
		const paper = new Paper( "At 8:00 PM tonight, John is going to be washing the dishes." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Continuous - be going to)", function() {
		// Passive: (to be) being washed.
		const paper = new Paper( "At 8:00 PM tonight, the dishes are going to be being washed by John." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect - will)", function() {
		const paper = new Paper( "They will have completed the project before the deadline." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect - will)", function() {
		// Passive: (will have) been completed.
		const paper = new Paper( "The project will have been completed before the deadline." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect - be going to)", function() {
		const paper = new Paper( "They are going to have completed the project before the deadline." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect - be going to)", function() {
		// Passive:  (have) been completed.
		const paper = new Paper( "The project is going to have been completed before the deadline." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect Continuous- will)", function() {
		const paper = new Paper( "The famous artist will have been painting the mural for over six months." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect Continuous- will)", function() {
		// Passive: (will have been) being painted.
		const paper = new Paper( "The mural will have been being painted by the famous artist for over six months." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect Continuous- be going to)", function() {
		const paper = new Paper( "The famous artist is going to have been painting the mural for over six months." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect Continuous- be going to)", function() {
		// Passive: (have been) being painted.
		const paper = new Paper( "The mural is going to have been being painted by the famous artist for over six months." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Used to)", function() {
		const paper = new Paper( "Jerry used to pay the bills." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Used to)", function() {
		// Passive: (to) be paid.
		const paper = new Paper( "The bills used to be paid by Jerry." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Would Always)", function() {
		const paper = new Paper( "My mother would always make the pies." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Would Always)", function() {
		// Passive: (would) be made.
		const paper = new Paper( "The pies would always be made by my mother." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
	it( "returns active voice (Future in the Past - would)", function() {
		const paper = new Paper( "I knew John would finish the work by 5:00 PM." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future in the Past - would)", function() {
		// Passive: (would) be finished.
		const paper = new Paper( "I knew the work would be finished by 5:00 PM." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future in the Past - was going to)", function() {
		const paper = new Paper( "I thought Sally was going to make a beautiful dinner tonight." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future in the Past - was going to)", function() {
		// Passive: (to) be made.
		const paper = new Paper( "I thought a beautiful dinner was going to be made by Sally tonight." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice ( verb with -ing )", function() {
		const paper = new Paper( "He was walking and jumped" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice ( nonverb with -ing )", function() {
		const paper = new Paper( "It was a ceiling and painted" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice ( text between having and verb )", function() {
		// Passive: having painted.
		const paper = new Paper( "He is having the house painted" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice ( no text between having and verb )", function() {
		const paper = new Paper( "He is most notable, having contributed a lot" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice ( combination with left )", function() {
		const paper = new Paper( "The right way is to the left" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice ( combination with left )", function() {
		// Passive: was left.
		const paper = new Paper( "She was left at home" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice ( combination with left )", function() {
		// Passive: was hit.
		const paper = new Paper( "He was hit on the left leg" );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	/* Currently, the only time we verify that 'fit' is a noun, is when it is directly preceded by a determiner.
	 However, 'fit' can also be a noun when it is preceded by an adjective, like in "It was the *right* fit",
	 or by much longer adjectival constructions, like in "It was the *right, but slightly disappointing* fit."
	 We cannot detect adjectives/adjectival constructions yet. Randomly looking for a determiner in the string
	 preceding 'fit' is not an option, because in that case 'fit' would be seen as a noun in sentences
	 like "The model was fit by with the formula method" as well.
	 */
	xit( "returns active voice ( combination with fit )", function() {
		const paper = new Paper( "It was the right fit" );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice ( combination with fit )", function() {
		// Passive: was fit.
		const paper = new Paper( "He was fit with hearing aids" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice ( combination with ing-verbs )", function() {
		const paper = new Paper( "They had apps that are constantly improving, with regular updates based on customer feedback." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice ( combination with cling )", function() {
		// Passive: get (cling) wrapped.
		const paper = new Paper( "They had apps that get constantly cling wrapped" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice ( combination with cling  )", function() {
		// Passive: are (cling) wrapped.
		const paper = new Paper( "They had apps that are constantly cling wrapped." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with quotation marks", function() {
		// Passive: get lost.
		const paper = new Paper( "As a result of that, a lot of blog posts will 'get lost' in a structure that is too flat." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with multiple subsentence, where the passive is not in the last part", function() {
		// Passive: get lost.
		const paper = new Paper( "As a result of that, a lot of blog posts will get lost in a structure that is too flat." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice in a sentence where the indicator is in caps.", function() {
		// Passive: get lost.
		const paper = new Paper( "As a result of that, a lot of blog posts will GET LOST in a structure that is too flat." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns the passive sentences with multiple passive subsentences", function() {
		// Passive: is cleaned, is cleaned (2 times).
		const paper = new Paper( "Once a week, the house is cleaned by Tom where the house is cleaned by Jane." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns the passive sentences with more subsentences and only the first subsentence is passive", function() {
		// Passive: is cleaned.
		const paper = new Paper( "Once a week, the house is cleaned by Tom where the house is Jane." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns the passive sentences with an -ed word", function() {
		const paper = new Paper( "Even though the house is cleaned" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "supports different types of quotes", function() {
		let paper = new Paper( "you're done." );
		let researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ) ).toEqual( {
			total: 1,
			passives: [ "you're done." ],
		} );

		paper = new Paper( "you’re done." );
		researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ) ).toEqual( {
			total: 1,
			passives: [ "you’re done." ],
		} );

		paper = new Paper( "you‘re done." );
		researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ) ).toEqual( {
			total: 1,
			passives: [ "you‘re done." ],
		} );

		paper = new Paper( "you‛re done." );
		researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ) ).toEqual( {
			total: 1,
			passives: [ "you‛re done." ],
		} );
	} );

	it( "strips HTMLtags", function() {
		const paper = new Paper( "<a href='get lost'>No passive</a>" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ) ).toEqual( {
			total: 1,
			passives: [],
		} );
	} );

	it( "returns no passive sentence when the subsentence has no auxiliary, when the auxiliary is used multiple times", function() {
		// Passive: no passive, auxiliary: was
		const paper = new Paper( "He thought she was the one who knew about the six buried in his back yard, but he was wrong." );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns no passive sentence when there is an exception with 'rid'", function() {
		// Passive: no passive, auxiliary: got
		const paper = new Paper( "He got rid of it" );
		const researcher = new EnglishResearcher( paper );

		expect( passiveVoice( paper, researcher ) ).toEqual( {
			total: 1,
			passives: [],
		} );
	} );
} );
