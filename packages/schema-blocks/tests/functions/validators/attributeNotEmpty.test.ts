import { BlockInstance } from "@wordpress/blocks";
import attributeNotEmpty from "../../../src/functions/validators/attributeNotEmpty";

describe( "The attributeNotEmpty function", () => {
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

		expect( attributeNotEmpty( blockInstance, "title" ) ).toEqual( true );
	} );

	it( "validates that an attribute does not exist.", () => {
		const blockInstance: BlockInstance = {
			clientId: "clientid",
			name: "name",
			innerBlocks: [],
			isValid: true,
			attributes: {
				title: "",
			},
		};

		expect( attributeNotEmpty( blockInstance, "title" ) ).toEqual( false );
	} );
} );
