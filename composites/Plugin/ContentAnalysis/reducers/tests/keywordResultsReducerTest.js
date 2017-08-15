import { keywordResultsReducer } from "../contentAnalysis/keywordResultsReducer";
import { UPDATE_SEO_RESULT } from "../../actions/contentAnalysis";

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
