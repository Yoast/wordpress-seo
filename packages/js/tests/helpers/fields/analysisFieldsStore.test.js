import {
	getFocusKeyphrase,
	getReadabilityScore,
	getInclusiveLanguageScore,
	getSeoScore,
	getEstimatedReadingTime,
	isCornerstoneContent,
} from "../../../src/helpers/fields";
import { STORE_NAME_EDITOR } from "../../../src/shared-admin/constants";
import { select } from "@wordpress/data";

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
} ) );


const testCasesScoresInteger = [
	{ method: "getReadabilityResults", getFunction: getReadabilityScore, returnValueSelect: { overallScore: 5 } },
	{ method: "getInclusiveLanguageResults", getFunction: getInclusiveLanguageScore, returnValueSelect: { overallScore: 5 } },
	{ method: "getSeoResults", getFunction: getSeoScore, returnValueSelect: { overallScore: 5 } },
	{ method: "getEstimatedReadingTime", getFunction: getEstimatedReadingTime, returnValueSelect: 5 },
];

describe.each( testCasesScoresInteger )( "$method", ( { method, getFunction, returnValueSelect } ) => {
	it( `should return string from ${method} when the score is an integer`, () => {
		select.mockImplementation( ( store ) => {
			if ( store === STORE_NAME_EDITOR.free ) {
				return {
					[ method ]: () => {
						return returnValueSelect;
					},
				};
			}
		} );

		const result = getFunction();
		expect( result ).toBe( "5" );
	  } );
} );

const testCasesScoresNull = [
	{ method: "getReadabilityResults", getFunction: getReadabilityScore, returnValueSelect: { overallScore: null } },
	{ method: "getInclusiveLanguageResults", getFunction: getInclusiveLanguageScore, returnValueSelect: { overallScore: null } },
	{ method: "getSeoResults", getFunction: getSeoScore, returnValueSelect: { overallScore: null } },
	{ method: "getEstimatedReadingTime", getFunction: getEstimatedReadingTime, returnValueSelect: null },
];

describe.each( testCasesScoresNull )( "$method", ( { method, getFunction, returnValueSelect } ) => {
	it( `should return zero string from ${method} when null`, () => {
	  select.mockImplementation( ( store ) => {
			if ( store === STORE_NAME_EDITOR.free ) {
				return {
					[ method ]: () => {
						return returnValueSelect;
					},
				};
			}
		} );

		const result = getFunction();
		expect( result ).toBe( "0" );
	} );
} );

const testCasesScoresUndefined = [
	{ method: "getReadabilityResults", getFunction: getReadabilityScore, returnValueSelect: { overallScore: undefined } },
	{ method: "getInclusiveLanguageResults", getFunction: getInclusiveLanguageScore, returnValueSelect: { overallScore: undefined } },
	{ method: "getSeoResults", getFunction: getSeoScore, returnValueSelect: { overallScore: undefined } },
	{ method: "getEstimatedReadingTime", getFunction: getEstimatedReadingTime, returnValueSelect: undefined },
];

describe.each( testCasesScoresUndefined )( "$method", ( { method, getFunction, returnValueSelect } ) => {
	it( `should return zero string from ${method} when undefined`, () => {
	  select.mockImplementation( ( store ) => {
			if ( store === STORE_NAME_EDITOR.free ) {
				return {
					[ method ]: () => {
						return returnValueSelect;
					},
				};
			}
		} );

		const result = getFunction();
		expect( result ).toBe( "0" );
	} );
} );


const boolenaTestCases = [
	{ value: true, expected: "1" },
	{ value: false, expected: "0" },
];
describe.each( boolenaTestCases )( "isCornerstoneContent", ( { value, expected } ) => {
	it( `should return ${expected} from isCornerstoneContent when value is ${value}`, () => {
	  select.mockImplementation( ( store ) => {
			if ( store === STORE_NAME_EDITOR.free ) {
				return {
					isCornerstoneContent: () => value,
				};
			}
		} );

		const result = isCornerstoneContent();
		expect( result ).toBe( expected );
	} );
} );

const focusKeyphraseTestCases = [
	{ value: "test", expected: "test" },
];

describe.each( focusKeyphraseTestCases )( "getFocusKeyphrase", ( { value, expected } ) => {
	it( `should return ${expected} from getFocusKeyphrase when value is ${value}`, () => {
	  select.mockImplementation( ( store ) => {
			if ( store === STORE_NAME_EDITOR.free ) {
				return {
					getFocusKeyphrase: () => value,
				};
			}
		} );

		const result = getFocusKeyphrase();
		expect( result ).toBe( expected );
	} );
} );
