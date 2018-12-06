import FormattingElement from "../../../src/tree/values/FormattingElement";

describe( "FormattingElement", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );
	it( "can make a new FormattingElement object", () => {
		const formattingElement = new FormattingElement( "strong", 5, 30, { id: "some-id" } );

		expect( formattingElement.type ).toEqual( "strong" );
		expect( formattingElement.start ).toEqual( 5 );
		expect( formattingElement.end ).toEqual( 30 );
		expect( formattingElement.attributes ).toEqual( { id: "some-id" } );
	} );

	it( "sets start position to zero when it is smaller, also gives a warning", () => {
		const formattingElement = new FormattingElement( "strong", -4, 20 );

		expect( formattingElement.start ).toEqual( 0 );
		expect( console.warn ).toBeCalled();
	} );

	it( "swaps start and end when end is smaller than start, also gives a warning", () => {
		const start = 20;
		const end = 4;
		const formattingElement = new FormattingElement( "strong", start, end );

		expect( formattingElement.start ).toEqual( end );
		expect( formattingElement.end ).toEqual( start );
		expect( console.warn ).toBeCalled();
	} );

	it( "swaps start and end when end is smaller and constrains start to zero, also gives warnings", () => {
		const start = 20;
		const end = -8;
		const formattingElement = new FormattingElement( "strong", start, end );

		expect( formattingElement.start ).toEqual( 0 );
		expect( formattingElement.end ).toEqual( start );
		expect( console.warn ).toBeCalled();
	} );
} );
