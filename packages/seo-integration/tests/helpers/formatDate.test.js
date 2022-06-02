import formatDate from "../../src/helpers/formatDate";

describe( "The formatDate function", () => {
	it( "formats dates correctly", () => {
		const dates = [
			{
				dateString: "2022-05-28T11:55:56.000Z",
				expected: "May 28, 2022",
			},
			{
				dateString: "2024-11-13T11:55:56.000Z",
				expected: "Nov 13, 2024",
			},
			{
				dateString: "1999-01-13T11:55:56.000Z",
				expected: "Jan 13, 1999",
			},
		];

		dates.forEach( date => {
			expect( formatDate( date.dateString ) ).toEqual( date.expected );
		} );
	} );
} );
