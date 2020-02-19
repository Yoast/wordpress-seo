import validationFactory from "../../src/social-preview-image-validation/validationFactory";

describe( validationFactory, () => {
	it( "returns a function when given an empty array", () => {
		const platformRequirements = [];

		const actual = validationFactory( platformRequirements );

		expect( typeof actual ).toEqual( "function" );
	} );

	it( "returns an array with with a string when provided a function that return a string", () => {
		const platformRequirements = [
			() => "I feel returned",
		];

		const actual = validationFactory( platformRequirements );

		const expected = [ "I feel returned" ];

		expect( actual() ).toEqual( expected );
	} );
} );


