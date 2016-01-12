describe( "A function to determine the position of a word in a string", function(){
	it("returns the position", function(){
		expect( "keyword in a string".toLocaleLowerCase().indexOf( "keyword" ) ).toBe( 0 );
		expect( "keyword in a string".toLocaleLowerCase().indexOf( "none" ) ).toBe( -1 );
		expect( "string with keyword".toLocaleLowerCase().indexOf( "keyword" ) ).toBe( 12 );
	});
});
