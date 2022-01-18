// noinspection JSConstantReassignment

import * as dom from "../../src/classic-editor/helpers/dom";
import { getInitialPostState, getInitialTermState } from "../../src/classic-editor/initial-state";

dom.getPostSeoTitle = jest.fn( () => "Title test" );
dom.getPostMetaDescription = jest.fn( () => "This is a meta description about a pretty little cat." );
dom.getTermExcerpt = jest.fn( () => "This is another meta description about another pretty little cat." );
dom.getTermSeoTitle = jest.fn( () => "A title befitting a beautiful cat" );
dom.getTermMetaDescription = jest.fn( () => "An example of a description for a cat." );

describe( "a test for getting the initial state of a post or a term", () => {
	it( "returns the initial state of a post", () => {
		const actual = getInitialPostState();
		expect( actual.form.seo.title ).toEqual( "Title test" );
		expect( actual.form.seo.description ).toEqual( "This is a meta description about a pretty little cat." );
	} );

	it( "returns the initial state of a term", () => {
		const actual = getInitialTermState();
		expect( actual.editor.excerpt ).toEqual( "This is another meta description about another pretty little cat." );
		expect( actual.form.seo.title ).toEqual( "A title befitting a beautiful cat" );
		expect( actual.form.seo.description ).toEqual( "An example of a description for a cat." );
	} );
} );
