import { createBlock } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";

import restoreBlock from "../../src/blocks/warning-block/restoreBlock";

jest.mock( "@wordpress/data", () => {
	return {
		dispatch: jest.fn( () => {
			return {
				replaceBlock: jest.fn(),
			};
		} ),
	};
} );

jest.mock( "@wordpress/blocks", () => {
	return {
		createBlock: jest.fn(),
	};
} );

describe( "The restoreBlock function", () => {
	it( "restores a block", () => {
		restoreBlock( "1234-abcd", "yoast/recipe", { className: "yoast-recipe" } );

		expect( createBlock ).toHaveBeenCalledWith( "yoast/recipe", { className: "yoast-recipe" } );
		expect( dispatch ).toHaveBeenCalledWith( "core/editor" );
	} );
} );
