/* eslint-disable camelcase */
import { getInitialPostState, getInitialTermState } from "../../src/classic-editor/initial-state";

jest.mock( "../../src/classic-editor/helpers/dom", () => ( {
	...jest.requireActual( "../../src/classic-editor/helpers/dom" ),
	getPostTitle: jest.fn( () => "Tortoiseshell cat" ),
	getPostDate: jest.fn( () => "18 January 2022 12:17" ),
	getPostPermalink: jest.fn( () => "www.example.com/123" ),
	getPostExcerpt: jest.fn( () => "An example of excerpt from a content." ),
	getPostContent: jest.fn( () => "Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material." ),
	getPostFeaturedImage: jest.fn( () => ( {} ) ),
	getPostSeoTitle: jest.fn( () => "Tortoiseshell cat - All about cats" ),
	getPostMetaDescription: jest.fn( () => "Cats with tortoiseshell coloration are believed to bring good luck." ),
	getPostSlug: jest.fn( () => "www.example.com/tortoiseshell-cat" ),
	getPostIsCornerstone: jest.fn( () => false ),
	getPostFocusKeyphrase: jest.fn( () => "tortoiseshell cat" ),
	getTermName: jest.fn( () => "cat" ),
	getTermPermalink: jest.fn( () => "www.example.com/categories" ),
	getTermDescription: jest.fn( () => "This is to describe a cat, that deserves only good attributes to them." ),
	getTermSeoTitle: jest.fn( () => "A title befitting a beautiful cat" ),
	getTermMetaDescription: jest.fn( () => "An example of a description for a cat." ),
	getTermSlug: jest.fn( () => "www.example.com/categories/cat" ),
	getTermIsCornerstone: jest.fn( () => false ),
	getTermFocusKeyphrase: jest.fn( () => "panda" ),
	getPostCategories: jest.fn( () => [
		{
			id: "1",
			name: "category 1",
		},
		{
			id: "2",
			name: "category 2",
		},
	] ),
	getPostTags: jest.fn( () => [ "cats", "dogs" ] ),
	getCustomTaxonomies: jest.fn( () => {
		return {
			actors: [
				{
					id: "1",
					name: "actor 1",
				},
				{
					id: "2",
					name: "actor 2",
				},
			],
			directors: [ "Spike Lee", "Steven Spielberg" ],
		};
	} ),
	getPostFacebookTitle: jest.fn( () => "An FB title for post" ),
	getPostFacebookDescription: jest.fn( () => "An FB meta description for post" ),
	getPostFacebookImageID: jest.fn( () => 7 ),
	getPostFacebookImageUrl: jest.fn( () => "www.example.com/images/good-cat.jpeg" ),
	getPostTwitterTitle: jest.fn( () => "A Twitter title for post" ),
	getPostTwitterDescription: jest.fn( () => "A Twitter meta description for post" ),
	getPostTwitterImageID: jest.fn( () => 10 ),
	getPostTwitterImageUrl: jest.fn( () => "www.example.com/images/good-cat-on-twitter.jpeg" ),
	getTermFacebookTitle: jest.fn( () => "An FB title for term" ),
	getTermFacebookDescription: jest.fn( () => "An FB meta description for term" ),
	getTermFacebookImageID: jest.fn( () => 4 ),
	getTermFacebookImageUrl: jest.fn( () => "www.example.com/images/best-cat-on-fb.jpeg" ),
	getTermTwitterTitle: jest.fn( () => "A Twitter title for term" ),
	getTermTwitterDescription: jest.fn( () => "A Twitter meta description for term" ),
	getTermTwitterImageID: jest.fn( () => 6 ),
	getTermTwitterImageUrl: jest.fn( () => "www.example.com/images/best-cat-on-twitter.jpeg" ),
} ) );

self.wpseoScriptData = {
	metabox: {
		title_template_no_fallback: "The only appropriate title for cat contents",
		title_template: "A title template for everything about cats",
		metadesc_template: "A meta description template for everything about cats",
		social_description_template: "A social template for meta description",
		social_title_template: "A social template for title",
	},
};

