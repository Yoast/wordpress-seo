import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Local module mocks — no factory; auto-mock creates jest.fn() for each export.
// Importing after jest.mock() gives a reference to the mock function.
jest.mock( "../../src/elementor-v4/content-walker" );
jest.mock( "../../src/elementor-v4/document-tree" );
jest.mock( "../../src/helpers/firstImageUrlInContent" );
jest.mock( "../../src/helpers/replacementVariableHelpers" );
jest.mock( "../../src/analysis/getContentLocale" );

import { buildContentAndMap } from "../../src/elementor-v4/content-walker";
import { getDocumentTree } from "../../src/elementor-v4/document-tree";
import firstImageUrlInContent from "../../src/helpers/firstImageUrlInContent";
import { excerptFromContent } from "../../src/helpers/replacementVariableHelpers";
import getContentLocale from "../../src/analysis/getContentLocale";
import { getEditorData } from "../../src/elementor-v4/editor-data";

const mockPageModelGet = jest.fn();

global.elementor = {
	settings: {
		page: {
			model: { get: mockPageModelGet },
		},
	},
};

const PAGE_SETTING_KEYS = {
	TITLE: "post_title",
	EXCERPT: "post_excerpt",
	STATUS: "post_status",
	FEATURED_IMAGE: "post_featured_image",
};

const defaultSettings = {
	[ PAGE_SETTING_KEYS.TITLE ]: "My Post",
	[ PAGE_SETTING_KEYS.EXCERPT ]: "",
	[ PAGE_SETTING_KEYS.STATUS ]: "draft",
	[ PAGE_SETTING_KEYS.FEATURED_IMAGE ]: null,
};

// The walker reads from editorDocument.$element; getEditorData passes it straight through.
const makeEditorDocument = () => ( { $element: { find: jest.fn() } } );

beforeEach( () => {
	jest.clearAllMocks();
	mockPageModelGet.mockImplementation( ( key ) => defaultSettings[ key ] ?? null );
	getDocumentTree.mockReturnValue( [] );
	buildContentAndMap.mockReturnValue( { content: "", widgets: [] } );
	firstImageUrlInContent.mockReturnValue( "" );
	excerptFromContent.mockReturnValue( "generated excerpt" );
	getContentLocale.mockReturnValue( "en" );
} );

describe( "getEditorData", () => {
	it( "returns the content produced by buildContentAndMap from the document's preview element", () => {
		const tree = [ { id: "h1", widgetType: "e-heading" } ];
		const editorDocument = makeEditorDocument();
		getDocumentTree.mockReturnValue( tree );
		buildContentAndMap.mockReturnValue( { content: "<h1>Hello</h1>", widgets: [] } );

		const result = getEditorData( editorDocument );

		expect( getDocumentTree ).toHaveBeenCalledWith( editorDocument );
		expect( buildContentAndMap ).toHaveBeenCalledWith( tree, editorDocument.$element );
		expect( result.content ).toBe( "<h1>Hello</h1>" );
	} );

	it( "returns title and status from elementor page settings", () => {
		mockPageModelGet.mockImplementation( ( key ) => ( {
			[ PAGE_SETTING_KEYS.TITLE ]: "SEO Title",
			[ PAGE_SETTING_KEYS.STATUS ]: "publish",
			[ PAGE_SETTING_KEYS.EXCERPT ]: "",
			[ PAGE_SETTING_KEYS.FEATURED_IMAGE ]: null,
		} )[ key ] ?? null );

		const result = getEditorData( makeEditorDocument() );

		expect( result.title ).toBe( "SEO Title" );
		expect( result.status ).toBe( "publish" );
	} );

	it( "uses post_excerpt when set", () => {
		mockPageModelGet.mockImplementation( ( key ) => key === PAGE_SETTING_KEYS.EXCERPT ? "Hand-written excerpt." : null );

		const result = getEditorData( makeEditorDocument() );

		expect( result.excerpt ).toBe( "Hand-written excerpt." );
		expect( excerptFromContent ).not.toHaveBeenCalled();
	} );

	it( "falls back to excerptFromContent when post_excerpt is absent", () => {
		buildContentAndMap.mockReturnValue( { content: "<p>Long content here.</p>", widgets: [] } );
		excerptFromContent.mockReturnValue( "Auto-generated excerpt." );

		const result = getEditorData( makeEditorDocument() );

		expect( excerptFromContent ).toHaveBeenCalledWith( "<p>Long content here.</p>", 156 );
		expect( result.excerpt ).toBe( "Auto-generated excerpt." );
	} );

	it( "uses a character limit of 80 for the Japanese locale", () => {
		getContentLocale.mockReturnValue( "ja" );
		buildContentAndMap.mockReturnValue( { content: "<p>Content.</p>", widgets: [] } );

		getEditorData( makeEditorDocument() );

		expect( excerptFromContent ).toHaveBeenCalledWith( "<p>Content.</p>", 80 );
	} );

	it( "returns excerptOnly from post_excerpt with no content fallback", () => {
		buildContentAndMap.mockReturnValue( { content: "<p>Content.</p>", widgets: [] } );

		const resultNoExcerpt = getEditorData( makeEditorDocument() );
		expect( resultNoExcerpt.excerptOnly ).toBe( "" );

		mockPageModelGet.mockImplementation( ( key ) => key === PAGE_SETTING_KEYS.EXCERPT ? "My excerpt." : null );
		const resultWithExcerpt = getEditorData( makeEditorDocument() );
		expect( resultWithExcerpt.excerptOnly ).toBe( "My excerpt." );
	} );

	it( "prefers featuredImageUrl over contentImageUrl for imageUrl", () => {
		mockPageModelGet.mockImplementation( ( key ) => {
			if ( key === PAGE_SETTING_KEYS.FEATURED_IMAGE ) {
				return { url: "https://example.com/featured.jpg" };
			}
			return null;
		} );
		firstImageUrlInContent.mockReturnValue( "https://example.com/content.jpg" );

		const result = getEditorData( makeEditorDocument() );

		expect( result.imageUrl ).toBe( "https://example.com/featured.jpg" );
		expect( result.featuredImage ).toBe( "https://example.com/featured.jpg" );
	} );

	it( "falls back to contentImageUrl when no featured image is set", () => {
		firstImageUrlInContent.mockReturnValue( "https://example.com/content.jpg" );

		const result = getEditorData( makeEditorDocument() );

		expect( result.imageUrl ).toBe( "https://example.com/content.jpg" );
		expect( result.contentImage ).toBe( "https://example.com/content.jpg" );
		expect( result.featuredImage ).toBe( "" );
	} );
} );
