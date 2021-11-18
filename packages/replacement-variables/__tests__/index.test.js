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

	test( "should replace differently based on context.", () => {
		const { apply } = createReplacementVariables( [
			{
				name: "test",
				label: "Test",
				getReplacement: ( { replacement } ) => replacement,
			},
		] );

		const result1 = apply( "this is %%test%%", { replacement: "replacement 1" } );
		expect( result1 ).toEqual( "this is replacement 1" );

		const result2 = apply( "this is %%test%%", { replacement: "replacement 2" } );
		expect( result2 ).toEqual( "this is replacement 2" );
	} );

	test( "should replace with undefined on missing context.", () => {
		const { apply } = createReplacementVariables( [
			{
				name: "test",
				label: "Test",
				getReplacement: ( { replacement } ) => replacement,
			},
		] );

		const result = apply( "this is %%test%%" );
		expect( result ).toEqual( "this is undefined" );
	} );
} );

describe( "Replacement variables", () => {
	test( "should create multiple replacement variables", () => {
		const getReplacement = () => {};
		const { variables } = createReplacementVariables( [
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

		expect( variables.length ).toBe( 2 );
	} );

	test( "should create a regexp", () => {
		const getReplacement = () => {};
		const { variables } = createReplacementVariables( [
			{
				name: "test",
				label: "Test",
				getReplacement,
			},
		] );

		expect( variables ).toContainEqual( { name: "test", label: "Test", getReplacement, regexp: /%%test%%/g } );
	} );
} );
