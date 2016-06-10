var passiveVoice = require( "../../js/researches/getPassiveVoice.js" );
var Paper = require( "../../js/values/Paper.js" );

// Tests inspired by the examples on http://www.englishpage.com/verbpage/activepassive.html
describe( "detecting passive voice in sentences", function() {

	it( "returns active voice (Simple Present)", function () {
		paper = new Paper("Once a week, Tom cleans the house.");
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice (Simple Present)", function () {
		// Passive: is cleaned.
		paper = new Paper("Once a week, the house is cleaned by Tom.");
		expect(passiveVoice( paper ).passives.length).toBe( 1 );
	});

	it( "returns active voice (Present Continuous)", function () {
		paper = new Paper("Right now, Sarah is writing the letter.");
		expect(passiveVoice( paper ).passives.length).toBe( 0 );
	});

	it( "returns passive voice (Present Continuous)", function () {
		// Passive: (is) being written.
		paper = new Paper("Right now, the letter is being written by Sarah.");
		expect(passiveVoice( paper ).passives.length).toBe( 1 );
	});

	it( "returns active voice (Simple Past)", function() {
		paper = new Paper( "Sam repaired the car." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Past)", function() {
		// Passive: was repaired.
		paper = new Paper( "The car was repaired by Sam." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Past Continuous)", function() {
		paper = new Paper( "The salesman was helping the customer when the thief came into the store." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Past Continuous)", function() {
		// Passive: (was) being helped.
		paper = new Paper( "The customer was being helped by the salesman when the thief came into the store." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Present Perfect)", function() {
		paper = new Paper( "Many tourists have visited that castle." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Present Perfect)", function() {
		// Passive: (has) been visited.
		paper = new Paper( "That castle has been visited by many tourists." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Present Perfect Continuous)", function() {
		paper = new Paper( "Recently, John has been doing the work." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Present Perfect Continuous)", function() {
		// Passive: (has been) being done.
		paper = new Paper( "Recently, the work has been being done by John." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Past Perfect)", function() {
		paper = new Paper( "George had repaired many cars before he received his mechanic's license." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Past Perfect)", function() {
		// Passive: (had) been repaired.
		paper = new Paper( "Many cars had been repaired by George before he received his mechanic's license." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Past Perfect Continuous)", function() {
		paper = new Paper( "Chef Jones had been preparing the restaurant's fantastic dinners for two years before he moved to Paris." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Past Perfect Continuous)", function() {
		// Passive: (had been) being prepared.
		paper = new Paper( "The restaurant's fantastic dinners had been being prepared by Chef Jones for two years before he moved to Paris." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Simple Future - will)", function() {
		paper = new Paper( "Someone will finish the work by 5:00 PM." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Future - will)", function() {
		// Passive: (will) be finished.
		paper = new Paper( "The work will be finished by 5:00 PM." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Simple Future - be going to)", function() {
		paper = new Paper( "Sally is going to make a beautiful dinner tonight." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Future - be going to)", function() {
		// Passive: (to) be made.
		paper = new Paper( "A beautiful dinner is going to be made by Sally tonight." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Continuous - will)", function() {
		paper = new Paper( "At 8:00 PM tonight, John will be washing the dishes." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Continuous - will)", function() {
		// Passive: (will be) being washed.
		paper = new Paper( "At 8:00 PM tonight, the dishes will be being washed by John." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Continuous - be going to)", function() {
		paper = new Paper( "At 8:00 PM tonight, John is going to be washing the dishes." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Continuous - be going to)", function() {
		// Passive: (to be) being washed.
		paper = new Paper( "At 8:00 PM tonight, the dishes are going to be being washed by John." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect - will)", function() {
		paper = new Paper( "They will have completed the project before the deadline." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect - will)", function() {
		// Passive: (will have) been completed.
		paper = new Paper( "The project will have been completed before the deadline." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect - be going to)", function() {
		paper = new Paper( "They are going to have completed the project before the deadline." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect - be going to)", function() {
		// Passive:  (have) been completed.
		paper = new Paper( "The project is going to have been completed before the deadline." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect Continuous- will)", function() {
		paper = new Paper( "The famous artist will have been painting the mural for over six months." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect Continuous- will)", function() {
		// Passive: (will have been) being painted.
		paper = new Paper( "The mural will have been being painted by the famous artist for over six months." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect Continuous- be going to)", function() {
		paper = new Paper( "The famous artist is going to have been painting the mural for over six months." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect Continuous- be going to)", function() {
		// Passive: (have been) being painted.
		paper = new Paper( "The mural is going to have been being painted by the famous artist for over six months." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Used to)", function() {
		paper = new Paper( "Jerry used to pay the bills." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Used to)", function() {
		// Passive: (to) be paid.
		paper = new Paper( "The bills used to be paid by Jerry." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Would Always)", function() {
		paper = new Paper( "My mother would always make the pies." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Would Always)", function() {
		// Passive: (would) be made.
		paper = new Paper( "The pies would always be made by my mother." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );

	} );
	it( "returns active voice (Future in the Past - would)", function() {
		paper = new Paper( "I knew John would finish the work by 5:00 PM." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future in the Past - would)", function() {
		// Passive: (would) be finished.
		paper = new Paper( "I knew the work would be finished by 5:00 PM." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (Future in the Past - was going to)", function() {
		paper = new Paper( "I thought Sally was going to make a beautiful dinner tonight." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (Future in the Past - was going to)", function() {
		// Passive: (to) be made.
		paper = new Paper( "I thought a beautiful dinner was going to be made by Sally tonight." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice ( verb with -ing )", function() {
		paper = new Paper( "He was walking and jumped" );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice ( nonverb with -ing )", function() {
		paper = new Paper( "It was a ceiling and painted" );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice ( text between having and verb )", function() {
		// Passive: having painted.
		paper = new Paper( "He is having the house painted" );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns active voice ( no text between having and verb )", function() {
		paper = new Paper( "He is most notable, having contributed a lot" );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns active voice ( combination with left )", function() {
		paper = new Paper( "The right way is to the left" );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice ( combination with left )", function() {
		// Passive: was left.
		paper = new Paper( "She was left at home" );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns passive voice ( combination with left )", function() {
		// Passive: was hit.
		paper = new Paper( "He was hit on the left leg" );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns active voice ( combination with fit )", function() {
		paper = new Paper( "It was the right fit" );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice ( combination with fit )", function() {
		// Passive: was fit.
		paper = new Paper( "He was fit with hearing aids" );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns active voice ( combination with ing-verbs )", function() {
		paper = new Paper( "They had apps that are constantly improving, with regular updates based on customer feedback." );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice ( combination with cling )", function() {
		// Passive: get (cling) wrapped.
		paper = new Paper( "They had apps that get constantly cling wrapped" );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns passive voice ( combination with cling  )", function() {
		// Passive: are (cling) wrapped.
		paper = new Paper( "They had apps that are constantly cling wrapped." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns passive voice with quotation marks", function() {
		// Passive: get lost.
		paper = new Paper( "As a result of that, a lot of blog posts will 'get lost' in a structure that is too flat." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns passive voice with multiple subsentence, where the passive is not in the last part", function() {
		// Passive: get lost.
		paper = new Paper( "As a result of that, a lot of blog posts will get lost in a structure that is too flat." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns passive voice in a sentence where the indicator is in caps.", function() {
		// Passive: get lost.
		paper = new Paper( "As a result of that, a lot of blog posts will GET LOST in a structure that is too flat." );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});
	
	it( "returns the passive sentences with multiple passive subsentences", function () {
		// Passive: is cleaned, is cleaned (2 times).
		paper = new Paper("Once a week, the house is cleaned by Tom where the house is cleaned by Jane.");
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns the passive sentences with more subsentences and only the first subsentence is passive", function () {
		// Passive: is cleaned.
		paper = new Paper("Once a week, the house is cleaned by Tom where the house is Jane.");
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "supports different types of quotes", function() {
		paper = new Paper( "you're done." );
		expect( passiveVoice( paper ) ).toEqual( {
			total: 1,
			passives: [ "you're done." ]
		} );

		paper = new Paper( "you’re done." );
		expect( passiveVoice( paper ) ).toEqual( {
			total: 1,
			passives: [ "you’re done." ]
		} );

		paper = new Paper( "you‘re done." );
		expect( passiveVoice( paper ) ).toEqual( {
			total: 1,
			passives: [ "you‘re done." ]
		} );

		paper = new Paper( "you‛re done." );
		expect( passiveVoice( paper ) ).toEqual( {
			total: 1,
			passives: [ "you‛re done." ]
		} );

	});
} );
