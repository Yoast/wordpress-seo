// eslint-disable-next-line max-len
import { isPrecededByException, isNotPrecededByException } from "../../../../../src/scoring/assessments/inclusiveLanguage/helpers/isPrecededByException";

xdescribe( "Test isFollowedByException", () => {
	it( "returns the right value when term is preceded by an exception", () => {
		const words = "this is a sentence".split( " " );
		const exceptions = [ "this" ];
		const callback = isPrecededByException( words, exceptions );
		const index = 1;

		// eslint-disable-next-line callback-return
		expect( callback( index ) ).toEqual( true );
	} );
	it( "returns the right value when term is not preceded by an exception", () => {
		const words = "that is a cat".split( " " );
		const exceptions = [ "this" ];
		const callback = isPrecededByException( words, exceptions );
		const index = 1;

		// eslint-disable-next-line callback-return
		expect( callback( index ) ).toEqual( false );
	} );
} );

xdescribe( "Test isNotFollowedByException", () => {
	it( "returns the right value when term is preceded by an exception", () => {
		const words = "this is a sentence".split( " " );
		const exceptions = [ "this" ];
		const notCallback = isNotPrecededByException( words, exceptions );
		const index = 1;

		expect( notCallback( index ) ).toEqual( false );
	} );
	it( "returns the right value when term is not preceded by an exception", () => {
		const words = "that is a cat".split( " " );
		const exceptions = [ "this" ];
		const notCallback = isNotPrecededByException( words, exceptions );
		const index = 1;

		expect( notCallback( index ) ).toEqual( true );
	} );
} );
