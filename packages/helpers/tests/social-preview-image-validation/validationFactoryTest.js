import validationFactory from "../../src/social-preview-image-validation/validationFactory";

describe( validationFactory, () => {
	it( "returns a function when given an empty array", () => {
		const platformRequirements = [];

		const actual = validationFactory( platformRequirements );

		expect( typeof actual ).toEqual( "function" );
	} );
} );


