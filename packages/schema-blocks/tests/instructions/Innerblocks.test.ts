import "../matchMedia.mock";
import InnerBlocks from "../../src/instructions/blocks/InnerBlocks";

describe( "The Innerblocks class", () => {
	it( "has set the options right.", () => {
		const innerBlocks = new InnerBlocks(
			1337,
			{
				allowedBlocks: [ "core/paragraph" ],
				template: [ [ "core/paragraph", { html: "Text" } ] ],
			},
		);

		const expected = {
			allowedBlocks: [ "core/paragraph" ],
			template: [ [ "core/paragraph", { html: "Text" } ] ],
		};

		expect( innerBlocks.options ).toEqual( expected );
	} );
} );
