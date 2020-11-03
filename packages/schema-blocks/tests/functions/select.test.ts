import { arrayOrObjectToOptions } from "../../src/functions/select";

describe( "The select function", () => {
	it( "converts an array of strings to an array of options", () => {
		const expected = [
			{ label: "a", value: "a" },
			{ label: "b", value: "b" },
			{ label: "c", value: "c" },
		];

		expect( arrayOrObjectToOptions( [ "a", "b", "c" ] ) ).toEqual( expected );
	} );
} );