describe( "a test for getting the initial state of a post or a term", () => {
	it( "returns the initial state of a post", () => {
		const actual = getInitialPostState();
		expect( actual.analysis.config.shouldApplyCornerstoneAnalysis ).toEqual( false );
		expect( actual.editor.title ).toEqual( "Tortoiseshell cat" );
		expect( actual.editor.date ).toEqual( "18 January 2022 12:17" );
		expect( actual.editor.permalink ).toEqual( "www.example.com/123" );
		expect( actual.editor.excerpt ).toEqual( "An example of excerpt from a content." );
		expect( actual.editor.content ).toEqual( "Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material." );
		expect( actual.editor.featuredImage ).toEqual( {} );
		expect( actual.editor.locale ).toEqual( "en_US" );
		expect( actual.form.seo.title ).toEqual( "Tortoiseshell cat - All about cats" );
		expect( actual.form.seo.description ).toEqual( "Cats with tortoiseshell coloration are believed to bring good luck." );
		expect( actual.form.seo.slug ).toEqual( "www.example.com/tortoiseshell-cat" );
		expect( actual.form.seo.titleTemplate ).toEqual( "A title template for everything about cats" );
		expect( actual.form.seo.descriptionTemplate ).toEqual( "A meta description template for everything about cats" );
		expect( actual.form.keyphrases ).toEqual( { focus: { id: "focus", keyphrase: "tortoiseshell cat" } } );
		expect( actual.editor.taxonomies.categories ).toEqual( [
			{
				id: "1",
				name: "category 1",
			},
			{
				id: "2",
				name: "category 2",
			},
		] );
		expect( actual.editor.taxonomies.tags ).toEqual( [ "cats", "dogs" ] );
		expect( actual.editor.taxonomies.customTaxonomies.actors ).toEqual( [
			{
				id: "1",
				name: "actor 1",
			},
			{
				id: "2",
				name: "actor 2",
			},
		] );
		expect( actual.editor.taxonomies.customTaxonomies.directors ).toEqual( [ "Spike Lee", "Steven Spielberg" ] );
		expect( actual.form.social.facebook.title ).toEqual( "An FB title for post" );
		expect( actual.form.social.facebook.description ).toEqual( "An FB meta description for post" );
		expect( actual.form.social.facebook.image.id ).toEqual( 7 );
		expect( actual.form.social.facebook.image.url ).toEqual( "www.example.com/images/good-cat.jpeg" );
		expect( actual.form.social.twitter.title ).toEqual( "A Twitter title for post" );
		expect( actual.form.social.twitter.description ).toEqual( "A Twitter meta description for post" );
		expect( actual.form.social.twitter.image.id ).toEqual( 10 );
		expect( actual.form.social.twitter.image.url ).toEqual( "www.example.com/images/good-cat-on-twitter.jpeg" );
		expect( actual.form.social.template.description ).toEqual( "A social template for meta description" );
		expect( actual.form.social.template.title ).toEqual( "A social template for title" );
	} );

	it( "returns the initial state of a term", () => {
		const actual = getInitialTermState();
		expect( actual.analysis.config.shouldApplyCornerstoneAnalysis ).toEqual( false );
		expect( actual.analysis.config.useTaxonomy ).toEqual( true );
		expect( actual.editor.title ).toEqual( "cat" );
		expect( actual.editor.permalink ).toEqual( "www.example.com/categories" );
		expect( actual.editor.content ).toEqual( "This is to describe a cat, that deserves only good attributes to them." );
		expect( actual.editor.locale ).toEqual( "en_US" );
		expect( actual.form.seo.title ).toEqual( "A title befitting a beautiful cat" );
		expect( actual.form.seo.description ).toEqual( "An example of a description for a cat." );
		expect( actual.form.seo.slug ).toEqual( "www.example.com/categories/cat" );
		expect( actual.form.seo.titleTemplate ).toEqual( "A title template for everything about cats" );
		expect( actual.form.seo.descriptionTemplate ).toEqual( "A meta description template for everything about cats" );
		expect( actual.form.social.facebook.title ).toEqual( "An FB title for term" );
		expect( actual.form.social.facebook.description ).toEqual( "An FB meta description for term" );
		expect( actual.form.social.facebook.image.id ).toEqual( 4 );
		expect( actual.form.social.facebook.image.url ).toEqual( "www.example.com/images/best-cat-on-fb.jpeg" );
		expect( actual.form.social.twitter.title ).toEqual( "A Twitter title for term" );
		expect( actual.form.social.twitter.description ).toEqual( "A Twitter meta description for term" );
		expect( actual.form.social.twitter.image.id ).toEqual( 6 );
		expect( actual.form.social.twitter.image.url ).toEqual( "www.example.com/images/best-cat-on-twitter.jpeg" );
		expect( actual.form.social.template.description ).toEqual( "A social template for meta description" );
		expect( actual.form.social.template.title ).toEqual( "A social template for title" );
		expect( actual.form.keyphrases ).toEqual( { focus: { id: "focus", keyphrase: "panda" } } );
	} );
} );
