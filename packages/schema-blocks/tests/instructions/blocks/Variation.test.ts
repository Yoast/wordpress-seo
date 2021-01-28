import * as renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { ReactElement } from "@wordpress/element";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";

import Variation from "../../../src/instructions/blocks/Variation";
import { RenderSaveProps } from "../../../src/core/blocks/BlockDefinition";
import { RenderEditProps } from "../../../src/core/blocks/BlockDefinition";
import { ExtendedBlockConfiguration } from "../../../src/type-adapters/ExtendedBlockConfiguration";

describe( "The Variation instruction", () => {
	it( "returns the correct configuration.", () => {
		const options: Variation["options"] = {
			name: "office-location",
			title: "Office location",
		};

		const expectedConfiguration: Partial<ExtendedBlockConfiguration> = {
			variations: {
				"office-location",
				"Office location"
				},
			},
		};

		const VariationInstruction = new Variation( 123, options );

		expect( VariationInstruction.configuration() ).toEqual( expectedConfiguration );
	} );
} );
