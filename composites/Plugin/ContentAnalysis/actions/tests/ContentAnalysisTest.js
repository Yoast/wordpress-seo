import { UPDATE_SEO_RESULT, UPDATE_READABILITY_RESULT, REMOVE_KEYWORD, SET_SEO_RESULTS,
	updateSeoResult, updateReadabilityResult, changeKeyword, setSeoResults, removeKeyword } from "../contentAnalysis";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

describe( "update SEO result action creator", function() {
	it( "creates the update SEO result action", function() {
		let result = { id: "result", score: 9, description: "This is a great score!", markingIsActive: true };

		const expected = {
			type: UPDATE_SEO_RESULT,
			keyword: "keyword",
			result: result,
		};
		const actual = updateSeoResult( "keyword", result );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "update readability result action creator", function() {
	it( "creates the readability SEO result action", function() {
		let result = { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false };

		const expected = {
			type: UPDATE_READABILITY_RESULT,
			result: result,
		};
		const actual = updateReadabilityResult( result );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "the change keyword action creator", function() {
	it( "creates the change keyword action", function() {
		const middlewares = [ thunk ];
		const mockStore = configureMockStore( middlewares );
		let results = [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ];

		const expectedActions = [
			{ type: REMOVE_KEYWORD, keyword: "oldKeyword" },
			{ type: SET_SEO_RESULTS, keyword: "newKeyword",
				results: results },
		];
		const store = mockStore( { oldKeyword: [] }, { otherKeyword: [] } );

		store.dispatch( changeKeyword( "oldKeyword", "newKeyword", results ) );
		expect( store.getActions() ).toEqual( expectedActions );
	} );
} );

describe( "set SEO results function", function() {
	it( "creates the set SEO results action", function() {
		let result = { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false };

		const expected = {
			type: SET_SEO_RESULTS,
			keyword: "keyword",
			results: result,
		};
		const actual = setSeoResults( "keyword", result );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "remove keyword function", function() {
	it( "creates the remove keywords action", function() {
		const expected = {
			type: REMOVE_KEYWORD,
			keyword: "keyword",
		};
		const actual = removeKeyword( "keyword" );
		expect( actual ).toEqual( expected );
	} );
} );
