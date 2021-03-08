import {
	firstToUpperCase,
} from "../../src/helpers/stringHelpers";

describe( "firstToUpperCase", () => {
	it( "sets the first character of a string to uppercase", () => {
		const uncapitalizedString = "i should know better and be capitalized";

		const expected = "I should know better and be capitalized";

		const actual = firstToUpperCase( uncapitalizedString );

		expect( actual ).toEqual( expected );
	} );
} );
