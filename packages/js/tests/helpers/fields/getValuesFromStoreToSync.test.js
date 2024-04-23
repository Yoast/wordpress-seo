import {
	getFacebookImageId,
	getFacebookTitle,
	getFacebookDescription,
	getFacebookImageUrl,
	getTwitterImageId,
	getTwitterTitle,
	getTwitterDescription,
	getTwitterImageUrl,
	getNoIndex,
	getNoFollow,
	getAdvanced,
	getBreadcrumbsTitle,
	getCanonical,
	getWordProofTimestamp,
	getPageType,
	getArticleType,
} from "../../../src/helpers/fields";
import { STORE_NAME_EDITOR } from "../../../src/shared-admin/constants";
import { select } from "@wordpress/data";

// Tests for the facebookFieldsStore.js, twitterFieldsStore.js and adnacedSettingsFieldsStore.js files.

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
} ) );

const testCasesInteger = [
	{ method: "getFacebookImageId", getFunction: getFacebookImageId  },
	{ method: "getTwitterImageId", getFunction: getTwitterImageId },
	{ method: "getNoIndex", getFunction: getNoIndex  },
	{ method: "getNoFollow", getFunction: getNoFollow },
];

describe.each( testCasesInteger )( "$method", ( { method, getFunction } ) => {
	it( `should return string from ${method} when the value is an integer`, () => {
		select.mockImplementation( ( store ) => {
			if ( store === STORE_NAME_EDITOR.free ) {
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
	{ method: "getAdvanced", getFunction: getAdvanced  },
	{ method: "getBreadcrumbsTitle", getFunction: getBreadcrumbsTitle },
	{ method: "getCanonical", getFunction: getCanonical },
	{ method: "getPageType", getFunction: getPageType },
	{ method: "getArticleType", getFunction: getArticleType },
];

describe.each( testCases )( "$method", ( { method, getFunction } ) => {
	it( `should return string from ${method} when value is string`, () => {
		select.mockImplementation( ( store ) => {
			  if ( store === STORE_NAME_EDITOR.free ) {
				  return {
					  [ method ]: () => "string_result",
				  };
			  }
		  } );

		  const result = getFunction();
		  expect( result ).toBe( "string_result" );
	  } );
} );


describe( "getWordProofTimestamp", () => {
	it( "should return '1' when true", () => {
		select.mockImplementation( ( store ) => {
			if ( store === STORE_NAME_EDITOR.free ) {
				return {
					getWordProofTimestamp: () => true,
				};
			}
		} );

		const result = getWordProofTimestamp();
		expect( result ).toBe( "1" );
	} );
} );

const getWordProofTimestampTestCases = [
	{ value: true, expected: "1" },
	{ value: false, expected: "" },
	{ value: null, expected: "" },
	{ value: undefined, expected: "" },
];
describe.each( getWordProofTimestampTestCases )( "getWordProofTimestamp", ( { value, expected } ) => {
	it( `should return ${expected ? expected : "empty string" } from getWordProofTimestamp when value is ${value}`, () => {
	  select.mockImplementation( ( store ) => {
			if ( store === STORE_NAME_EDITOR.free ) {
				return {
					getWordProofTimestamp: () => value,
				};
			}
		} );

		const result = getWordProofTimestamp();
		expect( result ).toBe( expected );
	} );
} );


