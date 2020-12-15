import { dispatch } from "@wordpress/data";

import removeBlock from "../../src/blocks/warning-block/removeBlock";

jest.mock( "@wordpress/data", () => {
	return {
		dispatch: jest.fn( () => {
			return {
				removeBlock: jest.fn(),
			};
		} ),
	};
} );

describe( "The removeBlock function", () => {
	it( "removes a block", () => {
		removeBlock( "1234-abcd" );

		expect( dispatch ).toHaveBeenCalledWith( "core/editor" );
	} );
} );
