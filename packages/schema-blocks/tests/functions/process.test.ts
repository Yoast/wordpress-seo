import "../matchMedia.mock";

import process, { processBlock } from "../../src/functions/process";
import BlockDefinition from "../../src/core/blocks/BlockDefinition";
import BlockInstruction from "../../src/core/blocks/BlockInstruction";
import  "../../src/instructions/blocks/InnerBlocks";
import { RequiredBlockOption } from "../../src/instructions/blocks/enums";
import InnerBlocks from "../../src/instructions/blocks/InnerBlocks";
import { RequiredBlock } from "../../src/instructions/blocks/dto";

describe( "the process function", () => {
	it( "processes an inner-blocks instruction", () => {
		const template = '{{inner-blocks allowed-blocks=[ "core/paragraph", "core/image", "yoast/ingredients" ] ' +
			'template=[ [ "yoast/ingredients", { "value": [ "ingredient 1", "ingredient 2" ]} ], [ "yoast/ingredients", {} ]] ' +
			'appender="button" appenderLabel="Add to recipe" }}';
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
		const definition = process( template, BlockDefinition, BlockInstruction );

		expect( definition.instructions ).toEqual( expected );
	} );

	it( "processes an inner-blocks instruction containing an invalid object", () => {
		try {
			const template = '{{inner-blocks allowed-blocks={ "value": } }}';
			processBlock( template );
		} catch ( error ) {
			expect( error ).toEqual( "Invalid token found." );
		}
	} );

	it( "processes an inner-blocks instruction followed by static html", () => {
		const template = "{{inner-blocks allowed-blocks=[] }}<p>This is static html</p>";

		const definition = processBlock( template );

		expect( definition.template ).toContain( "<p>This is static html</p>" );
	} );

	it( "processes required blocks as specified in the template", () => {
		const template =
			'{{inner-blocks allowed-blocks=[ "core/paragraph" ] ' +
			'required-blocks=[ { "name": "core/paragraph", "option": "Multiple" }, { "name": "core/image", "option": "One" } ] }}';
		const expected: RequiredBlock[] = [
			{
				name: "core/paragraph",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
			{
				name: "core/image",
				option: RequiredBlockOption.One,
			} as RequiredBlock,
		];
		const definition = processBlock( template );
		const instruction = Object.values( definition.instructions ).pop() as InnerBlocks;

		expect( instruction.options.requiredBlocks ).toEqual( expected );
	} );
} );
