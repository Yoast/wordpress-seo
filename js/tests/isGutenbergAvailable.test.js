import isBlockEditor from "../src/helpers/isBlockEditor.js";

describe( "isGutenbergDataAvailable", () => {
	it( "returns true if both wp and wp.data are defined", () => {
		const select = jest.fn( () => {
			return {
				getEditedPostAttribute: () => {},
			};
		} );

		window.wp = { data: { select } };
		const actual = isBlockEditor();

		expect( actual ).toBe( true );
		expect( select ).toBeCalledWith( "core/editor" );
	} );

	it( "returns false if wp.data is not defined", () => {
		window.wp = { something: true };
		const actual = isBlockEditor();
		expect( actual ).toBe( false );
	} );

	it( "returns false if wp is not defined", () => {
		window.wp = undefined;
		const actual = isBlockEditor();
		expect( actual ).toBe( false );
	} );

	it( "returns false if wp.data is available but the required selectors not registered", () => {
		window.wp = { data: { select: () => null } };
		const actual = isBlockEditor();
		expect( actual ).toBe( false );
	} );
} );
