/* eslint-disable camelcase */
import * as dom from "../../../src/classic-editor/helpers/dom";
import getContentLocale from "../../../src/analysis/getContentLocale";
import {
	createAllCategoryElements,
	createMostUsedCategoryElements,
	createAllTagElements,
	createAllHierarchicalCTElements,
	createMostUsedCTElements,
	createNonHierarchicalCTElements,
	createSlugElements,
} from "../../testHelpers/createDomTestData";

jest.mock( "../../../src/lib/tinymce", () => ( {
	getContentTinyMce: jest.fn().mockReturnValue(
		"Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. " +
		"Like calicos, tortoiseshell cats are almost exclusively female. " +
		"Male tortoiseshells are rare and are usually sterile." ),
} ) );

jest.mock( "../../../src/analysis/getContentLocale", () => jest.fn( () => "" ) );

describe( "a test for retrieving data from dom", () => {
	it( "should return the correct default meta description limit", () => {
		getContentLocale.mockImplementation( () => "en_US" );

		expect( dom.getMetaDescriptionLimit() ).toEqual( 156 );
	} );
} );

describe( "a test for retrieving data from dom with another locale setting", () => {
	it( "should return the meta description limit for Japanese", () => {
		getContentLocale.mockImplementation( () => "ja" );

		expect( dom.getMetaDescriptionLimit() ).toEqual( 80 );
	} );
} );

describe( "a test for retrieving categories from the DOM", () => {
	const allCategoryElements = createAllCategoryElements();
	const mostUsedCategoryElements = createMostUsedCategoryElements();

	document.body.append( allCategoryElements.allCategories, mostUsedCategoryElements );

	it( "should return the categories from the 'All Categories' section", () => {
		expect( dom.getPostCategoryCheckboxes() ).toEqual( [
			allCategoryElements.allCategoryCheckboxes.cat1,
			allCategoryElements.allCategoryCheckboxes.cat2,
			allCategoryElements.allCategoryCheckboxes.cat3,
			allCategoryElements.allCategoryCheckboxes.cat4,
			allCategoryElements.allCategoryCheckboxes.cat5,
		] );
	} );
	it( "should return the categories from the 'Most Used' section", () => {
		expect( dom.getPostMostUsedCategoryCheckboxes() ).toEqual( [
			allCategoryElements.allCategoryCheckboxes.cat1,
			allCategoryElements.allCategoryCheckboxes.cat2,
		] );
	} );
	it( "should return the checked categories", () => {
		expect( dom.getPostCategories() ).toEqual( [ ] );
		allCategoryElements.allCategoryCheckboxes.cat1.checked = true;
		expect( dom.getPostCategories()[ 0 ].name ).toEqual( "cat1"  );
		allCategoryElements.allCategoryCheckboxes.cat1.checked = false;
		allCategoryElements.allCategoryCheckboxes.cat2.checked = true;
		expect( dom.getPostCategories()[ 0 ].name ).toEqual( "cat2"  );
		allCategoryElements.allCategoryCheckboxes.cat2.checked = false;
		expect( dom.getPostCategories() ).toEqual( [ ] );
	} );
	it( "should return the checked categories, ordered alphabetically", () => {
		// Cat5: "dogs", cat4: "Birds", cat3: "cat3".
		allCategoryElements.allCategoryCheckboxes.cat5.checked = true;
		allCategoryElements.allCategoryCheckboxes.cat4.checked = true;
		allCategoryElements.allCategoryCheckboxes.cat3.checked = true;

		expect( dom.getPostCategories() ).toEqual( [
			{ id: "4", name: "Birds" },
			{ id: "3", name: "cat3" },
			{ id: "5", name: "dogs" },
		] );
	} );
} );

describe( "a test for retrieving tags from the document", () => {
	const tagElements = createAllTagElements();

	document.body.appendChild( tagElements );

	it( "should return the tags from the post, ordered alphabetically", () => {
		expect( dom.getPostTags() ).toEqual( [ "cat food", "cat snack" ] );
		// Remove the previous tags elements after the test is run, so that this element wouldn't be returned next time the test
		// For non-hierarchical taxonomy is run.
		document.body.removeChild( tagElements );
	} );
} );

const slugElements = createSlugElements();

