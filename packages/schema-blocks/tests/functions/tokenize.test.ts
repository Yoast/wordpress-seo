import tokenize from "../../src/functions/tokenize";
import testData from "./tokenize.testdata";

describe.each( testData )( "the tokenize function", ( data ) => {
	it( `extracts ${data.description} from the instruction's definition value`, () => {
		expect( tokenize( data.testString ) ).toEqual( expect.arrayContaining( data.expected ) );
	} );
} );


describe( "the tokenize function", () => {
	it( "extracts a constant from the instruction", () => {
		const expected = [ {
			column: 1,
			line: 1,
			pos: 0,
			text: "{{ instruction }}",
			type: "constant",
			value: "{{ instruction }}",
		} ];

		const actual = tokenize( "{{ instruction }}" );

		expect( actual ).toEqual( expect.arrayContaining( expected ) );
	} );

	it( "extracts a definition from the instruction", () => {
		const expected = [ {
			column: 1,
			line: 1,
			pos: 0,
			text: "{{instruction",
			type: "definition",
			value: "instruction",
		} ];

		const actual = tokenize( "{{instruction }}" );

		expect( actual ).toEqual( expect.arrayContaining( expected ) );
	} );

	/**
	 * Tested this separately because there is a type mismatch when using
	 * data provider.
	 */
	it( "extracts a number from the instruction's definition value", () => {
		const expected = [ {
			column: 20,
			line: 1,
			pos: 19,
			text: "1337",
			type: "value",
			value: 1337,
		} ];

		const actual = tokenize( "{{instruction name=1337 }}" );

		expect( actual ).toEqual( expect.arrayContaining( expected ) );
	} );

	/**
	 * Tested this separately because there is a type mismatch when using
	 * data provider.
	 */
	it( "extracts a boolean from the instruction's definition value", () => {
		const expected = [ {
			column: 20,
			line: 1,
			pos: 19,
			text: "true",
			type: "value",
			value: true,
		} ];

		const actual = tokenize( "{{instruction name=true }}" );

		expect( actual ).toEqual( expect.arrayContaining( expected ) );
	} );
} );
