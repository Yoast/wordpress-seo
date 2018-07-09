import {
	unescapeString,
} from "../../src/helpers/stringHelpers";

describe( "unescapeString", () => {
	it( "decodes &#39; from the string to an apostrophe.", () => {
		const escapedString = "I have apostrophe&#39;s!";

		const expected = "I have apostrophe's!";

		const actual = unescapeString( escapedString );

		expect( actual ).toEqual( expected );
	} );

	it( "decodes &#039; (with a zero) from the string to an apostrophe.", () => {
		const escapedString = "I have apostrophe&#039;s!";

		const expected = "I have apostrophe's!";

		const actual = unescapeString( escapedString );

		expect( actual ).toEqual( expected );
	} );
} );
