import "../matchMedia.mock";

import process, { processBlock } from "../../src/functions/process";
import BlockDefinition from "../../src/core/blocks/BlockDefinition";
import BlockInstruction from "../../src/core/blocks/BlockInstruction";
import "../../src/instructions/blocks/InnerBlocks";
import InnerBlocks from "../../src/instructions/blocks/InnerBlocks";
import { RequiredBlock, RequiredBlockOption } from "../../src/core/validation";

jest.mock( "@yoast/components", () => {
	return {
		SvgIcon: jest.fn(),
	};
} );

describe( "the process function", () => {
	it( "processes an inner-blocks instruction", () => {
		const template = '{{inner-blocks allowed-blocks=[ "core/paragraph", "core/image", "yoast/ingredients" ] ' +
			'template=[ [ "yoast/ingredients", { "value": [ "ingredient 1", "ingredient 2" ]} ], [ "yoast/ingredients", {} ]] ' +
			'appender="button" appenderLabel="Add to recipe" }}';
		const expected = {
			1: {
				id: 1,
				options: {
					allowedBlocks: [
						"core/paragraph",
						"core/image",
						"yoast/ingredients",
					],
					appender: "button",
					appenderLabel: "Add to recipe",
					name: "inner-blocks",
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
		// Arrange.
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

		// Act.
		const definition = processBlock( template );

		// Assert.
		const instruction = Object.values( definition.instructions ).pop() as InnerBlocks;
		expect( instruction.options.requiredBlocks ).toEqual( expected );
	} );

	it( "processes recommended blocks as specified in the template", () => {
		// Arrange.
		const template =
			'{{inner-blocks required-blocks=[ { "name": "core/paragraph", "option": "One" } ] ' +
			'recommended-blocks=[ "core/image", "core/paragraph" ] appender="button" appenderLabel="Add to recipe" }}';
		const expected: string[] = [ "core/image", "core/paragraph" ];

		// Act.
		const definition = processBlock( template );

		// Assert.
		const instruction = Object.values( definition.instructions ).pop() as InnerBlocks;
		expect( instruction.options.requiredBlocks.length ).toEqual( 1 );
		expect( instruction.options.recommendedBlocks ).toEqual( expected );
	} );
} );
