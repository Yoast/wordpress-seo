import { readabilityResultsReducer } from "../contentAnalysis/readabilityResultsReducer";
import { UPDATE_READABILITY_RESULT, SET_READABILITY_RESULTS } from "../../actions/contentAnalysis";

// The SET_READABILITY_RESULTS action.
test( "the set readability results action modifies an empty state", () => {
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

test( "the set readability results action overwrites a non-empty state", () => {
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

// The UPDATE_READABILITY_RESULT action.
test( "the update readabiility result action with a new keyword modifies the state", () => {
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


test( "the update readability result action modifies the state when there is already a result", () => {
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

// A BOGUS action.
test( "readability results reducer with a bogus action", () => {
	const state = {};
	const BOGUS = "BOGUS";
	const action = {
		type: BOGUS,
	};
	const expected = {};

	const actual = readabilityResultsReducer( state, action );
	expect( actual ).toEqual( expected );
} );
