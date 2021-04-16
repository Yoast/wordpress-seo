import "../../../matchMedia.mock";
import { removeObsoleteWarnings } from "../../../../src/functions/gutenberg/watchers/removeObsoleteWarnings";
import { BlockInstance } from "@wordpress/blocks";
import { removeBlock } from "../../../../src/functions/BlockHelper";

jest.mock( "../../../../src/functions/BlockHelper", () => ( {
	removeBlock: jest.fn(),
} ) );

describe( "The removeObsoleteWarnings function", () => {
	it( "removes any warnings that no longer apply", () => {
		const blocks: BlockInstance[] = [
			{
				name: "yoast/warning-block",
				clientId: "1234-abcde",
				innerBlocks: [],
				isValid: true,
				attributes: {
					removedBlock: {
						name: "yoast/a-removed-block",
					},
				},
			},
			{
				name: "yoast/a-removed-block",
				clientId: "1234-abcde",
				innerBlocks: [],
				isValid: true,
				attributes: {},
			},
		];

		removeObsoleteWarnings( blocks );

		expect( removeBlock ).toBeCalled();
	} );
} );
