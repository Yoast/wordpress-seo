import buildDurationString from "../../../../src/structured-data-blocks/how-to/utils/buildDurationString";

describe( "buildDurationString", () => {
	it( "returns an empty string when an empty object is passed", () => {
		const expected = "";
		const actual = buildDurationString( {} );

		expect( actual ).toEqual( expected );
	} );

	it( "returns a single time unit when a single parameter is passed", () => {
		const expected = "5 minutes";
		const actual = buildDurationString( {
			minutes: "5",
		} );

		expect( actual ).toEqual( expected );
	} );

	it( "concatenates using 'and' if 2 parameters are passed", () => {
		const expected = "2 hours and 15 minutes";
		const actual = buildDurationString( {
			hours: "2",
			minutes: "15",
		} );

		expect( actual ).toEqual( expected );
	} );

	it( "concatenates using ',' and 'and' if 3 parameters are passed", () => {
		const expected = "7 days, 3 hours and 30 minutes";
		const actual = buildDurationString( {
			days: "7",
			hours: "3",
			minutes: "30",
		} );

		expect( actual ).toEqual( expected );
	} );
} );
