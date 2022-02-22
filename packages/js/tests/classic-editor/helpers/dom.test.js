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
