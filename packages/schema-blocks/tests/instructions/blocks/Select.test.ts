import * as renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { ReactElement } from "@wordpress/element";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";

import Select from "../../../src/instructions/blocks/Select";
import { RenderSaveProps } from "../../../src/core/blocks/BlockDefinition";
import { RenderEditProps } from "../../../src/core/blocks/BlockDefinition";

describe( "The Select instruction", () => {
	describe( "the save method", () => {
		it( "renders the correct React tree.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				options: {
					Korean: "korean",
					Tanzanian: "tanzanian",
					Australian: "australian",
				},
			};

			const props: RenderSaveProps = {
				attributes: {
					cuisine: "korean",
				},
			};

			const selectInstruction = new Select( 123, options );

			const tree = renderer
				.create( selectInstruction.save( props ) as ReactElement )
				.toJSON();

			expect( tree ).toMatchSnapshot();
		} );

		it( "renders the correct React tree when the selection options are an array.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				options: [
					"korean",
					"tanzanian",
					"australian",
				],
			};

			const props: RenderEditProps = {
				className: "",
				isSelected: false,
				setAttributes: jest.fn(),
				attributes: {
					cuisine: "korean",
				},
			};

			const selectInstruction = new Select( 123, options );

			const tree = renderer
				.create( selectInstruction.save( props ) as ReactElement )
				.toJSON();

			expect( tree ).toMatchSnapshot();
		} );
	} );

	describe( "the edit method", () => {
		it( "renders the correct React tree.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				options: {
					Korean: "korean",
					Tanzanian: "tanzanian",
					Australian: "australian",
				},
			};

			const props: RenderEditProps = {
				className: "",
				isSelected: false,
				setAttributes: jest.fn(),
				attributes: {
					cuisine: "korean",
				},
			};

			const selectInstruction = new Select( 123, options );

			const tree = renderer
				.create( selectInstruction.edit( props ) as ReactElement )
				.toJSON();

			expect( tree ).toMatchSnapshot();
		} );

		it( "renders the correct React tree when the selection options are an array.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				options: [
					"korean",
					"tanzanian",
					"australian",
				],
			};

			const props: RenderEditProps = {
				className: "",
				isSelected: false,
				setAttributes: jest.fn(),
				attributes: {
					cuisine: "korean",
				},
			};

			const selectInstruction = new Select( 123, options );

			const tree = renderer
				.create( selectInstruction.edit( props ) as ReactElement )
				.toJSON();

			expect( tree ).toMatchSnapshot();
		} );

		it( "correctly registers an onInput method.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				options: [
					"korean",
					"tanzanian",
					"australian",
				],
			};

			const props: RenderEditProps = {
				className: "",
				isSelected: false,
				setAttributes: jest.fn(),
				attributes: {
					cuisine: "korean",
				},
			};

			const selectInstruction = new Select( 123, options );

			const tree = shallow( selectInstruction.edit( props ) as ReactElement );

			const selectElement = tree.find( "select" ).first();

			const onInputEvent = {
				target: {
					value: "australian",
				},
			};

			selectElement.simulate( "input", onInputEvent );

			expect( props.setAttributes ).toBeCalledWith( { cuisine: "australian" } );
		} );
	} );

	describe( "the configuration method", () => {
		it( "returns the correct configuration.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				required: true,
				options: [
					"korean",
					"tanzanian",
					"australian",
				],
			};

			const expectedConfiguration: Partial<BlockConfiguration> = {
				attributes: {
					cuisine: {
						required: true,
					},
				},
			};

			const selectInstruction = new Select( 123, options );

			expect( selectInstruction.configuration() ).toEqual( expectedConfiguration );
		} );
	} );

	describe( "the valid method", () => {
		it( "returns true when the instruction is required and the value exists and is filled in.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				required: true,
				options: [
					"korean",
					"tanzanian",
					"australian",
				],
			};

			const selectInstruction = new Select( 123, options );

			const blockInstance: BlockInstance = {
				name: "select-instruction",
				clientId: "abcd-1234",
				isValid: true,
				innerBlocks: [],
				attributes: {
					cuisine: "tanzanian",
				},
			};

			expect( selectInstruction.valid( blockInstance ) ).toEqual( true );
		} );

		it( "returns true when the instruction is not required and the value exists.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				required: false,
				options: [
					"korean",
					"tanzanian",
					"australian",
				],
			};

			const selectInstruction = new Select( 123, options );

			const blockInstance: BlockInstance = {
				name: "select-instruction",
				clientId: "abcd-1234",
				isValid: true,
				innerBlocks: [],
				attributes: {
					cuisine: "",
				},
			};

			expect( selectInstruction.valid( blockInstance ) ).toEqual( true );
		} );

		it( "returns false when the instruction is not required and the value does not exist.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				required: false,
				options: [
					"korean",
					"tanzanian",
					"australian",
				],
			};

			const selectInstruction = new Select( 123, options );

			const blockInstance: BlockInstance = {
				name: "select-instruction",
				clientId: "abcd-1234",
				isValid: true,
				innerBlocks: [],
				attributes: {},
			};

			expect( selectInstruction.valid( blockInstance ) ).toEqual( false );
		} );

		it( "returns false when the instruction is required and the value does not exist.", () => {
			const options: Select["options"] = {
				name: "cuisine",
				label: "Cuisine",
				required: true,
				options: [
					"korean",
					"tanzanian",
					"australian",
				],
			};

			const selectInstruction = new Select( 123, options );

			const blockInstance: BlockInstance = {
				name: "select-instruction",
				clientId: "abcd-1234",
				isValid: true,
				innerBlocks: [],
				attributes: {},
			};

			expect( selectInstruction.valid( blockInstance ) ).toEqual( false );
		} );
	} );
} );
