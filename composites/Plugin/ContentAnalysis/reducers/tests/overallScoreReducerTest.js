import { SET_OVERALL_SCORE_SEO, SET_OVERALL_SCORE_READABILITY } from "../../actions/contentAnalysis";
import { overallScoreReducer } from "../contentAnalysis/overallScoreReducer";

describe( "SET_OVERALL_SCORE for seo action", () => {
	it( "sets overall score for an seo analysis result", () => {
		const state = {};
		let firstKeyword = "thisIsMyFirstKeyword";
		let secondKeyword = "thisIsMySecondKeyword";
		const action = {
			type: SET_OVERALL_SCORE_SEO,
			scorePerKeyword: [
				{
					keyword: firstKeyword,
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
					overallScore: {
						score: 5,
						description: "This is a mediocre score!",
					},
				},
				{
					keyword: secondKeyword,
					results: [
						{
							id: "resultId",
							score: 1,
							description: "This is a bad score!",
							markingIsActive: false,
						},
						{
							id: "resultId2",
							score: 5,
							description: "This is a mediocre score!",
							markingIsActive: false,
						},
					],
					overallScore: {
						score: 3,
						description: "This is a bad score!",
					},
				},
			],
		};
		const expected = {
			thisIsMyFirstKeyword: {
				score: 5,
				description: "This is a mediocre score!",
			},
			thisIsMySecondKeyword: {
				score: 3,
				description: "This is a bad score!",
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
			type: SET_OVERALL_SCORE_READABILITY,
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
