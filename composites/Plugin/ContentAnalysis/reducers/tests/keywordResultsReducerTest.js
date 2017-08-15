import { keywordResultsReducer } from "../contentAnalysis/keywordResultsReducer";
import { UPDATE_SEO_RESULT, SET_SEO_RESULTS, REMOVE_KEYWORD } from "../../actions/contentAnalysis";

// The SET_SEO_RESULTS action
test( "the set seo results action modifies an empty state", () => {
	const state = {};
	const action = {
		type: SET_SEO_RESULTS,
		keyword: "thisIsMyKeyword",
		results: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
			{
				id: "resultId2",
				score: 6,
				description: "This is a mediocre score!",
				markingIsActive: false,
			},
		],
	};
	const expected = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
			{
				id: "resultId2",
				score: 6,
				description: "This is a mediocre score!",
				markingIsActive: false,
			},
		],
	};

	const actual = keywordResultsReducer( state, action );

	expect( actual ).toEqual( expected );
} );

test( "the set seo results action overwrites a non-empty state", () => {
	const state = {
		thisIsMyOldKeyword: [
			{
				id: "resultId",
				score: 9,
				description: "This is a good score!",
				markingIsActive: true,
			},
		],
	};
	const action = {
		type: SET_SEO_RESULTS,
		keyword: "thisIsMyKeyword",
		results: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
			{
				id: "resultId2",
				score: 6,
				description: "This is a mediocre score!",
				markingIsActive: false,
			},
		],
	};
	const expected = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
			{
				id: "resultId2",
				score: 6,
				description: "This is a mediocre score!",
				markingIsActive: false,
			},
		],
	};

	const actual = keywordResultsReducer( state, action );

	expect( actual ).toEqual( expected );
} );

// The UPDATE_SEO_RESULT action.
test( "the update seo result action with a new keyword modifies the state", () => {
	const state = {};
	const action = {
		type: UPDATE_SEO_RESULT,
		keyword: "thisIsMyKeyword",
		result: { id: "resultId", score: 3, description: "This is a bad score!", markingIsActive: false },
	};
	const expected = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
		],
	};

	const actual = keywordResultsReducer( state, action );

	expect( actual ).toEqual( expected );
} );

test( "the update seo result action modifies the state when there is already a result for the keyword", () => {
	const state = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
		],
	};
	const action = {
		type: UPDATE_SEO_RESULT,
		keyword: "thisIsMyKeyword",
		result: { id: "resultId2", score: 9, description: "This is a good score!", markingIsActive: true },
	};
	const expected = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
			{
				id: "resultId2",
				score: 9,
				description: "This is a good score!",
				markingIsActive: true,
			},
		],
	};

	const actual = keywordResultsReducer( state, action );

	expect( actual ).toEqual( expected );
} );

test( "the update seo result action modifies the state when there are already several results for the keyword", () => {
	const state = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
			{
				id: "resultId2",
				score: 9,
				description: "This is a good score!",
				markingIsActive: true,
			},
		],
	};
	const action = {
		type: UPDATE_SEO_RESULT,
		keyword: "thisIsMyKeyword",
		result: { id: "resultId3", score: 6, description: "This is a mediocre score!", markingIsActive: true },
	};
	const expected = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
			{
				id: "resultId2",
				score: 9,
				description: "This is a good score!",
				markingIsActive: true,
			},
			{
				id: "resultId3",
				score: 6,
				description: "This is a mediocre score!",
				markingIsActive: true,
			},
		],
	};

	const actual = keywordResultsReducer( state, action );

	expect( actual ).toEqual( expected );
} );

test( "the update seo result action modifies the state when there is already a keyword", () => {
	const state = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
		],
	};
	const action = {
		type: UPDATE_SEO_RESULT,
		keyword: "thisIsMySecondKeyword",
		result: { id: "resultId2", score: 9, description: "This is a good score!", markingIsActive: true },
	};
	const expected = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
		],
		thisIsMySecondKeyword: [
			{
				id: "resultId2",
				score: 9,
				description: "This is a good score!",
				markingIsActive: true,
			},
		],
	};

	const actual = keywordResultsReducer( state, action );

	expect( actual ).toEqual( expected );
} );

test( "the update seo result action with a duplicate id but a new keyword modifies the state", () => {
	const state = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
		],
	};
	const action = {
		type: UPDATE_SEO_RESULT,
		keyword: "thisIsMySecondKeyword",
		result: { id: "resultId", score: 9, description: "This is a good score!", markingIsActive: true },
	};
	const expected = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
		],
		thisIsMySecondKeyword: [
			{
				id: "resultId",
				score: 9,
				description: "This is a good score!",
				markingIsActive: true,
			},
		],
	};

	const actual = keywordResultsReducer( state, action );

	expect( actual ).toEqual( expected );
} );

test( "the update seo result action with a duplicate id and a duplicate keyword modifies the state", () => {
	const state = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
		],
		thisIsMySecondKeyword: [
			{
				id: "resultId",
				score: 6,
				description: "This is a mediocre score!",
				markingIsActive: true,
			},
		],
	};
	const action = {
		type: UPDATE_SEO_RESULT,
		keyword: "thisIsMyKeyword",
		result: {
			id: "resultId",
			score: 9,
			description: "This is a good score!",
			markingIsActive: true,
		},
	};
	const expected = {
		thisIsMyKeyword: [
			{
				id: "resultId",
				score: 9,
				description: "This is a good score!",
				markingIsActive: true,
			},
		],
		thisIsMySecondKeyword: [
			{
				id: "resultId",
				score: 6,
				description: "This is a mediocre score!",
				markingIsActive: true,
			},
		],
	};

	const actual = keywordResultsReducer( state, action );

	expect( actual ).toEqual( expected );
} );

// The REMOVE_KEYWORD action.
test( "the remove keyword action removes a keyword and its results", () => {
	const state = {
		keywordToBeRemoved: [
			{
				id: "resultId",
				score: 9,
				description: "This is a good score!",
				markingIsActive: true,
			},
		],
		keywordToStay: [
			{
				id: "resultId2",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
		],
	};
	const action = {
		type: REMOVE_KEYWORD,
		keyword: "keywordToBeRemoved",
	};
	const expected = {
		keywordToStay: [
			{
				id: "resultId2",
				score: 3,
				description: "This is a bad score!",
				markingIsActive: false,
			},
		],
	};

	const actual = keywordResultsReducer( state, action );

	expect( actual ).toEqual( expected );
} );

// A BOGUS action.
test( "keyword results reducer with a bogus action", () => {
	const state = {};
	const BOGUS = "BOGUS";
	const action = {
		type: BOGUS,
	};
	const expected = {};

	const actual = keywordResultsReducer( state, action );
	expect( actual ).toEqual( expected );
} );
