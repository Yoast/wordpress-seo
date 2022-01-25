import { getMetaDescriptionLimit, getPostExcerpt, getTermExcerpt } from "../../../src/classic-editor/helpers/dom";
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

		expect( getMetaDescriptionLimit() ).toEqual( 156 );
		expect( getPostExcerpt() ).toEqual(
			"Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. " +
			"Like calicos, tortoiseshell cats are almost exclusively female." );
	} );

	it( "should return the term excerpt retrieved from term content", () => {
		getContentLocale.mockImplementation( () => "en_US" );

		expect( getMetaDescriptionLimit() ).toEqual( 156 );
		expect( getTermExcerpt() ).toEqual(
			"Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. " +
			"Like calicos, tortoiseshell cats are almost exclusively female." );
	} );
} );

describe( "a test for retrieving data from dom with another locale setting", () => {
	it( "should return the term excerpt retrieved from post content, but use the limit for Japanese", () => {
		getContentLocale.mockImplementation( () => "ja" );

		expect( getMetaDescriptionLimit() ).toEqual( 80 );
		expect( getPostExcerpt() ).toEqual(
			"Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell" );
	} );

	it( "should return the term excerpt retrieved from term content, but use the limit for Japanese", () => {
		getContentLocale.mockImplementation( () => "ja" );

		expect( getMetaDescriptionLimit() ).toEqual( 80 );
		expect( getTermExcerpt() ).toEqual(
			"Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell" );
	} );
} );
