import removeEmailAddresses from "../../../../src/languageProcessing/helpers/sanitize/removeEmailAddresses.js";

describe( "a test for removing email addresses from a string", function() {
	it( "removes an email address", function() {
		expect( removeEmailAddresses( "example@something.com" ) ).toBe( "" );
	} );
	it( "removes an email address with special characters", function() {
		expect( removeEmailAddresses( "some+long+email+address23@some+host-weird-/looking.com" ) ).toBe( "" );
	} );
	it( "removes a very short email address", function() {
		expect( removeEmailAddresses( "a@b.com" ) ).toBe( "" );
	} );
	it( "does not remove invalid email addresses", function() {
		expect( removeEmailAddresses( "@b.com" ) ).toBe( "@b.com" );
		expect( removeEmailAddresses( "a@b" ) ).toBe( "a@b" );
		expect( removeEmailAddresses( "example@" ) ).toBe( "example@" );
		expect( removeEmailAddresses( "example.com" ) ).toBe( "example.com" );
	} );
} );
