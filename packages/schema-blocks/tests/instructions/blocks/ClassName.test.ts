import ClassName from "../../../src/instructions/blocks/ClassName";
import { RenderEditProps } from "../../../src/core/blocks/BlockDefinition";

describe( "The ClassName instruction", () => {
	it( "can correctly render in the editor", () => {
		const className = new ClassName( 10, { name: "some_name" } );

		const props: RenderEditProps = {
			attributes: {},
			clientId: "",
			isSelected: false,
			setAttributes: jest.fn(),
			className: "class-name",
		};

		expect( className.edit( props ) ).toEqual( "class-name" );
	} );

	it( "can correctly render on the frontend", () => {
		const className = new ClassName( 10, { name: "some_name" } );

		expect( className.save() ).toEqual( "yoast-inner-container" );
	} );
} );
