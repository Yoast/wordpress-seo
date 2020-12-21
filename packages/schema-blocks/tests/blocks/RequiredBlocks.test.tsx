import { BlockInstance } from "@wordpress/blocks";
import { RequiredBlock } from "../../src/instructions/blocks/dto";
import RequiredBlocks from "../../src/blocks/RequiredBlocks";

describe( "The required blocks in the sidebar", () => {
	it( "haha", () => {
		const block = {} as BlockInstance;
		const requiredBlocks = [
			{
				name: "yoast/innerblock",
				option: 1,
			} as RequiredBlock,
		];

		const actual = RequiredBlocks( block, requiredBlocks );
		const expected = "lala";

		expect( actual ).toEqual( expected );
	} );
} );
