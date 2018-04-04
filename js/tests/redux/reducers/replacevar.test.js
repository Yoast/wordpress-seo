/* global describe it expect */

import reducer from "../../../src/redux/reducers/replacevars";

describe( "replacevar reducer", () => {
	it( "adds a new replacevar value", () => {
		const action = {
			type: "WPSEO_ADD_REPLACEVAR",
			replacevar: {
				type: "parentTitle",
				id: "2",
				value: "Sample page",
			},
		};
		const expectedState = {
			parentTitle: {
				2: "Sample page",
			},
		};
		// eslint-disable-next-line no-undefined
		expect( reducer( undefined, action ) ).toEqual( expectedState );
	} );
	it( "adds an additional replacevar value", () => {
		const action = {
			type: "WPSEO_ADD_REPLACEVAR",
			replacevar: {
				type: "parentTitle",
				id: "2",
				value: "Sample page",
			},
		};
		const state = {
			parentTitle: {
				1: "Another example page",
			},
		};
		const expectedState = {
			parentTitle: {
				1: "Another example page",
				2: "Sample page",
			},
		};
		expect( state ).not.toBe( expectedState );
		expect( reducer( state, action ) ).toEqual( expectedState );
	} );
	it( "overwrites an existing value", () => {
		const action = {
			type: "WPSEO_ADD_REPLACEVAR",
			replacevar: {
				type: "parentTitle",
				id: "2",
				value: "Sample page",
			},
		};
		const state = {
			parentTitle: {
				2: "Another example page",
			},
		};
		const expectedState = {
			parentTitle: {
				2: "Sample page",
			},
		};
		expect( state ).not.toBe( expectedState );
		expect( reducer( state, action ) ).toEqual( expectedState );
	} );
	it( "adds an additional replacevar type", () => {
		const action = {
			type: "WPSEO_ADD_REPLACEVAR",
			replacevar: {
				type: "title",
				id: "2",
				value: "Sample page",
			},
		};
		const state = {
			parentTitle: {
				1: "Another example page",
			},
		};
		const expectedState = {
			parentTitle: {
				1: "Another example page",
			},
			title: {
				2: "Sample page",
			},
		};
		expect( state ).not.toBe( expectedState );
		expect( reducer( state, action ) ).toEqual( expectedState );
	} );
} );