describe( "a test for retrieving post slugs from the DOM", () => {
	document.body.appendChild( slugElements.slugEditDiv );
	document.body.appendChild( slugElements.postNameElement );

	it( "should return the post full length slug", () => {
		expect( dom.getPostEditSlugFull() ).toEqual( "best-cat-food" );
	} );
	it( "should overwrite the full length slug text with the new value that is passed", () => {
		expect( dom.setPostSlugFull( "best-cat-food-2" ) ).toEqual( slugElements.fullLengthSlugElement );
		expect( dom.getPostEditSlugFull() ).toEqual( "best-cat-food-2" );
	} );
	it( "should return the post shortened slug", () => {
		expect( dom.getPostEditSlug() ).toEqual( "best-cat" );
	} );
	it( "should overwrite the short slug text with the new value that is passed", () => {
		expect( dom.setPostSlug( "best-cat-2" ) ).toEqual( slugElements.shortSlugElement );
		expect( dom.getPostEditSlug() ).toEqual( "best-cat-2" );
	} );
	it( "should return the post name", () => {
		expect( dom.getPostName() ).toEqual( "cat-toys" );
	} );
	it( "should overwrite the post name value with the new value that is passed", () => {
		expect( dom.setPostName( "cat-toys-2" ) ).toEqual( slugElements.postNameElement );
		expect( dom.getPostName() ).toEqual( "cat-toys-2" );
	} );
	it( "should return the slug from post edit if there is no new slug available", () => {
		expect( dom.getPostSlug() ).toEqual( "best-cat-food-2" );
	} );
	it( "should return the new slug if it's not undefined", () => {
		const newSlug = document.createElement( "input" );
		newSlug.setAttribute( "id", "new-post-slug" );
		newSlug.setAttribute( "value", "cat-snacks" );
		slugElements.slugEditDiv.appendChild( newSlug );

		expect( dom.getPostSlug() ).toEqual( "cat-snacks" );
	} );
	it( "should return an empty string if the new slug and slug from post edit are undefined", () => {
		slugElements.slugEditDiv.removeChild( slugElements.slugEditDiv.firstChild );
		slugElements.slugEditDiv.removeChild( slugElements.slugEditDiv.lastChild );

		expect( dom.getPostSlug() ).toEqual( "" );
	} );
} );

describe( "a test for retrieving term slug from the DOM", () => {
	document.body.appendChild( slugElements.termSlugElement );

	it( "should return the term slug", () => {
		expect( dom.getTermSlug() ).toEqual( "cat-adoption" );
	} );
	it( "should overwrite the term slug value with the new value that is passed", () => {
		expect( dom.setTermSlug( "how-to-adopt-cat" ) ).toEqual( slugElements.termSlugElement );
		expect( dom.getTermSlug() ).toEqual( "how-to-adopt-cat" );
	} );
} );

describe( "a test for retrieving the post excerpt from the DOM", () => {
	const excerptElement = document.createElement( "input" );
	excerptElement.setAttribute( "id", "excerpt" );
	excerptElement.setAttribute( "value", "Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. " +
		"Like calicos, tortoiseshell cats are almost exclusively female." );

	document.body.appendChild( excerptElement );

	it( "should return the post excerpt", () => {
		expect( dom.getPostExcerpt() ).toEqual( "Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. " +
			"Like calicos, tortoiseshell cats are almost exclusively female." );
	} );
} );

self.wpseoScriptData = {
	analysis: {
		plugins: {
			replaceVars: {
				replace_vars: {
					custom_taxonomies: {
						actors: {
							description: "",
							name: "actors",
						},
						directors: {
							description: "",
							name: "directors",
						},
					},
				},
			},
		},
	},
};

describe( "a test for retrieving custom taxonomies from the DOM", () => {
	const allHierarchicalCTElements = createAllHierarchicalCTElements();
	const mostUsedCTElements = createMostUsedCTElements();
	const nonHierarchicalCTElements = createNonHierarchicalCTElements();

	document.body.appendChild( allHierarchicalCTElements.allCTElements );
	document.body.appendChild( mostUsedCTElements );
	document.body.appendChild( nonHierarchicalCTElements );

	const names = dom.getCTNames();
	it( "should return the hierarchical custom taxonomies from the 'All custom taxonomies' section", () => {
		expect( dom.getCTCheckboxes( names[ 0 ] ) ).toEqual( [
			allHierarchicalCTElements.allCTCheckboxes.actor1,
			allHierarchicalCTElements.allCTCheckboxes.actor2,
			allHierarchicalCTElements.allCTCheckboxes.actor3,
		] );
		expect( dom.getCTCheckboxes( names[ 1 ] ) ).toEqual( [] );
	} );
	it( "should return the hierarchical custom taxonomies from the 'Most Used' section", () => {
		expect( dom.getMostUsedCTCheckboxes(  names[ 0 ] ) ).toEqual( [
			allHierarchicalCTElements.allCTCheckboxes.actor1,
			allHierarchicalCTElements.allCTCheckboxes.actor2,
		] );
		expect( dom.getMostUsedCTCheckboxes(  names[ 1 ] ) ).toEqual( [] );
	} );
	it( "should return the checked hierarchical custom taxonomies", () => {
		expect( dom.getCustomTaxonomies()[ names[ 0 ] ] ).toEqual( [] );
		allHierarchicalCTElements.allCTCheckboxes.actor1.checked = true;
		expect( dom.getCustomTaxonomies()[ names[ 0 ] ][ 0 ].name ).toEqual( "actor1"  );
		allHierarchicalCTElements.allCTCheckboxes.actor1.checked = false;
		allHierarchicalCTElements.allCTCheckboxes.actor2.checked = true;
		expect( dom.getCustomTaxonomies()[ names[ 0 ] ][ 0 ].name  ).toEqual( "actor2"  );
		allHierarchicalCTElements.allCTCheckboxes.actor2.checked = false;
		expect( dom.getCustomTaxonomies()[ names[ 0 ] ] ).toEqual( [] );
	} );

	it( "should return the non-hierarchical custom taxonomy from the post, ordered alphabetically", () => {
		expect( dom.getCustomTaxonomies()[ names[ 1 ] ] ).toEqual( [ "Spike Lee", "Steven Spielberg" ] );
	} );
} );
