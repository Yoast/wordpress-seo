import attributeExists from "../../../src/functions/validators/attributeExists";

describe( "The attributeExists function", () => {
	it( "validates that an attribute exists.", () => {
		const attributes = {
			title: "Hello, world!",
		};

		expect( attributeExists( attributes, "title" ) ).toEqual( true );
	} );

	it( "validates that an attribute does not exist.", () => {
		const attributes = {
			text: "This is some text.",
		};

		expect( attributeExists( attributes, "title" ) ).toEqual( false );
	} );
} );
