import { SET_OVERALL_SEO_SCORE, SET_OVERALL_READABILITY_SCORE } from "../../actions/contentAnalysis";
import { overallScoreReducer } from "../contentAnalysis/overallScoreReducer";

describe( "SET_OVERALL_SCORE for seo action", () => {
	it( "sets overall score for an seo analysis result", () => {
		const state = {};
		const action = {
			type: SET_OVERALL_SEO_SCORE,
			keyword: "first keyword",
			overallScore: {
				score: 5,
				description: "This is a mediocre score!",
			},
		};
		const expected = {
			"first keyword": {
				overallScore: {
					score: 5,
					description: "This is a mediocre score!",
				},
			},
			"second keyword": {
				overallScore: {
					score: 3,
					description: "This is a bad score!",
				},
			},
		};

		const actual = overallScoreReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "SET_OVERALL_SCORE for readability action", () => {
	it( "sets overall score for a readability analysis result", () => {
		const state = [];
		const action = {
			type: SET_OVERALL_READABILITY_SCORE,
			overallScore: {
				score: 5,
				description: "This is a mediocre score!",
			},
		};
		const expected = {
			score: 5,
			description: "This is a mediocre score!",
		};

		const actual = overallScoreReducer( state, action );

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

		const actual = overallScoreReducer( state, action );
		expect( actual ).toBe( expected );
	} );
} );
