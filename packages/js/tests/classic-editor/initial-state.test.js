import { getInitialPostState, getInitialTermState } from "../../src/classic-editor/initial-state";

jest.mock( "../../src/classic-editor/helpers/dom", () => ( {
	...jest.requireActual( "../../src/classic-editor/helpers/dom" ),
	getPostTitle: jest.fn( () => "Tortoiseshell cat" ),
	getPostDate: jest.fn( () => "18 January 2022 12:17" ),
	getPostPermalink: jest.fn( () => "www.sweetcat.com/123" ),
	getPostExcerpt: jest.fn( () => "An example of excerpt from a content." ),
	getPostContent: jest.fn( () => "Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material." ),
	getPostFeaturedImage: jest.fn( () => ( {} ) ),
	getPostSeoTitle: jest.fn( () => "Tortoiseshell cat - All about cats" ),
	getPostMetaDescription: jest.fn( () => "Cats with tortoiseshell coloration are believed to bring good luck." ),
	getPostSlug: jest.fn( () => "www.sweetcat.com/tortoiseshell-cat" ),
	getPostIsCornerstone: jest.fn( () => false ),
	getPostFocusKeyphrase: jest.fn( () => "tortoiseshell cat" ),
	getTermName: jest.fn( () => "cat" ),
	getTermPermalink: jest.fn( () => "www.sweetcat.com/categories" ),
	getTermExcerpt: jest.fn( () => "This is another meta description about another pretty little cat." ),
	getTermDescription: jest.fn( () => "This is to describe a cat, that deserves only good attributes to them." ),
	getTermSeoTitle: jest.fn( () => "A title befitting a beautiful cat" ),
	getTermMetaDescription: jest.fn( () => "An example of a description for a cat." ),
	getTermSlug: jest.fn( () => "www.sweetcat.com/categories/cat" ),
	getTermIsCornerstone: jest.fn( () => false ),
	getTermFocusKeyphrase: jest.fn( () => "cat" ),
} ) );

describe( "a test for getting the initial state of a post or a term", () => {
	it( "returns the initial state of a post", () => {
		const actual = getInitialPostState();
		expect( actual.editor.title ).toEqual( "Tortoiseshell cat" );
		expect( actual.editor.date ).toEqual( "18 January 2022 12:17" );
		expect( actual.editor.permalink ).toEqual( "www.sweetcat.com/123" );
		expect( actual.editor.excerpt ).toEqual( "An example of excerpt from a content." );
		expect( actual.editor.content ).toEqual( "Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material." );
		expect( actual.editor.featuredImage ).toEqual( {} );
		expect( actual.form.seo.title ).toEqual( "Tortoiseshell cat - All about cats" );
		expect( actual.form.seo.description ).toEqual( "Cats with tortoiseshell coloration are believed to bring good luck." );
		expect( actual.form.seo.slug ).toEqual( "www.sweetcat.com/tortoiseshell-cat" );
		expect( actual.form.seo.isCornerstone ).toEqual( false );
		expect( actual.form.keyphrases ).toEqual( { focus: { id: "focus", keyphrase: "tortoiseshell cat" } } );
	} );

	it( "returns the initial state of a term", () => {
		const actual = getInitialTermState();
		expect( actual.editor.title ).toEqual( "cat" );
		expect( actual.editor.permalink ).toEqual( "www.sweetcat.com/categories" );
		expect( actual.editor.excerpt ).toEqual( "This is another meta description about another pretty little cat." );
		expect( actual.editor.content ).toEqual( "This is to describe a cat, that deserves only good attributes to them." );
		expect( actual.form.seo.title ).toEqual( "A title befitting a beautiful cat" );
		expect( actual.form.seo.description ).toEqual( "An example of a description for a cat." );
		expect( actual.form.seo.slug ).toEqual( "www.sweetcat.com/categories/cat" );
		expect( actual.form.seo.isCornerstone ).toEqual( false );
		expect( actual.form.keyphrases ).toEqual( { focus: { id: "focus", keyphrase: "cat" } } );
	} );
} );
