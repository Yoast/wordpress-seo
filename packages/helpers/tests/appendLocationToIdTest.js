import appendLocationToId from "../src/appendLocationToId";

describe( "appendLocationToId", () => {
	it( "appends the location the ID", () => {
		expect( appendLocationToId( "id", "location" ) ).toBe( "id-location" );
	} );

	it( "appends nothing without a location", () => {
		expect( appendLocationToId( "id" ) ).toBe( "id" );
	} );
} );
