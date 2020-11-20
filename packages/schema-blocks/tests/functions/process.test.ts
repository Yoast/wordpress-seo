import "../matchMedia.mock";

import process from "../../src/functions/process";
import BlockDefinition from "../../src/core/blocks/BlockDefinition";
import BlockInstruction from "../../src/core/blocks/BlockInstruction";
import  "../../src/instructions/blocks/InnerBlocks";

describe( "the process function", () => {
	it( "processes an inner-blocks instruction", () => {
		const template = '{{inner-blocks allowed-blocks=[ "core/paragraph", "core/image", "yoast/ingredients" ] ' +
			'template=[ [ "yoast/ingredients", { "value": [ "ingredient 1", "ingredient 2" ]} ], [ "yoast/ingredients", {} ]] ' +
			'appender="button" appenderLabel="Add to recipe" }}';

		const actual = process( template, BlockDefinition, BlockInstruction );
		const expected = {
			0: {
				id: 0,
				options: {
					allowedBlocks: [
						"core/paragraph",
						"core/image",
						"yoast/ingredients",
					],
					appender: "button",
					appenderLabel: "Add to recipe",
					template: [
						[
							"yoast/ingredients",
							{
								value: [
									"ingredient 1",
									"ingredient 2",
								],
							},
						],
						[
							"yoast/ingredients",
							{},
						],
					],
				},
			},
		};

		expect( actual.instructions ).toEqual( expected );
	} );

	it( "processes an inner-blocks instruction containing an invalid object", () => {
		try {
			const template = '{{inner-blocks allowed-blocks={ "value": } }}';
			process( template, BlockDefinition, BlockInstruction );
		} catch ( error ) {
			expect( error ).toEqual( "Invalid token found." );
		}
	} );

	it( "processes an inner-blocks instruction followed by static html", () => {
		const template = "{{inner-blocks allowed-blocks=[] }}<p>This is static html</p>";

		const actual = process( template, BlockDefinition, BlockInstruction );

		expect( actual.template ).toContain( "<p>This is static html</p>" );
	} );
} );
