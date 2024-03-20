import { getFacebookImageId, getFacebookTitle, getFacebookDescription, getFacebookImageUrl } from "../../../src/helpers/fields/facebookFieldsStore";
import { getTwitterImageId, getTwitterTitle, getTwitterDescription, getTwitterImageUrl } from "../../../src/helpers/fields/twitterFieldsStore";
import { EDITOR_STORE } from "../../../src/shared-admin/constants";
import { select } from "@wordpress/data";

// Tests for the facebookFieldsStore.js and twitterFieldsStore.js files.

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
} ) );

const testCasesInteger = [
	{ method: "getFacebookImageId", getFunction: getFacebookImageId  },
	{ method: "getTwitterImageId", getFunction: getTwitterImageId },
];

describe.each( testCasesInteger )( "$method", ( { method, getFunction } ) => {
	it( `should return string from ${method} when the id is an integer`, () => {
		select.mockImplementation( ( store ) => {
			if ( store === EDITOR_STORE ) {
				return {
					[ method ]: () => 5,
				};
			}
		} );

		const result = getFunction();
		expect( result ).toBe( "5" );
	  } );
} );


const testCases = [
	{ method: "getFacebookImageId", getFunction: getFacebookImageId  },
	{ method: "getFacebookTitle", getFunction: getFacebookTitle },
	{ method: "getFacebookDescription", getFunction: getFacebookDescription },
	{ method: "getFacebookImageUrl", getFunction: getFacebookImageUrl },
	{ method: "getTwitterImageId", getFunction: getTwitterImageId },
	{ method: "getTwitterTitle", getFunction: getTwitterTitle },
	{ method: "getTwitterDescription", getFunction: getTwitterDescription },
	{ method: "getTwitterImageUrl", getFunction: getTwitterImageUrl },
];

describe.each( testCases )( "$method", ( { method, getFunction } ) => {
	it( `should return empty string from ${method} when null`, () => {
		select.mockImplementation( ( store ) => {
			  if ( store === EDITOR_STORE ) {
				  return {
					  [ method ]: () => "string_result",
				  };
			  }
		  } );

		  const result = getFunction();
		  expect( result ).toBe( "string_result" );
	  } );
} );


describe.each( testCases )( "$method", ( { method, getFunction } ) => {
	it( `should return empty string from ${method} when null`, () => {
	  select.mockImplementation( ( store ) => {
			if ( store === EDITOR_STORE ) {
				return {
					[ method ]: () => null,
				};
			}
		} );

		const result = getFunction();
		expect( result ).toBe( "" );
	} );
} );

describe.each( testCases )( "$method", ( { method, getFunction } ) => {
	it( `should return empty string from ${method} when undefined`, () => {
	  select.mockImplementation( ( store ) => {
			if ( store === EDITOR_STORE ) {
				return {
					[ method ]: () => undefined,
				};
			}
		} );

		const result = getFunction();
		expect( result ).toBe( "" );
	} );
} );
