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
	createTagElement,
	createElement,
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

	document.body.appendChild( tagElements.parentTagElement );

	it( "should return the tags from the post, ordered alphabetically", () => {
		expect( dom.getPostTags() ).toEqual( [ "cat food", "cat snack" ] );
	} );
	it( "should return the tags alphabetically ordered, case-insensitive", () => {
		const newTag = createTagElement( "Sneaky sloth" );
		tagElements.tagsListElement.append( newTag );

		expect( dom.getPostTags() ).toEqual( [ "cat food", "cat snack", "Sneaky sloth" ] );
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

describe( "a test for setting and retrieving Twitter data to and from the DOM", () => {
	const postTwitterImageID = createElement( "span", { id: "yoast_wpseo_twitter-image-id", value: "" } );
	document.body.append( postTwitterImageID );
	it( "should return the correct post Twitter image ID based on the value that is set to the DOM", () => {
		dom.setPostTwitterImageID( "9" );
		expect( dom.getPostTwitterImageID() ).toEqual( "9" );
	} );

	const postTwitterImageUrl = createElement( "yoast_wpseo_twitter-image", "", "span" );
	document.body.append( postTwitterImageUrl );
	it( "should return the correct post Twitter image URL based on the value that is set to the DOM", () => {
		dom.setPostTwitterImageUrl( "https://example.com/assets/images/cat.jpeg" );
		expect( dom.getPostTwitterImageUrl() ).toEqual( "https://example.com/assets/images/cat.jpeg" );
	} );

	const postTwitterDescription = createElement( "yoast_wpseo_twitter-description", "", "span" );
	document.body.append( postTwitterDescription );
	it( "should return the correct post Twitter description based on the value that is set to the DOM", () => {
		dom.setPostTwitterDescription( "A tortie that wraps the human around her paws: based on the account of Ms. Zornitsa." );
		expect( dom.getPostTwitterDescription() ).toEqual( "A tortie that wraps the human around her paws: based on the account of Ms. Zornitsa." );
	} );

	const postTwitterTitle = createElement( "yoast_wpseo_twitter-title", "", "span" );
	document.body.append( postTwitterTitle );
	it( "should return the correct post Twitter title based on the value that is set to the DOM", () => {
		dom.setPostTwitterTitle( "Successful cat meow-nager" );
		expect( dom.getPostTwitterTitle() ).toEqual( "Successful cat meow-nager" );
	} );

	const termTwitterImageID = createElement( "hidden_wpseo_twitter-image-id", "", "span" );
	document.body.append( termTwitterImageID );
	it( "should return the correct term Twitter image ID based on the value that is set to the DOM", () => {
		dom.setTermTwitterImageID( "10" );
		expect( dom.getTermTwitterImageID() ).toEqual( "10" );
	} );

	const termTwitterImageUrl = createElement( "hidden_wpseo_twitter-image", "", "span" );
	document.body.append( termTwitterImageUrl );
	it( "should return the correct term Twitter image URL based on the value that is set to the DOM", () => {
		dom.setTermTwitterImageUrl( "https://example.com/assets/images/cat.jpeg" );
		expect( dom.getTermTwitterImageUrl() ).toEqual( "https://example.com/assets/images/cat.jpeg" );
	} );

	const termTwitterDescription = createElement( "hidden_wpseo_twitter-description", "", "span" );
	document.body.append( termTwitterDescription );
	it( "should return the correct term Twitter description based on the value that is set to the DOM", () => {
		dom.setTermTwitterDescription( "Types of cats based on their origin." );
		expect( dom.getTermTwitterDescription() ).toEqual( "Types of cats based on their origin." );
	} );

	const termTwitterTitle = createElement( "hidden_wpseo_twitter-title", "", "span" );
	document.body.append( termTwitterTitle );
	it( "should return the correct term Twitter title based on the value that is set to the DOM", () => {
		dom.setTermTwitterTitle( "Cat blogs: A story about cats on social Media" );
		expect( dom.getTermTwitterTitle() ).toEqual( "Cat blogs: A story about cats on social Media" );
	} );
} );

describe( "a test for setting and retrieving Facebook data to and from the DOM", () => {
	const postFacebookImageID = createElement( "yoast_wpseo_opengraph-image-id", "", "span" );
	document.body.append( postFacebookImageID );
	it( "should return the correct post Facebook image ID based on the value that is set to the DOM", () => {
		dom.setPostFacebookImageID( "9" );
		expect( dom.getPostFacebookImageID() ).toEqual( "9" );
	} );

	const postFacebookImageUrl = createElement( "yoast_wpseo_opengraph-image", "", "span" );
	document.body.append( postFacebookImageUrl );
	it( "should return the correct post Facebook image URL based on the value that is set to the DOM", () => {
		dom.setPostFacebookImageUrl( "https://example.com/assets/images/cat.jpeg" );
		expect( dom.getPostFacebookImageUrl() ).toEqual( "https://example.com/assets/images/cat.jpeg" );
	} );

	const postFacebookDescription = createElement( "yoast_wpseo_opengraph-description", "", "span" );
	document.body.append( postFacebookDescription );
	it( "should return the correct post Facebook description based on the value that is set to the DOM", () => {
		dom.setPostFacebookDescription( "A tortie that wraps the human around her paws: based on the account of Ms. Zornitsa." );
		expect( dom.getPostFacebookDescription() ).toEqual( "A tortie that wraps the human around her paws: based on the account of Ms. Zornitsa." );
	} );

	const postFacebookTitle = createElement( "yoast_wpseo_opengraph-title", "", "span" );
	document.body.append( postFacebookTitle );
	it( "should return the correct post Facebook title based on the value that is set to the DOM", () => {
		dom.setPostFacebookTitle( "Successful cat meow-nager" );
		expect( dom.getPostFacebookTitle() ).toEqual( "Successful cat meow-nager" );
	} );

	const termFacebookImageID = createElement( "hidden_wpseo_opengraph-image-id", "", "span" );
	document.body.append( termFacebookImageID );
	it( "should return the correct term Facebook image ID based on the value that is set to the DOM", () => {
		dom.setTermFacebookImageID( "10" );
		expect( dom.getTermFacebookImageID() ).toEqual( "10" );
	} );

	const termFacebookImageUrl = createElement( "hidden_wpseo_opengraph-image", "", "span" );
	document.body.append( termFacebookImageUrl );
	it( "should return the correct term Facebook image URL based on the value that is set to the DOM", () => {
		dom.setTermFacebookImageUrl( "https://example.com/assets/images/cat.jpeg" );
		expect( dom.getTermFacebookImageUrl() ).toEqual( "https://example.com/assets/images/cat.jpeg" );
	} );

	const termFacebookDescription = createElement( "hidden_wpseo_opengraph-description", "", "span" );
	document.body.append( termFacebookDescription );
	it( "should return the correct term Twitter description based on the value that is set to the DOM", () => {
		dom.setTermFacebookDescription( "Types of cats based on their origin." );
		expect( dom.getTermFacebookDescription() ).toEqual( "Types of cats based on their origin." );
	} );

	const termFacebookTitle = createElement( "hidden_wpseo_opengraph-title", "", "span" );
	document.body.append( termFacebookTitle );
	it( "should return the correct term Facebook title based on the value that is set to the DOM", () => {
		dom.setTermFacebookTitle( "Cat blogs: A story about cats on social Media" );
		expect( dom.getTermFacebookTitle() ).toEqual( "Cat blogs: A story about cats on social Media" );
	} );
} );
