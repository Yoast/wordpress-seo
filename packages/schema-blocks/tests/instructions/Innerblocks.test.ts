import "../matchMedia.mock";
import InnerBlocks from "../../src/instructions/blocks/InnerBlocks";


jest.mock( "@yoast/components", () => {
	return {
		SvgIcon: jest.fn(),
	};
} );

describe( "The Innerblocks class", () => {
	it( "has set the options right.", () => {
		const innerBlocks = new InnerBlocks(
			1337,
			{
				name: "inner-blocks",
				allowedBlocks: [ "core/paragraph" ],
				template: [ [ "core/paragraph", { html: "Text" } ] ],
			},
		);

		const expected = {
			name: "inner-blocks",
			allowedBlocks: [ "core/paragraph" ],
			template: [ [ "core/paragraph", { html: "Text" } ] ],
		};

		expect( innerBlocks.options ).toEqual( expected );
	} );
} );
