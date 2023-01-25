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
				clientId: "5678-fghij",
				innerBlocks: [],
				isValid: true,
				attributes: {},
			},
			{
				name: "yoast/warning-block",
				clientId: "9101-klmno",
				innerBlocks: [],
				isValid: true,
				attributes: {
					removedBlock: {
						name: "yoast/another-block",
					},
				},
			},
		];

		removeObsoleteWarnings( blocks );

		expect( removeBlock ).toBeCalled();
	} );

	it( "does not do anything when no warnings are there", () => {
		const blocks: BlockInstance[] = [
			{
				name: "yoast/a-block",
				clientId: "1234-abcde",
				innerBlocks: [],
				isValid: true,
				attributes: {},
			},
			{
				name: "yoast/another-block",
				clientId: "5678-fghij",
				innerBlocks: [],
				isValid: true,
				attributes: {},
			},
		];

		removeObsoleteWarnings( blocks );
	} );
} );
