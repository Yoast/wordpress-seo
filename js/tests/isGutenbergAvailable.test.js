import { isGutenbergDataAvailable } from "../src/helpers/isGutenbergAvailable.js";

describe( "isGutenbergDataAvailable", () => {
	it( "returns true if both wp and wp.data are defined", () => {
		const select = jest.fn( () => {
			return {
				getEditedPostAttribute: () => {},
			};
		} );

		window.wp = { data: { select } };
		const actual = isGutenbergDataAvailable();

		expect( actual ).toBe( true );
		expect( select ).toBeCalledWith( "core/editor" );
	} );

	it( "returns false if wp.data is not defined", () => {
		window.wp = { something: true };
		const actual = isGutenbergDataAvailable();
		expect( actual ).toBe( false );
	} );

	it( "returns false if wp is not defined", () => {
		window.wp = undefined;
		const actual = isGutenbergDataAvailable();
		expect( actual ).toBe( false );
	} );
} );
