import selectFormattedDate from "../../../src/editor/selectors/selectFormattedDate";

describe( "The selectFormattedDate selector", () => {
	it( "formats dates correctly", () => {
		const testData = [
			{
				state: {
					editor: {
						date: "2022-05-28T11:55:56.000Z",
					},
				},
				expected: "May 28, 2022",
			},
			{
				state: {
					editor: {
						date: "2024-11-13T11:55:56.000Z",
					},
				},
				expected: "Nov 13, 2024",
			},
			{
				state: {
					editor: {
						date: "1999-01-13T11:55:56.000Z",
					},
				},
				expected: "Jan 13, 1999",
			},
		];

		testData.forEach( test => {
			expect( selectFormattedDate( test.state ) ).toEqual( test.expected );
		} );
	} );

	it( "returns an empty string if no date is available on the store", () => {
		const state = {
			editor: {
				date: "",
			},
		}
		expect( selectFormattedDate( state ) ).toEqual( "" );
	} );

	it( "formats dates correctly for a different locale.", () => {
		const testData = [
			{
				state: {
					editor: {
						date: "2022-05-28T11:55:56.000Z",
						locale: "de",
					},
				},
				expected: "Mai 28, 2022",
			},
			{
				state: {
					editor: {
						date: "2024-12-13T11:55:56.000Z",
						locale: "de",
					},
				},
				expected: "Dez 13, 2024",
			},
			{
				state: {
					editor: {
						date: "1999-01-13T11:55:56.000Z",
						locale: "de",
					},
				},
				expected: "Jan 13, 1999",
			},
		];

		testData.forEach( test => {
			expect( selectFormattedDate( test.state ) ).toEqual( test.expected );
		} );
	} );
} );
