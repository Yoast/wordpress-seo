import { BlockInstance } from "@wordpress/blocks";

let mockedInnerblocks: BlockInstance[] = [];

/**
 * Initializes a fake store with the given fake innerblocks.
 *
 * @param innerBlocks The innerblocks that should be returned by the store.
 */
function mockInnerBlocks( innerBlocks: BlockInstance[] ) {
	mockedInnerblocks = innerBlocks;
}

/**
 * Mocks the select function to return a mocked block.
 *
 * @param store The store to read from (not used).
 * @returns {BlockInstance[]} The mocked block, as configured in mockInnerBlocks.
 */
function select( store: string ) {
	return {
		getBlock: () => ( {
			innerBlocks: mockedInnerblocks,
		} as BlockInstance ),
	};
}

export default { select };
export { mockedInnerblocks };
