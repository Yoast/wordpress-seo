import { setFleschReadingEase } from "../../../src/insights/redux/actions";
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
} );
