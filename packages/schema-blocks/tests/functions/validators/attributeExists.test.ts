import { BlockInstance } from "@wordpress/blocks";
import attributeExists from "../../../src/functions/validators/attributeExists";

describe( "The attributeExists function", () => {
	it( "validates that an attribute exists.", () => {
		const blockInstance: BlockInstance = {
			clientId: "clientid",
			name: "name",
			innerBlocks: [],
			isValid: true,
			attributes: {
				title: "Hello, world!",
			},
		};

		expect( attributeExists( blockInstance, "title" ) ).toEqual( true );
	} );

	it( "validates that an attribute does not exist.", () => {
		const blockInstance: BlockInstance = {
			clientId: "clientid",
			name: "name",
			innerBlocks: [],
			isValid: true,
			attributes: {
				text: "This is some text.",
			},
		} as BlockInstance;

		expect( attributeExists( blockInstance, "title" ) ).toEqual( false );
	} );
} );
