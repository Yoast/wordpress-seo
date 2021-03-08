import { CHANGE_COUNTRY, NEW_REQUEST, SET_REQUEST_SUCCEEDED,
	SET_REQUEST_FAILED, SET_REQUEST_LIMIT_REACHED, NO_DATA_FOUND,
	setSEMrushChangeCountry, setSEMrushNewRequest, setSEMrushRequestSucceeded,
	setSEMrushRequestFailed, setSEMrushSetRequestLimitReached, setSEMrushNoResultsFound } from "../../../src/redux/actions/SEMrushRequest";

describe( "SEMrushRequest actions", () => {
	it( "returns a CHANGE_COUNTRY action with countryCode: nl when setSEMrushOpenModal is called with nl", () => {
		const expected =  {
			type: CHANGE_COUNTRY,
			countryCode: "nl",
		};
		const actual = setSEMrushChangeCountry( "nl" );

		expect( actual ).toEqual( expected );
	} );
	it( "returns a NEW_REQUEST action with countryCode: nl and keyphrase: " +
		"yoast when setSEMrushNewRequest is called with nl and yoast", () => {
		const expected =  {
			type: NEW_REQUEST,
			countryCode: "nl",
			keyphrase: "yoast",
		};
		const actual = setSEMrushNewRequest( "nl", "yoast" );

		expect( actual ).toEqual( expected );
	} );
	it( "returns a SET_REQUEST_SUCCEEDED action with { response: \"exampleresponse\" } " +
		"when setSEMrushRequestSucceeded is called with { response: \"exampleresponse\" }", () => {
		const expected =  {
			type: SET_REQUEST_SUCCEEDED,
			response: {
				data: { exampleData: "yoast" },
				status: 200,
			},
		};
		const actual = setSEMrushRequestSucceeded( {
			data: { exampleData: "yoast" },
			status: 200,
		} );

		expect( actual ).toEqual( expected );
	} );
	it( "returns a SET_REQUEST_FAILED action with { response: \"exampleresponse\" } " +
		"when setSEMrushRequestFailed is called with { response: \"exampleresponse\" }", () => {
		const expected =  {
			type: SET_REQUEST_FAILED,
			response: {
				error: "ERROR 134 :: TOTAL LIMIT EXCEEDED",
				status: 403,
			},
		};
		const actual = setSEMrushRequestFailed( {
			error: "ERROR 134 :: TOTAL LIMIT EXCEEDED",
			status: 403,
		} );

		expect( actual ).toEqual( expected );
	} );
	it( "returns a SET_REQUEST_LIMIT_REACHED action when " +
		"setSEMrushSetRequestLimitReached is called", () => {
		const expected =  {
			type: SET_REQUEST_LIMIT_REACHED,
		};
		const actual = setSEMrushSetRequestLimitReached();

		expect( actual ).toEqual( expected );
	} );
	it( "returns a NO_DATA_FOUND action with countryCode: nl and " +
		"keyphrase: yoast when setSEMrushNoResultsFound is called with countryCode: nl and keyphrase: yoast", () => {
		const expected =  {
			type: NO_DATA_FOUND,
		};
		const actual = setSEMrushNoResultsFound();

		expect( actual ).toEqual( expected );
	} );
} );
