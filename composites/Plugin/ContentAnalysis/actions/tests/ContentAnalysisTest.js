import * as actions from "../contentAnalysis";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

test( "update SEO Result action creator", () => {
	const expected = {
		type: actions.UPDATE_SEO_RESULT,
		keyword: "keyword",
		result: { id: "result", score: 9, description: "This is a great score!", markingIsActive: true },
	};
	const actual = actions.updateSeoResult( "keyword", { id: "result", score: 9, description: "This is a great score!", markingIsActive: true } );
	expect( actual ).toEqual( expected );
} );

test( "update readability Result action creator", () => {
	const expected = {
		type: actions.UPDATE_READABILITY_RESULT,
		result: { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false },

	};
	const actual = actions.updateReadabilityResult( { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } );
	expect( actual ).toEqual( expected );
} );

test( "the change keyword action changes", () => {
	const middlewares = [ thunk ];
	const mockStore = configureMockStore( middlewares );

	const expectedActions = [
		{ type: actions.REMOVE_KEYWORD, keyword: "oldKeyword" },
		{ type: actions.SET_SEO_RESULTS, keyword: "newKeyword", results: [ { result: "my result" } ] },
	];
	const store = mockStore( { oldKeyword: [] }, { otherKeyword: [] } );

	store.dispatch( actions.changeKeyword( "oldKeyword", "newKeyword", [ { result: "my result" } ] ) );
	expect( store.getActions() ).toEqual( expectedActions );
} );
