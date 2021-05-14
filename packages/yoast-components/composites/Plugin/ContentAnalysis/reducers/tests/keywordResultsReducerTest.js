import { keywordResultsReducer } from "../contentAnalysis/keywordResultsReducer";
import {
	UPDATE_SEO_RESULT, SET_SEO_RESULTS, REMOVE_KEYWORD, SET_SEO_RESULTS_FOR_KEYWORD,
	SET_OVERALL_SEO_SCORE,
} from "../../actions/contentAnalysis";

describe( "SET_SEO_RESULTS_FOR_KEYWORD action", () => {
	it( "sets seo results for a single keyword in an empty state", () => {
		const state = {};
		const action = {
			type: SET_SEO_RESULTS_FOR_KEYWORD,
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
			thisIsMyKeyword: {
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
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "SET_SEO_RESULTS_FOR_KEYWORD action", () => {
	it( "sets seo results for a single keyword in an non-empty state", () => {
		const state = {
			thisIsMyKeyword: {
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
			},
		};
		const action = {
			type: SET_SEO_RESULTS_FOR_KEYWORD,
			keyword: "thisIsMySecondKeyword",
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
			thisIsMyKeyword: {
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
			},
			thisIsMySecondKeyword: {
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
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "SET_SEO_RESULTS_FOR_KEYWORD action", () => {
	it( "overwrites seo results for a single keyword when there are already results for that keyword", () => {
		const state = {
			thisIsMyKeyword: {
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
			},
		};
		const action = {
			type: SET_SEO_RESULTS_FOR_KEYWORD,
			keyword: "thisIsMyKeyword",
			results: [
				{
					id: "resultId",
					score: 6,
					description: "This is a mediocre score!",
					markingIsActive: false,
				},
				{
					id: "resultId2",
					score: 9,
					description: "This is a good score!",
					markingIsActive: false,
				},
			],
		};
		const expected = {
			thisIsMyKeyword: {
				results: [
					{
						id: "resultId",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
					{
						id: "resultId2",
						score: 9,
						description: "This is a good score!",
						markingIsActive: false,
					},
				],
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "SET_SEO_RESULTS action", () => {
	it( "sets seo results for a single keyword in an empty state", () => {
		const state = {};
		const action = {
			type: SET_SEO_RESULTS,
			resultsPerKeyword: [ {
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
			} ],
		};
		const expected = {
			thisIsMyKeyword: {
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
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets seo results for multiple keywords in an empty state", () => {
		const state = {};
		const action = {
			type: SET_SEO_RESULTS,
			resultsPerKeyword: [ {
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
			},
			{
				keyword: "thisIsMySecondKeyword",
				results: [
					{
						id: "resultId",
						score: 9,
						description: "This is a good score!",
						markingIsActive: false,
					},
					{
						id: "resultId2",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
				],
			} ],
		};
		const expected = {
			thisIsMyKeyword: {
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
			},
			thisIsMySecondKeyword: {
				results: [
					{
						id: "resultId",
						score: 9,
						description: "This is a good score!",
						markingIsActive: false,
					},
					{
						id: "resultId2",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
				],
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "overwrites existing seo results in a non-empty state", () => {
		const state = {
			thisIsMyOldKeyword: {
				results: [
					{
						id: "resultId",
						score: 9,
						description: "This is a good score!",
						markingIsActive: true,
					},
				],
			},
		};
		const action = {
			type: SET_SEO_RESULTS,
			resultsPerKeyword: [ {
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
			} ],
		};
		const expected = {
			thisIsMyKeyword: {
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
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "UPDATE_SEO_RESULT action", () => {
	it( "adds a new result for a new keyword to an empty state ", () => {
		const state = {};
		const action = {
			type: UPDATE_SEO_RESULT,
			keyword: "thisIsMyKeyword",
			result: { id: "resultId", score: 3, description: "This is a bad score!", markingIsActive: false },
		};
		const expected = {
			thisIsMyKeyword: {
				results: [
					{
						id: "resultId",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
				],
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "adds a result for a new keyword in a non-empty state", () => {
		const state = {
			thisIsMyKeyword: {
				results: [
					{
						id: "resultId",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
				],
			},
		};
		const action = {
			type: UPDATE_SEO_RESULT,
			keyword: "thisIsMySecondKeyword",
			result: { id: "resultId", score: 9, description: "This is a good score!", markingIsActive: true },
		};
		const expected = {
			thisIsMyKeyword: {
				results: [
					{
						id: "resultId",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
				],
			},
			thisIsMySecondKeyword: {
				results: [
					{
						id: "resultId",
						score: 9,
						description: "This is a good score!",
						markingIsActive: true,
					},
				],
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "adds a result for an existing keyword", () => {
		const state = {
			thisIsMyKeyword: {
				results: [
					{
						id: "resultId",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
				],
			},
			thisIsMySecondKeyword: {
				results: [
					{
						id: "resultId",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
				],
			},
		};
		const action = {
			type: UPDATE_SEO_RESULT,
			keyword: "thisIsMyKeyword",
			result: { id: "resultId2", score: 9, description: "This is a good score!", markingIsActive: true },
		};
		const expected = {
			thisIsMyKeyword: {
				results: [
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
			},
			thisIsMySecondKeyword: {
				results: [
					{
						id: "resultId",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
				],
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "overwrites an existing result", () => {
		const state = {
			thisIsMyKeyword: {
				results: [
					{
						id: "resultId",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
				],
			},
		};
		const action = {
			type: UPDATE_SEO_RESULT,
			keyword: "thisIsMyKeyword",
			result: { id: "resultId", score: 9, description: "This is a good score!", markingIsActive: true },
		};
		const expected = {
			thisIsMyKeyword: {
				results: [
					{
						id: "resultId",
						score: 9,
						description: "This is a good score!",
						markingIsActive: true,
					},
				],
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "REMOVE_KEYWORD action", () => {
	it( "removes a keyword and its results", () => {
		const state = {
			keywordToBeRemoved: {
				results: [
					{
						id: "resultId",
						score: 9,
						description: "This is a good score!",
						markingIsActive: true,
					},
				],
			},
			keywordToStay: {
				results: [
					{
						id: "resultId2",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
				],
			},
		};
		const action = {
			type: REMOVE_KEYWORD,
			keyword: "keywordToBeRemoved",
		};
		const expected = {
			keywordToStay: {
				results: [
					{
						id: "resultId2",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
				],
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "SET_OVERALL_SCORE for seo action", () => {
	it( "sets overall score for an seo analysis result", () => {
		const state = {
			keyword: {
				results: [
					{
						id: "resultId",
						score: 9,
						description: "This is a good score!",
						markingIsActive: true,
					},
				],
			},
			keyword2: {
				results: [
					{
						id: "resultId2",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
				],
			},
		};
		const action = {
			type: SET_OVERALL_SEO_SCORE,
			keyword: "keyword",
			overallScore: "5",
		};
		const expected = {
			keyword: {
				results: [
					{
						id: "resultId",
						score: 9,
						description: "This is a good score!",
						markingIsActive: true,
					},
				],
				overallScore: "5",
			},
			keyword2: {
				results: [
					{
						id: "resultId2",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
				],
			},
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );


describe( "BOGUS action", () => {
	it( "returns the unchanged state when a bogus action is passed to the reducer", () => {
		const state = {};
		const action = {
			type: "BOGUS",
		};
		const expected = state;

		const actual = keywordResultsReducer( state, action );
		expect( actual ).toBe( expected );
	} );
} );
