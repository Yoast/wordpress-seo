import createReplacementVariables from "../src";

describe( "Apply function", () => {
	test( "should replace a variable in a string.", () => {
		const replacementVariables = createReplacementVariables( [
			{
				name: "test",
				getReplacement: () => "test",
			},
		] );

		const result = replacementVariables.apply( "this is a %%test%%" );

		expect( result ).toEqual( "this is a test" );
	} );
} );
