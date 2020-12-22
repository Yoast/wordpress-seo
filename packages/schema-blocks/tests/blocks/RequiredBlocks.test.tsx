import { BlockInstance } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { PanelBody } from "@wordpress/components";
import { RequiredBlock } from "../../src/instructions/blocks/dto";
import RequiredBlocks from "../../src/blocks/RequiredBlocks";

jest.mock( "../../src/functions/blocks", () => {
	return {
		getBlockType: jest.fn( ( blockName: string )  => {
			if ( blockName === "yoast/nonexisting" ) {
				return undefined;
			}

			return {
				title: "The required block",
			};
		} ),
	};
} );

jest.mock( "../../src/functions/innerBlocksHelper", () => {
	return {
		getInnerblocksByName: jest.fn( ()  => {
			return [
				{
					name: "yoast/added-to-content",
				},
				{
					name: "yoast/not-added-to-content",
				},
			];
		} ),
	};
} );

describe( "The required blocks in the sidebar", () => {
	it( "doesn't have the required block being registered as a block", () => {
		const block = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [
			{
				name: "yoast/nonexisting",
				option: 1,
			} as RequiredBlock,
		];

		const actual = RequiredBlocks( block, requiredBlocks );

		expect( actual ).toBe( null );
	} );

	it( "renders the required block as an added one", () => {
		const block = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [
			{
				name: "yoast/added-to-content",
				option: 1,
			} as RequiredBlock,
		];

		const actual = RequiredBlocks( block, requiredBlocks );
		const expected = <PanelBody>

			<div className="yoast-block-sidebar-title">Required blocks</div>
			<ul className="yoast-block-suggestions">

			</ul>
		</PanelBody>;

		expect( actual ).toEqual( expected );
	} );
} );
