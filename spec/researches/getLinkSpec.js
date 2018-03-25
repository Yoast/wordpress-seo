let getLinks = require( "../../js/researches/getLinks" );
let Paper = require( "../../js/values/Paper.js" );

describe( "A test for getting the links from a text", function() {
	it( "returns all links from the text", function() {
		let mockPaper = new Paper( "This is a text with a <a href='http://yoast.com'>very nice</a> link" );
		expect( getLinks( mockPaper ) ).toEqual( [ "http://yoast.com" ] );
		mockPaper = new Paper( "This is a text with a <a href='http://yoast.com'>very nice</a> link, and a even <a href='https://yoast.com'>nicer</a> link." );
		expect( getLinks( mockPaper ) ).toEqual( [ "http://yoast.com", "https://yoast.com" ] );
	} );
	it( "returns an empty arry when there are no links", function() {
		let mockPaper = new Paper( "This is a test text" );
		expect( getLinks( mockPaper ) ).toEqual( [  ] );
	} );
} );
