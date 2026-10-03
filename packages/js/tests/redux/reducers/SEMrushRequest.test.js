import { setSEMrushChangeCountry, setSEMrushNewRequest, setSEMrushRequestSucceeded,
	setSEMrushRequestFailed, setSEMrushSetRequestLimitReached, setSEMrushNoResultsFound } from "../../../src/redux/actions/SEMrushRequest";
import requestReducerSEMrush from "../../../src/redux/reducers/SEMrushRequest";

describe( "semrushRequestReducer", () => {
	it( "sets countryCode to nl when the reducer is called with a setSEMrushChangeCountry action creator that is called with nl", () => {
		const state = {
			isRequestPending: false,
			keyphrase: "",
			countryCode: "us",
			isSuccess: false,
			response: null,
			limitReached: false,
			hasData: true,
		};

		const action = setSEMrushChangeCountry( "nl" );

		const expected = {
			isRequestPending: false,
			keyphrase: "",
			countryCode: "nl",
			isSuccess: false,
			response: null,
			limitReached: false,
			hasData: true,
		};
		const actual = requestReducerSEMrush( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets the state to an open request when the reducer is " +
		"called with a setSEMrushNewRequest action creator that is called with nl and yoast", () => {
		const state = {
			isRequestPending: false,
			keyphrase: "",
			countryCode: "us",
			isSuccess: false,
			response: null,
			limitReached: false,
			hasData: true,
		};

		const generator = setSEMrushNewRequest( "nl", "yoast" );
		const actualPending = generator.next().value;

		const expectedPending = {
			type: "SET_REQUEST_PENDING",
		};

		expect( actualPending ).toEqual( expectedPending );

		const actualNewRequest = generator.next().value;

		const expected = {
			isRequestPending: false,
			keyphrase: "yoast",
			countryCode: "nl",
			isSuccess: false,
			response: null,
			limitReached: false,
			hasData: true,
		};
		const actual = requestReducerSEMrush( state, actualNewRequest );

		expect( actual ).toEqual( expected );
	} );

	it( "sets the state to a successful request when the reducer is called with" +
		" a setSEMrushRequestSucceeded action creator that is called with a sample response", () => {
		const state = {
			isRequestPending: false,
			keyphrase: "",
			countryCode: "us",
			isSuccess: false,
			response: null,
			limitReached: false,
			hasData: true,
		};
		state.keyphrase = "yoast";
		state.countryCode = "nl";

		const action = setSEMrushRequestSucceeded( {
			data: { exampleData: "yoast" },
			status: 200,
		} );

		const expected = {
			isRequestPending: false,
			keyphrase: "yoast",
			countryCode: "nl",
			isSuccess: true,
			response: {
				data: { exampleData: "yoast" },
				status: 200,
			},
			limitReached: false,
			hasData: true,
		};
		const actual = requestReducerSEMrush( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets the state to a failed request when the reducer is called " +
		"with a setSEMrushRequestFailed action creator that is called with a sample response", () => {
		const state = {
			isRequestPending: false,
			keyphrase: "",
			countryCode: "us",
			isSuccess: false,
			response: null,
			limitReached: false,
			hasData: true,
		};
		state.keyphrase = "yoast";
		state.countryCode = "nl";

		const action = setSEMrushRequestFailed( {
			error: "ERROR 134 :: TOTAL LIMIT EXCEEDED",
			status: 403,
		} );

		const expected = {
			isRequestPending: false,
			keyphrase: "yoast",
			countryCode: "nl",
			isSuccess: false,
			response: {
				error: "ERROR 134 :: TOTAL LIMIT EXCEEDED",
				status: 403,
			},
			limitReached: false,
			hasData: false,
		};
		const actual = requestReducerSEMrush( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets the state to limit reached when the reducer is called with a setSEMrushSetRequestLimitReached action creator", () => {
		const state = {
			isRequestPending: false,
			keyphrase: "",
			countryCode: "us",
			isSuccess: false,
			response: null,
			limitReached: false,
			hasData: true,
		};

		const action = setSEMrushSetRequestLimitReached();

		const expected = {
			isRequestPending: false,
			keyphrase: "",
			countryCode: "us",
			isSuccess: false,
			response: null,
			limitReached: true,
			hasData: false,
		};
		const actual = requestReducerSEMrush( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets the state to no results found when the reducer is called with a setSEMrushNoResultsFound action creator", () => {
		const state = {
			isRequestPending: false,
			keyphrase: "yoast",
			countryCode: "nl",
			isSuccess: false,
			response: null,
			limitReached: false,
			hasData: true,
		};

		const action = setSEMrushNoResultsFound( "nl", "yoast" );

		const expected = {
			isRequestPending: false,
			keyphrase: "yoast",
			countryCode: "nl",
			isSuccess: true,
			response: null,
			limitReached: false,
			hasData: false,
		};

		const actual = requestReducerSEMrush( state, action );

		expect( actual ).toEqual( expected );
	} );
} );
