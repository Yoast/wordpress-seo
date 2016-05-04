var passiveVoice = require( "../../js/researches/passiveVoice.js" );
var Paper = require( "../../js/values/Paper.js" );

var paper;

describe( "detecting passive voice in sentences", function() {
	paper = new Paper( "he is being fired from a cannon" );
	passiveVoice( paper );
	/*it( "returns passive voice in  1 sentence", function() {
		paper = new Paper( "he was abducted by aliens" );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );
	it( "returns no passive", function(){
		paper = new Paper( "Andy drives to work" );
		expect( passiveVoice( paper) ).toBe( 0 );
	} );
	it( "returns passive", function(){
		paper = new Paper( "The car was repaired by Andy" );
		expect( passiveVoice( paper) ).toBe( 1 );
	} );
	it( "returns no passive", function(){
		paper = new Paper( "My mother would always make the fries" );
		expect( passiveVoice( paper) ).toBe( 0 );
	} )
	it( "returns no passive", function(){
		paper = new Paper( "The bills used to be paid by Jerry" );
		expect( passiveVoice( paper) ).toBe( 1 );
	} )
	it( "returns no passive", function(){
		paper = new Paper( "Andy is going to make a beautiful dinner tonight" );
		expect( passiveVoice( paper) ).toBe( 1 );
	} )

	it( "returns no passive", function(){
		paper = new Paper( "Andy is going to make a beautiful dinner tonight, he is" );
		expect( passiveVoice( paper) ).toBe( 1 );
	} )*/

} );
