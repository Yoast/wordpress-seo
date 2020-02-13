import validationFactory from "../../src/social-preview-image-validation/validationFactory";

describe( validationFactory, () => {
	it( "runs all the tests", () => {
		const platformRequirements = [];

		const actual = validationFactory( platformRequirements );

		const expected = [];

		expect( actual ).toEqual( expected );
	} );
} );


