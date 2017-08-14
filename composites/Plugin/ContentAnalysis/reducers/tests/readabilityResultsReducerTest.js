import { readabilityResultsReducer } from "../contentAnalysis/readabilityResultsReducer";
import { UPDATE_READABILITY_RESULT } from "../../actions/contentAnalysis";

test( "the update seo result action with a new keyword modifies the state", () => {
	const state = {
		readability: [],
	};
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

