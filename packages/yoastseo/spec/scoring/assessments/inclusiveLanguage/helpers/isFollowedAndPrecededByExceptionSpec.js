import {
	isFollowedAndPrecededByException,
	isNotFollowedAndPrecededByException,
} from "../../../../../src/scoring/assessments/inclusiveLanguage/helpers/isFollowedAndPrecededByException";

describe( "Test isFollowedAndPrecededByException", () => {
	it( "returns true when a term is both followed and preceded by an exception", () => {
		const words = "this is a sentence".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const precedingExceptions = [ "this" ];
		const followingExceptions = [ "sentence" ];
		const callback = isFollowedAndPrecededByException( words, consecutiveWords, precedingExceptions, followingExceptions  );
		const index = 1;

		expect( callback( index ) ).toEqual( true );
	} );
	it( "returns false when a term is followed but not preceded by an exception", () => {
		const words = "it is a sentence".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const precedingExceptions = [ "this" ];
		const followingExceptions = [ "sentence" ];
		const callback = isFollowedAndPrecededByException( words, consecutiveWords, precedingExceptions, followingExceptions  );
		const index = 1;

		expect( callback( index ) ).toEqual( false );
	} );
	it( "returns false when a term is preceded but not followed by an exception", () => {
		const words = "this is a cat".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const precedingExceptions = [ "this" ];
		const followingExceptions = [ "sentence" ];
		const callback = isFollowedAndPrecededByException( words, consecutiveWords, precedingExceptions, followingExceptions  );
		const index = 1;

		expect( callback( index ) ).toEqual( false );
	} );
} );

describe( "Test isNotFollowedAndPrecededByException", () => {
	it( "returns false when a term is both followed and preceded by an exception", () => {
		const words = "this is a sentence".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const precedingExceptions = [ "this" ];
		const followingExceptions = [ "sentence" ];
		const callback = isNotFollowedAndPrecededByException( words, consecutiveWords, precedingExceptions, followingExceptions  );
		const index = 1;

		expect( callback( index ) ).toEqual( false );
	} );
	it( "returns true when a term is followed but not preceded by an exception", () => {
		const words = "it is a sentence".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const precedingExceptions = [ "this" ];
		const followingExceptions = [ "sentence" ];
		const callback = isNotFollowedAndPrecededByException( words, consecutiveWords, precedingExceptions, followingExceptions  );
		const index = 1;

		expect( callback( index ) ).toEqual( true );
	} );
	it( "returns true when a term is preceded but not followed by an exception", () => {
		const words = "this is a cat".split( " " );
		const consecutiveWords = [ "is", "a" ];
		const precedingExceptions = [ "this" ];
		const followingExceptions = [ "sentence" ];
		const callback = isNotFollowedAndPrecededByException( words, consecutiveWords, precedingExceptions, followingExceptions  );
		const index = 1;

		expect( callback( index ) ).toEqual( true );
	} );
} );
