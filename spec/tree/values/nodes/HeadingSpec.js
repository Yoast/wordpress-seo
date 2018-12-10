import Heading from "../../../../src/tree/values/nodes/Heading";
import TextContainer from "../../../../src/tree/values/nodes/TextContainer";

describe( "Heading", () => {
	describe( "constructor", () => {
		it( "can make a heading", () => {
			const text = new TextContainer( "This is the main title", [] );
			const heading = new Heading( 0, 8, 1, text );

			expect( heading.startIndex ).toEqual( 0 );
			expect( heading.endIndex ).toEqual( 8 );
			expect( heading.level ).toEqual( 1 );
			expect( heading.textContainer ).toEqual( text );
		} );
	} );

	describe( "map function", () => {
		it( "returns a changed heading when map is called.", () => {
			const text = new TextContainer( "This is the main title", [] );
			const heading = new Heading( 0, 8, 1, text );

			const headingAfterMapping = heading.map( node => {
				if ( node instanceof Heading ) {
					node.textContainer.text += "!!!";
				}
				return node;
			} );

			expect( headingAfterMapping.textContainer.text ).toEqual( "This is the main title!!!" );
		} );
	} );

	describe( "filter function", () => {
		it( "returns this heading in an array when the predicate returns true", () => {
			const text = new TextContainer( "This is the main title", [] );
			const heading = new Heading( 0, 8, 1, text );

			const filtered = heading.filter( node => node instanceof Heading );

			expect( filtered.length ).toEqual( 1 );
		} );

		it( "returns an empty array when the predicate returns false", () => {
			const text = new TextContainer( "This is the main title", [] );
			const heading = new Heading( 0, 8, 1, text );

			const filtered = heading.filter( node => node.startIndex > 0 );

			expect( filtered.length ).toEqual( 0 );
		} );
	} );
} );
