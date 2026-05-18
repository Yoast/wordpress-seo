import apiFetch from "@wordpress/api-fetch";
import { ABORTED_ERROR, contentPlannerFetch } from "../../../src/ai-content-planner/helpers/fetch";

jest.mock( "@wordpress/api-fetch" );

/**
 * Creates a mock apiFetch implementation that rejects with an AbortError
 * when `options.signal` fires or is already aborted.
 *
 * @returns {jest.Mock} A jest mock function that, when called with fetch options, returns a promise that rejects on abort.
 */
const abortableMock = () => jest.fn( ( options ) => {
	if ( options.signal.aborted ) {
		return Promise.reject( new DOMException( "Aborted", "AbortError" ) );
	}
	return new Promise( ( _, reject ) => {
		options.signal.addEventListener( "abort", () => {
			reject( new DOMException( "Aborted", "AbortError" ) );
		} );
	} );
} );

describe( "contentPlannerFetch", () => {
	beforeEach( () => {
		jest.useFakeTimers();
		apiFetch.mockReset();
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	it( "returns parsed JSON on a successful response", async() => {
		const payload = { idea: "content plan" };
		apiFetch.mockResolvedValue( { json: () => Promise.resolve( payload ) } );

		const result = await contentPlannerFetch( { path: "/yoast/v1/test" } );

		expect( result ).toEqual( payload );
	} );

	it( "defaults to the GET method when none is specified", async() => {
		apiFetch.mockResolvedValue( { json: () => Promise.resolve( {} ) } );

		await contentPlannerFetch( { path: "/yoast/v1/test" } );

		expect( apiFetch ).toHaveBeenCalledWith( expect.objectContaining( { method: "GET" } ) );
	} );

	it( "passes the method and data in the fetch options for POST requests", async() => {
		apiFetch.mockResolvedValue( { json: () => Promise.resolve( {} ) } );

		await contentPlannerFetch( { path: "/yoast/v1/test", method: "POST", data: { topic: "SEO" } } );

		expect( apiFetch ).toHaveBeenCalledWith( expect.objectContaining( {
			path: "/yoast/v1/test",
			method: "POST",
			data: { topic: "SEO" },
			parse: false,
		} ) );
	} );

	it( "does not include data in the fetch options when it is not provided", async() => {
		apiFetch.mockResolvedValue( { json: () => Promise.resolve( {} ) } );

		await contentPlannerFetch( { path: "/yoast/v1/test" } );

		const [ options ] = apiFetch.mock.calls[ 0 ];
		expect( options ).not.toHaveProperty( "data" );
	} );

	it( "uses the provided AbortController's signal", async() => {
		const controller = new AbortController();
		apiFetch.mockResolvedValue( { json: () => Promise.resolve( {} ) } );

		await contentPlannerFetch( { path: "/yoast/v1/test", abortController: controller } );

		expect( apiFetch ).toHaveBeenCalledWith( expect.objectContaining( { signal: controller.signal } ) );
	} );

	it( "throws a timeout error when the internal timer fires before the response arrives", async() => {
		apiFetch.mockImplementation( abortableMock() );

		const fetchPromise = contentPlannerFetch( { path: "/yoast/v1/test" } );
		jest.runAllTimers();

		await expect( fetchPromise ).rejects.toEqual( {
			errorCode: 408,
			errorIdentifier: "",
			errorMessage: "timeout",
		} );
	} );

	it( "throws ABORTED_ERROR when the caller aborts the request before the timeout fires", async() => {
		const controller = new AbortController();
		apiFetch.mockImplementation( abortableMock() );

		const fetchPromise = contentPlannerFetch( { path: "/yoast/v1/test", abortController: controller } );
		// Abort before timers advance — isTimeout stays false.
		controller.abort();

		await expect( fetchPromise ).rejects.toEqual( ABORTED_ERROR );
	} );

	it( "throws ABORTED_ERROR when a pre-aborted controller is supplied", async() => {
		const controller = new AbortController();
		controller.abort();
		apiFetch.mockImplementation( abortableMock() );

		await expect( contentPlannerFetch( { path: "/yoast/v1/test", abortController: controller } ) ).rejects.toEqual( ABORTED_ERROR );
	} );

	it( "throws a structured error with status and body fields on an HTTP error response", async() => {
		const errorResponse = {
			status: 422,
			json: () => Promise.resolve( { errorIdentifier: "validation_error", message: "Invalid input" } ),
		};
		apiFetch.mockRejectedValue( errorResponse );

		await expect( contentPlannerFetch( { path: "/yoast/v1/test" } ) ).rejects.toEqual( {
			errorCode: 422,
			errorIdentifier: "validation_error",
			errorMessage: "Invalid input",
			missingLicenses: [],
		} );
	} );

	it( "falls back to errorCode 502 when the error response has no status", async() => {
		const errorResponse = { json: () => Promise.resolve( {} ) };
		apiFetch.mockRejectedValue( errorResponse );

		await expect( contentPlannerFetch( { path: "/yoast/v1/test" } ) ).rejects.toEqual( {
			errorCode: 502,
			errorIdentifier: "",
			errorMessage: "",
			missingLicenses: [],
		} );
	} );

	it( "includes missingLicenses from the error body", async() => {
		const errorResponse = {
			status: 403,
			json: () => Promise.resolve( { errorIdentifier: "license_required", message: "No license", missingLicenses: [ "premium" ] } ),
		};
		apiFetch.mockRejectedValue( errorResponse );

		const result = await contentPlannerFetch( { path: "/yoast/v1/test" } ).catch( ( e ) => e );

		expect( result.missingLicenses ).toEqual( [ "premium" ] );
	} );

	it( "returns a 502 structured error when the success response body is not valid JSON", async() => {
		// Simulate a response whose .json() rejects (malformed body).
		// The SyntaxError is not an AbortError, so buildHttpError handles it and
		// produces a structured 502 fallback rather than re-throwing the raw error.
		apiFetch.mockResolvedValue( { json: () => Promise.reject( new SyntaxError( "Unexpected token" ) ) } );

		await expect( contentPlannerFetch( { path: "/yoast/v1/test" } ) ).rejects.toEqual( {
			errorCode: 502,
			errorIdentifier: "",
			errorMessage: "",
			missingLicenses: [],
		} );
	} );
} );
