import { setFleschReadingEase, setTextLength } from "../../../src/insights/redux/actions";
import { DIFFICULTY } from "yoastseo";
import reducer from "../../../src/insights/redux/reducer";

describe( "The insights reducer", () => {
	it( "updates the state given an action to update the Flesch reading scoring.", ()=> {
		const state = {};
		const action = setFleschReadingEase( {
			score: 10,
			difficulty: DIFFICULTY.VERY_DIFFICULT,
		} );
		expect( reducer( state, action ) ).toEqual( {
			fleschReadingEaseScore: 10,
			fleschReadingEaseDifficulty: DIFFICULTY.VERY_DIFFICULT,
		} );
	} );
	it( "updates the state given an action to update the text length.", () => {
		const state = {
			estimatedReadingTime: 3.1,
		};
		const action = setTextLength( {
			count: 42,
			unit: "character",
		} );
		expect( reducer( state, action ) ).toEqual( {
			estimatedReadingTime: 3.1,
			textLength: {
				count: 42,
				unit: "character",
			},
		} );
	} );
} );
