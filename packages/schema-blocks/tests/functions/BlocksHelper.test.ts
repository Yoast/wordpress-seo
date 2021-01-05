import { dispatch } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";

import { removeBlock, restoreBlock } from "../../src/functions/BlockHelper";

jest.mock( "@wordpress/data", () => {
	return {
		dispatch: jest.fn( () => {
			return {
				removeBlock: jest.fn(),
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

describe( "The removeBlock function", () => {
	it( "removes a block", () => {
		removeBlock( "1234-abcd" );

		expect( dispatch ).toHaveBeenCalledWith( "core/block-editor" );
	} );
} );

describe( "The restoreBlock function", () => {
	it( "restores a block", () => {
		restoreBlock( "1234-abcd", "yoast/recipe", { className: "yoast-recipe" } );

		expect( createBlock ).toHaveBeenCalledWith( "yoast/recipe", { className: "yoast-recipe" } );
		expect( dispatch ).toHaveBeenCalledWith( "core/block-editor" );
	} );
} );
