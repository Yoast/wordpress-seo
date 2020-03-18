import generateId, { getId } from "../src/GenerateId";

describe( "GenerateId", () => {
	it( "generates a non-empty string", () => {
		const id1 = generateId();

		expect( id1 ).not.toBe( "" );
	} );

	it( "generates a fairly random string", () => {
		const id1 = generateId();
		const id2 = generateId();

		expect( id1 ).not.toBe( id2 );
	} );

	it( "returns non-falsy IDs", () => {
		const id1 = getId( "hi" );

		expect( id1 ).toBe( "hi" );
	} );

	it( "generates a new id of the provided ID is falsy", () => {
		const id1 = getId( false );

		expect( id1 ).toBeTruthy();
	} );
} );
