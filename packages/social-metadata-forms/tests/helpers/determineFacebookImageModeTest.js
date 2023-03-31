import determineFacebookImageMode from "../../src/helpers/determineFacebookImageMode";

describe( "determineFacebookImageMode", () => {
	it( "Facebook preview returns square when the width and height are the same", () => {
		const actual = determineFacebookImageMode(
			{ width: 300, height: 300 } );
		const expected = "square";

		expect( actual ).toEqual( expected );
	} );

	it( "Facebook preview returns portrait when the height is greater than the width", () => {
		const actual = determineFacebookImageMode(
			{ width: 300, height: 600 } );
		const expected = "portrait";

		expect( actual ).toEqual( expected );
	} );

	it( "Facebook preview returns landscape when the width is greater than the height", () => {
		const actual = determineFacebookImageMode(
			{ width: 600, height: 300 } );
		const expected = "landscape";

		expect( actual ).toEqual( expected );
	} );
} );
