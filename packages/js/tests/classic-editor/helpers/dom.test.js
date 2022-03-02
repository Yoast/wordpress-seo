import * as dom from "../../../src/classic-editor/helpers/dom";
import getContentLocale from "../../../src/analysis/getContentLocale";

jest.mock( "../../../src/lib/tinymce", () => ( {
	getContentTinyMce: jest.fn().mockReturnValue(
		"Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. " +
		"Like calicos, tortoiseshell cats are almost exclusively female. " +
		"Male tortoiseshells are rare and are usually sterile." ),
} ) );

jest.mock( "../../../src/analysis/getContentLocale", () => jest.fn( () => "" ) );

describe( "a test for retrieving data from dom", () => {
	it( "should return the term excerpt retrieved from post content", () => {
		getContentLocale.mockImplementation( () => "en_US" );

		expect( dom.getMetaDescriptionLimit() ).toEqual( 156 );
		expect( dom.getPostExcerpt() ).toEqual(
			"Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. " +
			"Like calicos, tortoiseshell cats are almost exclusively female." );
	} );
} );

describe( "a test for retrieving data from dom with another locale setting", () => {
	it( "should return the term excerpt retrieved from post content, but use the limit for Japanese", () => {
		getContentLocale.mockImplementation( () => "ja" );

		expect( dom.getMetaDescriptionLimit() ).toEqual( 80 );
		expect( dom.getPostExcerpt() ).toEqual(
			"Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell" );
	} );
} );

describe( "a test for retrieving categories from the DOM", () => {
	const cat1 = document.createElement( "input" );
	cat1.setAttribute( "type", "checkbox" );
	cat1.setAttribute( "value", "cat1" );
	const cat2 = document.createElement( "input" );
	cat2.setAttribute( "type", "checkbox" );
	cat2.setAttribute( "value", "cat2" );
	const cat3 = document.createElement( "input" );
	cat3.setAttribute( "type", "checkbox" );
	cat3.setAttribute( "value", "cat3" );

	const allCats = document.createElement( "div" );
	allCats.setAttribute( "id", "categorychecklist" );
	allCats.appendChild( cat1 );
	allCats.appendChild( cat2 );
	allCats.appendChild( cat3 );

	const mostUsedCats = document.createElement( "div" );
	mostUsedCats.setAttribute( "id", "categorychecklist-pop" );
	mostUsedCats.appendChild( cat1.cloneNode() );
	mostUsedCats.appendChild( cat2.cloneNode() );

	document.body.appendChild( allCats );
	document.body.appendChild( mostUsedCats );

	it( "should return the categories from the 'All Categories' section", () => {
		expect( dom.getPostCategoryCheckboxes() ).toEqual( [ cat1, cat2, cat3 ] );
	} );
	it( "should return the categories from the 'Most Used' section", () => {
		expect( dom.getPostMostUsedCategoryCheckboxes() ).toEqual( [ cat1, cat2 ] );
	} );
	it( "should return the checked categories", () => {
		expect( dom.getPostCategories() ).toEqual( [ ] );
		cat1.checked = true;
		expect( dom.getPostCategories()[ 0 ].id ).toEqual( "cat1"  );
		cat1.checked = false;
		cat2.checked = true;
		expect( dom.getPostCategories()[ 0 ].id ).toEqual( "cat2"  );
		cat2.checked = false;
		expect( dom.getPostCategories() ).toEqual( [ ] );
	} );
} );

describe( "a test for retrieving post slugs from the DOM", () => {
	const fullLengthSlugElement = document.createElement( "span" );
	fullLengthSlugElement.setAttribute( "id", "editable-post-name-full" );

	const fullLengthSlugText = document.createTextNode( "best-cat-food" );
	fullLengthSlugElement.appendChild( fullLengthSlugText );

	const shortSlugElement = document.createElement( "span" );
	shortSlugElement.setAttribute( "id", "editable-post-name" );

	const shortSlugText = document.createTextNode( "best-cat" );
	shortSlugElement.appendChild( shortSlugText );

	const slugEditDiv = document.createElement( "div" );
	slugEditDiv.appendChild( fullLengthSlugElement );
	slugEditDiv.appendChild( shortSlugElement );

	const postNameElement = document.createElement( "input" );
	postNameElement.setAttribute( "id", "post_name" );
	postNameElement.setAttribute( "value", "cat-toys" );

	document.body.appendChild( slugEditDiv );
	document.body.appendChild( postNameElement );

	it( "should return the post full length slug", () => {
		expect( dom.getPostEditSlugFull() ).toEqual( "best-cat-food" );
	} );
	it( "should overwrite the full length slug text with the new value that is passed", () => {
		expect( dom.setPostSlugFull( "best-cat-food-2" ) ).toEqual( fullLengthSlugElement );
		expect( dom.getPostEditSlugFull() ).toEqual( "best-cat-food-2" );
	} );
	it( "should return the post shortened slug", () => {
		expect( dom.getPostEditSlug() ).toEqual( "best-cat" );
	} );
	it( "should overwrite the short slug text with the new value that is passed", () => {
		expect( dom.setPostSlug( "best-cat-2" ) ).toEqual( shortSlugElement );
		expect( dom.getPostEditSlug() ).toEqual( "best-cat-2" );
	} );
	it( "should return the post name", () => {
		expect( dom.getPostName() ).toEqual( "cat-toys" );
	} );
	it( "should overwrite the post name value with the new value that is passed", () => {
		expect( dom.setPostName( "cat-toys-2" ) ).toEqual( postNameElement );
		expect( dom.getPostName() ).toEqual( "cat-toys-2" );
	} );
	it( "should return the slug from post edit if there is no new slug available", () => {
		expect( dom.getPostSlug() ).toEqual( "best-cat-food-2" );
	} );
	it( "should return the new slug if it's not undefined", () => {
		const newSlug = document.createElement( "input" );
		newSlug.setAttribute( "id", "new-post-slug" );
		newSlug.setAttribute( "value", "cat-snacks" );
		slugEditDiv.appendChild( newSlug );

		expect( dom.getPostSlug() ).toEqual( "cat-snacks" );
	} );
	it( "should return an empty string if the new slug and slug from post edit are undefined", () => {
		slugEditDiv.removeChild( slugEditDiv.firstChild );
		slugEditDiv.removeChild( slugEditDiv.lastChild );

		expect( dom.getPostSlug() ).toEqual( "" );
	} );
} );

describe( "a test for retrieving term slug from the DOM", () => {
	const slugElement = document.createElement( "input" );
	slugElement.setAttribute( "id", "slug" );
	slugElement.setAttribute( "value", "cat-adoption" );

	document.body.appendChild( slugElement );

	it( "should return the term slug", () => {
		expect( dom.getTermSlug() ).toEqual( "cat-adoption" );
	} );
	it( "should overwrite the term slug value with the new value that is passed", () => {
		expect( dom.setTermSlug( "how-to-adopt-cat" ) ).toEqual( slugElement );
		expect( dom.getTermSlug() ).toEqual( "how-to-adopt-cat" );
	} );
} );
