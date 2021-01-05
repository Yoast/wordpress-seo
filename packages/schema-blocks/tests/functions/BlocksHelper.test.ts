import { dispatch, select } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";

import { removeBlock, restoreBlock, getBlockType } from "../../src/functions/BlockHelper";

jest.mock( "@wordpress/data", () => {
	return {
		select: jest.fn( () => {
			return {
				getBlockType: jest.fn(),
			};
		} ),
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

describe( "The getBlockType function", () => {
	it( "retrieves the blocktype for the given name", () => {
		getBlockType( "yoast/recipe" );

		expect( select ).toHaveBeenCalledWith( "core/blocks" );
	} );
} );
