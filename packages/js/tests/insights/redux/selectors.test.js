import { set } from "lodash-es";
import {
	getEstimatedReadingTime,
	getFleschReadingEaseDifficulty,
	getFleschReadingEaseScore,
	getWordCount,
} from "../../../src/insights/redux/selectors";
import { DIFFICULTY } from "yoastseo";

describe( "The insights selectors", () => {
	it( "gets the Flesch reading ease score from the store", () => {
		const state = set( {}, "insights.fleschReadingEaseScore", 42 );
		expect( getFleschReadingEaseScore( state ) ).toEqual( 42 );
	} );
	it( "gets the Flesch reading ease score from the store", () => {
		const state = set( {}, "insights.fleschReadingEaseDifficulty", DIFFICULTY.EASY );
		expect( getFleschReadingEaseDifficulty( state ) ).toEqual( DIFFICULTY.EASY );
	} );
	it( "gets the estimated reading time from the store", () => {
		const state = set( {}, "insights.estimatedReadingTime", 31 );
		expect( getEstimatedReadingTime( state ) ).toEqual( 31 );
	} );
	it( "gets the word count from the store", () => {
		const state = set( {}, "insights.wordCount", 420 );
		expect( getWordCount( state ) ).toEqual( 420 );
	} );
} );
