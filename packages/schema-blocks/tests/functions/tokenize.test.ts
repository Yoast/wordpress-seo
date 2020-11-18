import tokenize from "../../src/functions/tokenize";

const testData = [
	{
		description: "string",
		testString: '{{instruction name="value"}}',
		expected: [ {
			column: 20,
			line: 1,
			pos: 19,
			text: "\"value\"",
			type: "value",
			value: "value",
		} ],
	},
	{
		description: "an array containing an empty object",
		testString: "{{instruction name=[{}] }}",
		expected: [
			{
				column: 20,
				line: 1,
				pos: 19,
				text: "[",
				type: "array-open",
				value: "[",
			},
			{
				column: 21,
				line: 1,
				pos: 20,
				text: "{}",
				type: "empty-object",
				value: "{}",
			},
			{
				column: 23,
				line: 1,
				pos: 22,
				text: "]",
				type: "array-close",
				value: "]",
			},
		],
	},
	{
		description: "an empty object",
		testString: "{{instruction name={} }}",
		expected: [
			{
				column: 20,
				line: 1,
				pos: 19,
				text: "{}",
				type: "empty-object",
				value: "{}",
			},
		],
	},
	{
		description: "a simple object",
		testString: '{{instruction name={"foo": "bar", "baz": "qux"} }}',
		expected: [
			{
				column: 20,
				line: 1,
				pos: 19,
				text: "{",
				type: "object-open",
				value: "{",
			},
			{
				column: 21,
				line: 1,
				pos: 20,
				text: "\"foo\":",
				type: "key",
				value: "foo",
			},
			{
				column: 27,
				line: 1,
				pos: 26,
				text: " \"bar\"",
				type: "value",
				value: "bar",
			},
			{
				column: 34,
				line: 1,
				pos: 33,
				text: " \"baz\":",
				type: "key",
				value: "baz",
			},
			{
				column: 41,
				line: 1,
				pos: 40,
				text: " \"qux\"",
				type: "value",
				value: "qux",
			},
			{
				column: 47,
				line: 1,
				pos: 46,
				text: "}",
				type: "object-close",
				value: "}",
			},
		],
	},
	{
		description: "a nested object",
		testString: '{{instruction name={"foo": ["bar","baz"] } }}',
		expected: [
			{
				column: 20,
				line: 1,
				pos: 19,
				text: "{",
				type: "object-open",
				value: "{",
			},
			{
				column: 21,
				line: 1,
				pos: 20,
				text: "\"foo\":",
				type: "key",
				value: "foo",
			},
			{
				column: 27,
				line: 1,
				pos: 26,
				text: " [",
				type: "array-open",
				value: " [",
			},
			{
				column: 29,
				line: 1,
				pos: 28,
				text: "\"bar\"",
				type: "value",
				value: "bar",
			},
			{
				column: 35,
				line: 1,
				pos: 34,
				text: "\"baz\"",
				type: "value",
				value: "baz",
			},
			{
				column: 40,
				line: 1,
				pos: 39,
				text: "]",
				type: "array-close",
				value: "]",
			},
			{
				column: 41,
				line: 1,
				pos: 40,
				text: " }",
				type: "object-close",
				value: " }",
			},
		],
	},
	{
		description: "an object containing an array",
		testString: '{{instruction name={"foo": ["bar","baz"] } }}',
		expected: [
			{
				column: 20,
				line: 1,
				pos: 19,
				text: "{",
				type: "object-open",
				value: "{",
			},
			{
				column: 21,
				line: 1,
				pos: 20,
				text: "\"foo\":",
				type: "key",
				value: "foo",
			},
			{
				column: 27,
				line: 1,
				pos: 26,
				text: " [",
				type: "array-open",
				value: " [",
			},
			{
				column: 29,
				line: 1,
				pos: 28,
				text: "\"bar\"",
				type: "value",
				value: "bar",
			},
			{
				column: 35,
				line: 1,
				pos: 34,
				text: "\"baz\"",
				type: "value",
				value: "baz",
			},
			{
				column: 40,
				line: 1,
				pos: 39,
				text: "]",
				type: "array-close",
				value: "]",
			},
			{
				column: 41,
				line: 1,
				pos: 40,
				text: " }",
				type: "object-close",
				value: " }",
			},
		],
	},
	{
		description: "a simple array",
		testString: '{{instruction name=["foo", "bar"] }}',
		expected: [
			{
				column: 20,
				line: 1,
				pos: 19,
				text: "[",
				type: "array-open",
				value: "[",
			},
			{
				column: 21,
				line: 1,
				pos: 20,
				text: "\"foo\"",
				type: "value",
				value: "foo",
			},
			{
				column: 27,
				line: 1,
				pos: 26,
				text: " \"bar\"",
				type: "value",
				value: "bar",
			},
			{
				column: 33,
				line: 1,
				pos: 32,
				text: "]",
				type: "array-close",
				value: "]",
			},
		],
	},
	{
		description: "a nested array",
		testString: '{{instruction name=["foo", ["bar", "baz"]] }}',
		expected: [
			{
				column: 20,
				line: 1,
				pos: 19,
				text: "[",
				type: "array-open",
				value: "[",
			},
			{
				column: 21,
				line: 1,
				pos: 20,
				text: "\"foo\"",
				type: "value",
				value: "foo",
			},
			{
				column: 27,
				line: 1,
				pos: 26,
				text: " [",
				type: "array-open",
				value: " [",
			},
			{
				column: 29,
				line: 1,
				pos: 28,
				text: "\"bar\"",
				type: "value",
				value: "bar",
			},
			{
				column: 35,
				line: 1,
				pos: 34,
				text: " \"baz\"",
				type: "value",
				value: "baz",
			},
			{
				column: 41,
				line: 1,
				pos: 40,
				text: "]",
				type: "array-close",
				value: "]",
			},
			{
				column: 42,
				line: 1,
				pos: 41,
				text: "]",
				type: "array-close",
				value: "]",
			},
		],
	},
	{
		description: "an array containing an object",
		testString: '{{instruction name=["foo",{ "bar": "baz" }] }}',
		expected: [
			{
				column: 20,
				line: 1,
				pos: 19,
				text: "[",
				type: "array-open",
				value: "[",
			},
			{
				column: 21,
				line: 1,
				pos: 20,
				text: "\"foo\"",
				type: "value",
				value: "foo",
			},
			{
				column: 27,
				line: 1,
				pos: 26,
				text: "{",
				type: "object-open",
				value: "{",
			},
			{
				column: 28,
				line: 1,
				pos: 27,
				text: " \"bar\":",
				type: "key",
				value: "bar",
			},
			{
				column: 35,
				line: 1,
				pos: 34,
				text: " \"baz\"",
				type: "value",
				value: "baz",
			},
			{
				column: 41,
				line: 1,
				pos: 40,
				text: " }",
				type: "object-close",
				value: " }",
			},
			{
				column: 43,
				line: 1,
				pos: 42,
				text: "]",
				type: "array-close",
				value: "]",
			},
		],

	},
];

describe.each( testData )( "the tokenize function", ( data ) => {
	it( `extracts ${data.description} from the instruction's definition value`, () => {
		expect( tokenize( data.testString ) ).toEqual( expect.arrayContaining( data.expected ) );
	} );
} );


describe( "the tokenize function", () => {
	it( "extract a constant from the instruction", () => {
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

	it( "extract a definition from the instruction", () => {
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
