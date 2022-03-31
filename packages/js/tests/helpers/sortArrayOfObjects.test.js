import { sortArrayOfObjects } from "../../src/helpers/sortArrayOfObjects";

describe( "a test for sorting array of objects alphabetically", () => {
	it( "should returns a sorted array of objects", () => {
		const array = [
			{ name: "dogs" },
			{ name: "cats" },
			{ name: "lemurs" },
		];
		expect( sortArrayOfObjects( array ) ).toEqual( [
			{ name: "cats" },
			{ name: "dogs" },
			{ name: "lemurs" },
		] );
	} );
	it( "makes sure the array of objects are ordered correctly regardless of the text content case (lower or upper)", () => {
		const array = [
			{ name: "Dogs" },
			{ name: "cats" },
			{ name: "leMurs" },
		];
		expect( sortArrayOfObjects( array ) ).toEqual( [
			{ name: "cats" },
			{ name: "Dogs" },
			{ name: "leMurs" },
		] );
	} );
} );
