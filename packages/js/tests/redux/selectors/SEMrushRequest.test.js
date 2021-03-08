import { getSEMrushIsRequestPending, getSEMrushRequestHasData, getSEMrushRequestIsSuccess,
	getSEMrushRequestKeyphrase, getSEMrushRequestLimitReached, getSEMrushRequestResponse,
	getSEMrushSelectedCountry } from "../../../src/redux/selectors/SEMrushRequest";

// This mimics parts of the yoast-seo/editor store.
const testState = {
	SEMrushRequest: {
		isRequestPending: false,
		hasData: true,
		isSuccess: true,
		keyphrase: "yoast",
		limitReached: false,
		response: {
			sampleData: "yoastIsAwesome",
		},
		countryCode: "nl",
	},
};

describe( getSEMrushIsRequestPending, () => {
	it( "returns the request pending status", () => {
		const actual = getSEMrushIsRequestPending( testState );

		const expected = false;

		expect( actual ).toEqual( expected );
	} );
} );

describe( getSEMrushRequestHasData, () => {
	it( "returns the data status", () => {
		const actual = getSEMrushRequestHasData( testState );

		const expected = true;

		expect( actual ).toEqual( expected );
	} );
} );

describe( getSEMrushRequestIsSuccess, () => {
	it( "returns the request succession status", () => {
		const actual = getSEMrushRequestIsSuccess( testState );

		const expected = true;

		expect( actual ).toEqual( expected );
	} );
} );

describe( getSEMrushRequestKeyphrase, () => {
	it( "returns the keyphrase for the requested data", () => {
		const actual = getSEMrushRequestKeyphrase( testState );

		const expected = "yoast";

		expect( actual ).toEqual( expected );
	} );
} );

describe( getSEMrushRequestLimitReached, () => {
	it( "returns whether the request limit has been reached", () => {
		const actual = getSEMrushRequestLimitReached( testState );

		const expected = false;

		expect( actual ).toEqual( expected );
	} );
} );

describe( getSEMrushRequestResponse, () => {
	it( "returns the response of the request", () => {
		const actual = getSEMrushRequestResponse( testState );

		const expected = {
			sampleData: "yoastIsAwesome",
		};

		expect( actual ).toEqual( expected );
	} );
} );

describe( getSEMrushSelectedCountry, () => {
	it( "returns the country for the requested data", () => {
		const actual = getSEMrushSelectedCountry( testState );

		const expected = "nl";

		expect( actual ).toEqual( expected );
	} );
} );
