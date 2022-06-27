import { set } from "lodash-es";
import {
	getEstimatedReadingTime,
	getFleschReadingEaseDifficulty,
	getFleschReadingEaseScore,
	getTextLength,
	isFleschReadingEaseAvailable,
} from "../../../src/insights/redux/selectors";
import { DIFFICULTY } from "yoastseo";

describe( "The insights selectors", () => {
	describe( "The Flesch reading ease score selector", () => {
		it( "gets the score from the store", () => {
			const state = set( {}, "insights.fleschReadingEaseScore", 42 );
			expect( getFleschReadingEaseScore( state ) ).toEqual( 42 );
		} );
		it( "returns `null` when no score is available", () => {
			const state = {};
			expect( getFleschReadingEaseScore( state ) ).toEqual( null );
		} );
	} );
	describe( "The Flesch reading ease difficulty selector", () => {
		it( "gets the difficulty from the store", () => {
			const state = set( {}, "insights.fleschReadingEaseDifficulty", DIFFICULTY.EASY );
			expect( getFleschReadingEaseDifficulty( state ) ).toEqual( DIFFICULTY.EASY );
		} );
		it( "returns `null` when no difficulty is available", () => {
			const state = {};
			expect( getFleschReadingEaseDifficulty( state ) ).toEqual( null );
		} );
	} );
	describe( "the Flesch reading ease availability selector", () => {
		it( "returns `true` when a score and difficulty are available", () => {
			const state = {
				insights: {
					fleschReadingEaseScore: 42,
					fleschReadingEaseDifficulty: DIFFICULTY.OKAY,
				},
			};
			expect( isFleschReadingEaseAvailable( state ) ).toEqual( true );
		} );
		it( "returns `false` when score or difficulty are not available", () => {
			const state = {
				insights: {},
			};
			expect( isFleschReadingEaseAvailable( state ) ).toEqual( false );
		} );
	} );
	it( "gets the estimated reading time from the store", () => {
		const state = set( {}, "insights.estimatedReadingTime", 31 );
		expect( getEstimatedReadingTime( state ) ).toEqual( 31 );
	} );
	it( "gets the word count from the store", () => {
		const state = set( {}, "insights.textLength", { count: 420, unit: "word" } );
		expect( getTextLength( state ).count ).toEqual( 420 );
		expect( getTextLength( state ).unit ).toEqual( "word" );
	} );
} );
