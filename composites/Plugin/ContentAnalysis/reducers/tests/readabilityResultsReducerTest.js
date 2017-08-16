import { readabilityResultsReducer } from "../contentAnalysis/readabilityResultsReducer";
import { UPDATE_READABILITY_RESULT, SET_READABILITY_RESULTS } from "../../actions/contentAnalysis";

describe( "SET_READABILITY_RESULTS action", () => {
	it( "sets readability results in an empty state", () => {
		const state = {};
		const action = {
			type: SET_READABILITY_RESULTS,
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
		const expected = [
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
		];

		const actual = readabilityResultsReducer( state, action) ;

		expect( actual ).toEqual( expected );
	} );

	it( "overwrites a non-empty state ", () => {

		const state = {
			readability: [
				{
					id: "resultId",
					score: 9,
					description: "This is a good score!",
					markingIsActive: true,
				},
			],
		};
		const action = {
			type: SET_READABILITY_RESULTS,
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
			readability: [
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

		const actual = readabilityResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "UPDATE_READABILITY_RESULT action", () => {
	it( "adds a new result to an empty state", () => {
		const state = {};
		const action = {
			type: UPDATE_READABILITY_RESULT,
			result: { id: "resultId", score: 3, description: "This is a bad score!", markingIsActive: false },
		};
		const expected = {
			readability: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};

		const actual = readabilityResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "adds results for a new keyword to an empty state", () => {
		const state = {
			readability: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};
		const action = {
			type: UPDATE_READABILITY_RESULT,
			result: { id: "resultId2", score: 9, description: "This is a good score!", markingIsActive: true },
		};
		const expected = {
			readability: [
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

		const actual = readabilityResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "BOGUS action", () => {
	it( "doesn't change the state when a bogus action is passed to the reducer", () => {
		const state = {};
		const action = {
			type: "BOGUS",
		};
		const expected = {};

		const actual = readabilityResultsReducer( state, action );
		expect( actual ).toEqual( expected );
	} );
} );

