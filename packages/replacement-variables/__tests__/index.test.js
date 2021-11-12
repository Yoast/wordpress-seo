import createReplacementVariables from "../src";

describe( "Apply function", () => {
	test( "should replace a variable in a string.", () => {
		const { apply } = createReplacementVariables( [
			{
				name: "test",
				label: "Test",
				getReplacement: () => "test",
			},
		] );

		const result = apply( "this is a %%test%%" );

		expect( result ).toEqual( "this is a test" );
	} );

	test( "should replace multiple occurences of the same replacement variable in a string.", () => {
		const { apply } = createReplacementVariables( [
			{
				name: "test",
				label: "Test",
				getReplacement: () => "test",
			},
		] );

		const result = apply( "this is a %%test%%, %%test%%!" );

		expect( result ).toEqual( "this is a test, test!" );
	} );

	test( "should replace multiple replacement variables in a string.", () => {
		const { apply } = createReplacementVariables( [
			{
				name: "test",
				label: "Test",
				getReplacement: () => "test",
			},
			{
				name: "hello",
				label: "Hello",
				getReplacement: () => "Hello",
			},
		] );

		const result = apply( "%%hello%%, this is a %%test%%." );

		expect( result ).toEqual( "Hello, this is a test." );
	} );

	test( "should handle replacement variables without whitespace in between.", () => {
		const { apply } = createReplacementVariables( [
			{
				name: "test",
				label: "Test",
				getReplacement: () => "test",
			},
			{
				name: "hello",
				label: "Hello",
				getReplacement: () => "Hello",
			},
		] );

		const result = apply( "%%hello%%%%test%%" );

		expect( result ).toEqual( "Hellotest" );
	} );

	test( "should replace in order.", () => {
		const { apply } = createReplacementVariables( [
			{
				name: "test",
				label: "Test",
				getReplacement: () => "TEST",
			},
			{
				name: "hello",
				label: "Hello",
				getReplacement: () => "HELLO",
			},
		] );

		const result = apply( "%%hello%%%test%%" );

		// The first replacement makes it so the second will no longer match, due to the singular `%`.
		expect( result ).toEqual( "%%hello%TEST" );
	} );
} );

describe( "Replacement variables", () => {
	test( "should create multiple replacement variables", () => {
		const getReplacement = () => {};
		const { replacementVariables } = createReplacementVariables( [
			{
				name: "test1",
				label: "Test 1",
				getReplacement,
			},
			{
				name: "test2",
				label: "Test 2",
				getReplacement,
			},
		] );

		expect( replacementVariables.length ).toBe( 2 );
	} );

	test( "should create a regexp", () => {
		const getReplacement = () => {};
		const { replacementVariables } = createReplacementVariables( [
			{
				name: "test",
				label: "Test",
				getReplacement,
			},
		] );

		expect( replacementVariables ).toContainEqual( { name: "test", label: "Test", getReplacement, regexp: /%%test%%/g } );
	} );
} );
