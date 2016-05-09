var passiveVoice = require( "../../js/researches/passiveVoice.js" );
var Paper = require( "../../js/values/Paper.js" );

// Tests inspired by the examples on http://www.englishpage.com/verbpage/activepassive.html
describe( "detecting passive voice in sentences", function() {
	/*it("returns active voice (Simple Present)", function () {
		var paper = new Paper("Once a week, Tom cleans the house.");
		expect(passiveVoice(paper)).toBe(0);
	});*/

	it("returns active voice (Simple Present)", function () {
		paper = new Paper("Once a week, Tom cleans the house.");
		expect(passiveVoice(paper)).toBe(0);
	});

	it("returns passive voice (Simple Present)", function () {
		paper = new Paper("Once a week, the house is cleaned by Tom.");
		expect(passiveVoice(paper)).toBe(1);
	});

	it("returns active voice (Present Continuous)", function () {
		paper = new Paper("Right now, Sarah is writing the letter.");
		expect(passiveVoice(paper)).toBe(0);
	});

	it("returns passive voice (Present Continuous)", function () {
		paper = new Paper("Right now, the letter is being written by Sarah.");
		expect(passiveVoice(paper)).toBe(1);
	});
} );
/*
	it( "returns active voice (Simple Past)", function() {
		paper = new Paper( "Sam repaired the car." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Past)", function() {
		paper = new Paper( "The car was repaired by Sam." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Past Continuous)", function() {
		paper = new Paper( "The salesman was helping the customer when the thief came into the store." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Past Continuous)", function() {
		paper = new Paper( "The customer was being helped by the salesman when the thief came into the store." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Present Perfect)", function() {
		paper = new Paper( "Many tourists have visited that castle." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Present Perfect)", function() {
		paper = new Paper( "That castle has been visited by many tourists." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Present Perfect Continuous)", function() {
		paper = new Paper( "Recently, John has been doing the work." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Present Perfect Continuous)", function() {
		paper = new Paper( "Recently, the work has been being done by John." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Past Perfect)", function() {
		paper = new Paper( "George had repaired many cars before he received his mechanic's license." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Past Perfect)", function() {
		paper = new Paper( "Many cars had been repaired by George before he received his mechanic's license." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Past Perfect Continuous)", function() {
		paper = new Paper( "Chef Jones had been preparing the restaurant's fantastic dinners for two years before he moved to Paris." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Past Perfect Continuous)", function() {
		paper = new Paper( "The restaurant's fantastic dinners had been being prepared by Chef Jones for two years before he moved to Paris." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Simple Future - will)", function() {
		paper = new Paper( "Someone will finish the work by 5:00 PM." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Future - will)", function() {
		paper = new Paper( "The work will be finished by 5:00 PM." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Simple Future - be going to)", function() {
		paper = new Paper( "Sally is going to make a beautiful dinner tonight." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Simple Future - be going to)", function() {
		paper = new Paper( "A beautiful dinner is going to be made by Sally tonight." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Future Continuous - will)", function() {
		paper = new Paper( "At 8:00 PM tonight, John will be washing the dishes." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Future Continuous - will)", function() {
		paper = new Paper( "At 8:00 PM tonight, the dishes will be being washed by John." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Future Continuous - be going to)", function() {
		paper = new Paper( "At 8:00 PM tonight, John is going to be washing the dishes." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Future Continuous - be going to)", function() {
		paper = new Paper( "At 8:00 PM tonight, the dishes are going to be being washed by John." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect - will)", function() {
		paper = new Paper( "They will have completed the project before the deadline." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect - will)", function() {
		paper = new Paper( "The project will have been completed before the deadline." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect - be going to)", function() {
		paper = new Paper( "They are going to have completed the project before the deadline." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect - be going to)", function() {
		paper = new Paper( "The project is going to have been completed before the deadline." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect Continuous- will)", function() {
		paper = new Paper( "The famous artist will have been painting the mural for over six months by the time it is finished." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect Continuous- will)", function() {
		paper = new Paper( "The mural will have been being painted by the famous artist for over six months by the time it is finished." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Future Perfect Continuous- be going to)", function() {
		paper = new Paper( "The famous artist is going to have been painting the mural for over six months by the time it is finished." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Future Perfect Continuous- be going to)", function() {
		paper = new Paper( "The mural is going to have been being painted by the famous artist for over six months by the time it is finished." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Used to)", function() {
		paper = new Paper( "Jerry used to pay the bills." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Used to)", function() {
		paper = new Paper( "The bills used to be paid by Jerry." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Would Always)", function() {
		paper = new Paper( "My mother would always make the pies." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Would Always)", function() {
		paper = new Paper( "The pies would always be made by my mother." );
		expect( passiveVoice( paper) ).toBe( 1 );

	} );
	it( "returns active voice (Future in the Past - would)", function() {
		paper = new Paper( "I knew John would finish the work by 5:00 PM." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Future in the Past - would)", function() {
		paper = new Paper( "I knew the work would be finished by 5:00 PM." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );

	it( "returns active voice (Future in the Past - was going to)", function() {
		paper = new Paper( "I thought Sally was going to make a beautiful dinner tonight." );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );

	it( "returns passive voice (Future in the Past - was going to)", function() {
		paper = new Paper( "I thought a beautiful dinner was going to be made by Sally tonight." );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );
} );
*/
