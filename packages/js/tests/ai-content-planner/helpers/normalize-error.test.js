import { normalizeError } from "../../../src/ai-content-planner/helpers/normalize-error";

const DEFAULT_ERROR = {
	errorCode: 502,
	errorIdentifier: "",
	errorMessage: "",
	missingLicenses: [],
};

describe( "normalizeError", () => {
	it( "returns all defaults for a null payload", () => {
		expect( normalizeError( null ) ).toEqual( DEFAULT_ERROR );
	} );

	it( "returns all defaults for an undefined payload", () => {
		expect( normalizeError( undefined ) ).toEqual( DEFAULT_ERROR );
	} );

	it( "returns all defaults for an empty object payload", () => {
		expect( normalizeError( {} ) ).toEqual( DEFAULT_ERROR );
	} );

	it( "maps the message property of a plain Error instance to errorMessage", () => {
		const error = new Error( "Something went wrong" );
		const result = normalizeError( error );
		expect( result.errorMessage ).toBe( "Something went wrong" );
		expect( result.errorCode ).toBe( 502 );
	} );

	it( "uses errorMessage from the payload when present", () => {
		const result = normalizeError( { errorCode: 404, errorIdentifier: "not_found", errorMessage: "Not found" } );
		expect( result ).toEqual( {
			errorCode: 404,
			errorIdentifier: "not_found",
			errorMessage: "Not found",
			missingLicenses: [],
		} );
	} );

	it( "maps a raw string payload to errorMessage", () => {
		const result = normalizeError( "Something went wrong" );
		expect( result.errorMessage ).toBe( "Something went wrong" );
		expect( result.errorCode ).toBe( 502 );
		expect( result.errorIdentifier ).toBe( "" );
		expect( result.missingLicenses ).toEqual( [] );
	} );

	it( "fills in defaults for each missing field individually", () => {
		expect( normalizeError( { errorCode: 500 } ) ).toEqual( {
			errorCode: 500,
			errorIdentifier: "",
			errorMessage: "",
			missingLicenses: [],
		} );
	} );

	it( "includes missingLicenses from the payload", () => {
		const result = normalizeError( {
			errorCode: 403,
			errorIdentifier: "license_required",
			errorMessage: "No license",
			missingLicenses: [ "premium" ],
		} );
		expect( result.missingLicenses ).toEqual( [ "premium" ] );
	} );

	it( "prefers errorMessage over message when both are present", () => {
		const result = normalizeError( { errorMessage: "Specific message", message: "Generic message" } );
		expect( result.errorMessage ).toBe( "Specific message" );
	} );

	it( "falls back to message when errorMessage is absent", () => {
		const result = normalizeError( { message: "Fallback message" } );
		expect( result.errorMessage ).toBe( "Fallback message" );
	} );

	it( "returns a full error object unchanged when all fields are provided", () => {
		const fullError = {
			errorCode: 422,
			errorIdentifier: "validation_failed",
			errorMessage: "Invalid request",
			missingLicenses: [ "woo" ],
		};
		expect( normalizeError( fullError ) ).toEqual( fullError );
	} );
} );
