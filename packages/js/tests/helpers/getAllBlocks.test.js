import { getAllBlocks } from "../../src/helpers/getAllBlocks";

describe( "getAllBlocks", () => {
	it( "should return the same blocks when no inner blocks are defined", () => {
		const blocks = [ { clientId: 1 }, { clientId: 2 }, { clientId: 3 } ];
		const expected = [ 1, 2, 3 ];
		expect( expected ).toEqual( getAllBlocks( blocks ).map( ( { clientId } ) => clientId ) );
	} );

	it( "should return all blocks when inner blocks are defined", () => {
		const blocks = [
			{ clientId: 1, innerBlocks: [ { clientId: 2 }, { clientId: 3, innerBlocks: [ { clientId: 4 } ] } ] },
			{ clientId: 5, innerBlocks: [] },
		];
		const expected = [ 1, 2, 3, 4, 5 ];
		expect( expected ).toEqual( getAllBlocks( blocks ).map( ( { clientId } ) => clientId ).sort() );
	} );
} );
