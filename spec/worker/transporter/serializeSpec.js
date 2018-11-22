import AssessmentResult from "../../../src/values/AssessmentResult";
import serialize from "../../../src/worker/transporter/serialize";

describe( "serialize", () => {
	it( "serializes strings", () => {
		expect( serialize( "A sample text." ) ).toBe( "A sample text." );
	} );

	it( "serializes numbers", () => {
		expect( serialize( 5 ) ).toBe( 5 );
	} );

	it( "serializes arrays of strings and numbers", () => {
		expect( serialize( [ 5, "hello", 9 ] ) ).toEqual( [ 5, "hello", 9 ] );
	} );

	it( "serializes objects", () => {
		const thing = {
			hello: "world",
			5: "six",
			"some stuff": "",
		};
		expect( serialize( thing ) ).toEqual( thing );
	} );

	it( "serializes nested objects", () => {
		const thing = {
			hello: "world",
			5: "six",
			"some stuff": {
				"blah blah": {
					answer: 42,
				},
			},
		};
		expect( serialize( thing ) ).toEqual( thing );
	} );

	it( "replaces functions with empty objects", () => {
		const thing = {
			hello: "world",
			5: "six",
			"some stuff": () => "nope",
		};
		const expected = {
			hello: "world",
			5: "six",
			"some stuff": {},
		};
		expect( serialize( thing ) ).toEqual( expected );
		expect( serialize( () => "no way" ) ).toEqual( {} );
	} );

	it( "serializes AssessmentResults", () => {
		const thing = new AssessmentResult();
		thing.setScore( 666 );
		thing.setText( "Good job!" );

		expect( serialize( thing ) ).toEqual( {
			_parseClass: "AssessmentResult",
			identifier: "",
			marks: [],
			score: 666,
			text: "Good job!",
		} );
	} );

	it( "serializes Papers", () => {
		const thing = new Paper( "" )

		expect( serialize( thing ) ).toEqual( {
			_parseClass: "AssessmentResult",
			identifier: "",
			marks: [],
			score: 666,
			text: "Good job!",
		} );
	} );
} );
