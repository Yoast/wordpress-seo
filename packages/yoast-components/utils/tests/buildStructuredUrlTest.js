import buildStructuredUrl from "../buildStructuredUrl";

describe( "buildStructuredUrl", () => {
	it( "correctly replaces multiple URL parts", () => {
		const expected = "https://www.example.com/transportation/flying/the-cost-of-flying/";

		const actual = buildStructuredUrl(
			"https://www.example.com/%category%/%postname%/",
			{
				category: [ "transportation", "flying" ],
				postname: "the-cost-of-flying",
			}
		);

		expect( actual ).toEqual( expected );
	} );

	it( "replaces variables that are present in the urlStructure multiple times", () => {
		const expected = "https://www.example.com/transportation/flying/transportation/flying/";

		const actual = buildStructuredUrl(
			"https://www.example.com/%category%/%category%/",
			{
				category: [ "transportation", "flying" ],
			}
		);

		expect( actual ).toEqual( expected );
	} );
} );
