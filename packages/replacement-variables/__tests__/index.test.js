import createReplacementVariables from "../src";

describe( "Apply function", () => {
	test( "should replace a variable in a string.", () => {
		const replacementVariables = createReplacementVariables( [
			{
				name: "test",
				getReplacement: () => {
					const replacement = "test";
					return replacement;
				},
			},
		] );

		const string = "this is a %%test%%";

		expect( replacementVariables.apply( string ) ).toEqual( "this is a test" );
	} );
} );
