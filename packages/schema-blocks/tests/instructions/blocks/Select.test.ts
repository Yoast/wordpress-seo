import * as renderer from "react-test-renderer";

import { ReactElement } from "@wordpress/element";
import { BlockConfiguration } from "@wordpress/blocks";

import Select from "../../../src/instructions/blocks/Select";
import { RenderSaveProps } from "../../../src/core/blocks/BlockDefinition";
import { RenderEditProps } from "../../../src/core/blocks/BlockDefinition";

describe( "The Select instruction", () => {
	const options: Select["options"] = {
		name: "cuisine",
		label: "Cuisine",
		options: [
			{ label: "Korean", value: "korean" },
			{ label: "Tanzanian", value: "tanzanian" },
			{ label: "Australian", value: "australian" },
		],
		hideLabelFromVision: false,
	};

	describe( "the save method", () => {
		it( "renders the correct React tree.", () => {
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
	} );

	describe( "the configuration method", () => {
		it( "returns the correct configuration.", () => {
			const newOptions = Object.assign( {}, options, { required: true } );

			const expectedConfiguration: Partial<BlockConfiguration> = {
				attributes: {
					cuisine: {
						required: true,
					},
				},
			};

			const selectInstruction = new Select( 123, newOptions );

			expect( selectInstruction.configuration() ).toEqual( expectedConfiguration );
		} );
	} );

	/**
	 * Skipped because React hooks do not work in the tests yet.
	 */
	describe.skip( "The edit method", () => {
		it( "renders the correct React tree", () => {
			const props: RenderEditProps = {
				clientId: "abcd-1234",
				className: "",
				attributes: {
					cuisine: "korean",
				},
				isSelected: true,
				setAttributes: jest.fn(),
			};

			const selectInstruction = new Select( 123, options );

			const tree = renderer
				.create( selectInstruction.edit( props ) as ReactElement )
				.toJSON();

			expect( tree ).toMatchSnapshot();
		} );
	} );
} );
