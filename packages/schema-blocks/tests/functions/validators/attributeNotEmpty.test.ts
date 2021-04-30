import { BlockInstance } from "@wordpress/blocks";
import attributeNotEmpty from "../../../src/functions/validators/attributeNotEmpty";

describe( "The attributeNotEmpty function", () => {
	it( "considers an attribute that contains a non-empty string to not be empty.", () => {
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

	it( "considers an attribute that has a number value to not be empty.", () => {
		const blockInstance: BlockInstance = {
			clientId: "clientid",
			name: "name",
			innerBlocks: [],
			isValid: true,
			attributes: {
				title: 565789,
			},
		};

		expect( attributeNotEmpty( blockInstance, "title" ) ).toEqual( true );
	} );

	it( "considers an attribute that contains an empty string to be empty.", () => {
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

	it( "considers an attribute that contains a string with only whitespace to be empty.", () => {
		const blockInstance: BlockInstance = {
			clientId: "clientid",
			name: "name",
			innerBlocks: [],
			isValid: true,
			attributes: {
				title: "       ",
			},
		};

		expect( attributeNotEmpty( blockInstance, "title" ) ).toEqual( false );
	} );

	it( "considers an attribute that contains an empty array to be empty.", () => {
		const blockInstance: BlockInstance = {
			clientId: "clientid",
			name: "name",
			innerBlocks: [],
			isValid: true,
			attributes: {
				title: [],
			},
		};

		expect( attributeNotEmpty( blockInstance, "title" ) ).toEqual( false );
	} );

	it( "considers an attribute that has a `null` value to be empty.", () => {
		const blockInstance: BlockInstance = {
			clientId: "clientid",
			name: "name",
			innerBlocks: [],
			isValid: true,
			attributes: {
				title: null,
			},
		};

		expect( attributeNotEmpty( blockInstance, "title" ) ).toEqual( false );
	} );
} );
