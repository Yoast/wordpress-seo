import {
	isFollowedByException,
	isNotFollowedByException,
} from "../../../../../src/scoring/assessments/inclusiveLanguage/helpers/isFollowedByException";

describe( "Test isFollowedByException", () => {
	it( "returns the right value when term is followed by an exception", () => {
		const words = "this is a sentence".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const exceptions = [ "sentence" ];
		const callback = isFollowedByException( words, consecutiveWords, exceptions );
		const index = 1;

		expect( callback( index ) ).toEqual( true );
	} );
	it( "returns the right value when term is not followed by an exception", () => {
		const words = "this is a cat".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const exceptions = [ "sentence" ];
		const callback = isFollowedByException( words, consecutiveWords, exceptions );
		const index = 1;

		expect( callback( index ) ).toEqual( false );
	} );
} );

describe( "Test isNotFollowedByException", () => {
	it( "returns the right value when term is followed by an exception", () => {
		const words = "this is a sentence".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const exceptions = [ "sentence" ];
		const notCallback = isNotFollowedByException( words, consecutiveWords, exceptions );
		const index = 1;

		expect( notCallback( index ) ).toEqual( false );
	} );
	it( "returns the right value when term is not followed by an exception", () => {
		const words = "this is a cat".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const exceptions = [ "sentence" ];
		const notCallback = isNotFollowedByException( words, consecutiveWords, exceptions );
		const index = 1;

		expect( notCallback( index ) ).toEqual( true );
	} );
} );
