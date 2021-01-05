import { dispatch } from "@wordpress/data";
import { BlockInstance } from "@wordpress/blocks";

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
		const blockToRestore = {
			clientId: "1234-abcd",
			isValid: true,
			name: "yoast/recipe",
			attributes: { className: "yoast-recipe" },
			innerBlocks: [
				{
					clientId: "5678-efgh",
					isValid: true,
					name: "yoast/steps",
					attributes: {},
					innerBlocks: [],
				} as BlockInstance,
			],
		} as BlockInstance;

		restoreBlock( "1234-abcd", blockToRestore );

		expect( dispatch ).toHaveBeenCalledWith( "core/block-editor" );
	} );
} );
