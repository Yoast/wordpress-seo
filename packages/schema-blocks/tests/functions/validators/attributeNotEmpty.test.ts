import attributeNotEmpty from "../../../src/functions/validators/attributeNotEmpty";

describe( "The attributeNotEmpty function", () => {
	it( "validates that an attribute exists.", () => {
		const attributes = {
			title: "Hello, world!",
		};

		expect( attributeNotEmpty( attributes, "title" ) ).toEqual( true );
	} );

	it( "validates that an attribute does not exist.", () => {
		const attributes = {
			title: "",
		};

		expect( attributeNotEmpty( attributes, "title" ) ).toEqual( false );
	} );
} );
