import FormattingElement from "../../../src/tree/values/FormattingElement";

describe( "FormattingElement", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );
	it( "can make a new FormattingElement object", () => {
		const formattingElement = new FormattingElement( "strong", 5, 30, { id: "some-id" } );

		expect( formattingElement.type ).toEqual( "strong" );
		expect( formattingElement.startIndex ).toEqual( 5 );
		expect( formattingElement.endIndex ).toEqual( 30 );
		expect( formattingElement.attributes ).toEqual( { id: "some-id" } );
	} );

	it( "sets start position to zero when it is smaller, also gives a warning", () => {
		const formattingElement = new FormattingElement( "strong", -4, 20 );

		expect( formattingElement.startIndex ).toEqual( 0 );
		expect( console.warn ).toBeCalled();
	} );

	it( "swaps start and end when end is smaller than start, also gives a warning", () => {
		const start = 20;
		const end = 4;
		const formattingElement = new FormattingElement( "strong", start, end );

		expect( formattingElement.startIndex ).toEqual( end );
		expect( formattingElement.endIndex ).toEqual( start );
		expect( console.warn ).toBeCalled();
	} );

	it( "swaps start and end when end is smaller and constrains both to zero, also gives warnings", () => {
		const start = -6;
		const end = -8;
		const formattingElement = new FormattingElement( "strong", start, end );

		expect( formattingElement.startIndex ).toEqual( 0 );
		expect( formattingElement.endIndex ).toEqual( 0 );
		expect( console.warn ).toBeCalled();
	} );
} );
