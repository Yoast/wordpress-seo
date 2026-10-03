import {
	SET_INCLUSIVE_LANGUAGE_RESULTS,
	SET_OVERALL_INCLUSIVE_LANGUAGE_SCORE,
	UPDATE_INCLUSIVE_LANGUAGE_RESULT,
} from "../../../../src/redux/actions/contentAnalysis";
import { inclusiveLanguageResultsReducer } from "../../../../src/redux/reducers/contentAnalysis/inclusiveLanguageResultsReducer";

describe( "SET_INCLUSIVE_LANGUAGE_RESULTS action", () => {
	it( "sets inclusive language results in an empty state", () => {
		const state = {};
		const action = {
			type: SET_INCLUSIVE_LANGUAGE_RESULTS,
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

		const actual = inclusiveLanguageResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "overwrites a non-empty state ", () => {
		const state = {
			results: [
				{
					id: "resultId",
					score: 9,
					description: "This is a good score!",
					markingIsActive: true,
				},
			],
		};
		const action = {
			type: SET_INCLUSIVE_LANGUAGE_RESULTS,
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

		const actual = inclusiveLanguageResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "UPDATE_INCLUSIVE_LANGUAGE_RESULT action", () => {
	it( "adds a new result to an empty state", () => {
		const state = {};
		const action = {
			type: UPDATE_INCLUSIVE_LANGUAGE_RESULT,
			result: { id: "resultId", score: 3, description: "This is a bad score!", markingIsActive: false },
		};
		const expected = {
			results: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};

		const actual = inclusiveLanguageResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "adds results for a new id to a non-empty state", () => {
		const state = {
			results: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};
		const action = {
			type: UPDATE_INCLUSIVE_LANGUAGE_RESULT,
			result: { id: "resultId2", score: 9, description: "This is a good score!", markingIsActive: true },
		};
		const expected = {
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
		};

		const actual = inclusiveLanguageResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "overwrites an existing result", () => {
		const state = {
			results: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};
		const action = {
			type: UPDATE_INCLUSIVE_LANGUAGE_RESULT,
			result: { id: "resultId", score: 9, description: "This is a good score!", markingIsActive: true },
		};
		const expected = {
			results: [
				{
					id: "resultId",
					score: 9,
					description: "This is a good score!",
					markingIsActive: true,
				},
			],
		};

		const actual = inclusiveLanguageResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "SET_OVERALL_SCORE for inclusive language action", () => {
	it( "sets overall score for a inclusive language analysis result", () => {
		const state = {
			results: [
				{
					id: "resultId2",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
				{
					id: "resultId3",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};
		const action = {
			type: SET_OVERALL_INCLUSIVE_LANGUAGE_SCORE,
			overallScore: 5,
		};
		const expected = {
			overallScore: 5,
			results: [
				{
					id: "resultId2",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
				{
					id: "resultId3",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};

		const actual = inclusiveLanguageResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "BOGUS action", () => {
	it( "doesn't change the state when a bogus action is passed to the reducer", () => {
		const state = {};
		const action = {
			type: "BOGUS",
		};
		const expected = state;

		const actual = inclusiveLanguageResultsReducer( state, action );
		expect( actual ).toBe( expected );
	} );
} );
